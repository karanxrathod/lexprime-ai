/**
 * Document Analysis Service
 * Handles AI-powered legal document parsing, clause breakdown, risk assessment,
 * action item extraction, citations, and strategic negotiation counter-proposals.
 */

import { jsonrepair } from 'jsonrepair';
import type { DocumentAnalysis, SimplificationLevel, Clause, Risk, NegotiationPoint, Citation } from '../../types/legal';
import { generateContentWithFallback, GEMINI_MODEL_FAST } from './geminiClient';
import { splitTextIntoChunks } from '../documents/chunking';
import { runWithConcurrency } from '../../utils/concurrencyPool';
import { logger } from '../../utils/logger';
import { isSafeUrl } from '../../utils/sanitizer';
import { getUserFriendlyErrorMessage } from '../../utils/errorMessage';

export { getUserFriendlyErrorMessage };

export interface AnalyzeParams {
  content: string;
  language: 'en' | 'hi' | 'mr';
  simplificationLevel: SimplificationLevel;
}

export function extractBalancedBraces(text: string): string | null {
  let depth = 0;
  let started = false;
  let startIndex = -1;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') {
      if (!started) {
        started = true;
        startIndex = i;
      }
      depth++;
    } else if (ch === '}') {
      if (started) {
        depth--;
        if (depth === 0) {
          return text.slice(startIndex, i + 1);
        }
      }
    }
  }
  return null;
}

export function extractJsonFromText(raw: string): string | null {
  if (!raw || typeof raw !== 'string') return null;

  // 1. Prefer fenced ```json ... ``` blocks
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch && fenceMatch[1]) {
    const candidate = fenceMatch[1].trim();
    const braceCandidate = extractBalancedBraces(candidate);
    if (braceCandidate) return braceCandidate;
  }

  // 2. Locate first balanced { ... } in the entire text
  return extractBalancedBraces(raw);
}

export function safeParseJson<T = unknown>(raw: string): T {
  if (!raw || typeof raw !== 'string' || raw.trim() === '') {
    throw new Error('Non-JSON response: input is empty');
  }

  const trimmed = raw.trim();

  // 1. Direct standard JSON parse if pure JSON
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as T;
      }
    } catch {
      // Continue
    }
  }

  // 2. Extract JSON object portion from text or fences
  const extracted = extractJsonFromText(raw);
  if (extracted) {
    try {
      const parsed = JSON.parse(extracted);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as T;
      }
    } catch {
      // Try repair on extracted portion
    }

    try {
      const repaired = jsonrepair(extracted);
      const parsed = JSON.parse(repaired);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as T;
      }
    } catch {
      // Continue
    }
  }

  // 3. Try repair on trimmed if it has object brackets
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const repaired = jsonrepair(trimmed);
      const parsed = JSON.parse(repaired);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as T;
      }
    } catch {
      // Continue
    }
  }

  throw new Error('Non-JSON response received from AI model');
}

export function hasDevanagari(text: string): boolean {
  if (!text) return false;
  const match = text.match(/[\u0900-\u097F]/g);
  return !!(match && match.length > 10);
}

export function buildChunkPrompt(
  content: string,
  language: 'en' | 'hi' | 'mr',
  level: SimplificationLevel,
  index: number,
  total: number
): string {
  const langName = language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English';
  return [
    `You are LexPrime AI, an expert legal analyst. Analyze chunk ${index} of ${total} of this legal document.`,
    `Return ONLY a strict, valid JSON object matching this schema:`,
    '',
    '{',
    '  "documentType": "string",',
    '  "clauses": [',
    '    {',
    '      "id": "string",',
    '      "title": "string",',
    '      "originalText": "string",',
    '      "simplifiedText": "string",',
    '      "riskLevel": "low" | "medium" | "high",',
    '      "explanation": "string",',
    '      "rolePerspectives": [',
    '        { "role": "Tenant" | "Landlord" | "Employee" | "Employer" | "Consumer" | "Business", "interpretation": "string", "obligations": ["string"], "risks": ["string"] }',
    '      ]',
    '    }',
    '  ],',
    '  "risks": [',
    '    { "id": "string", "clause": "string", "description": "string", "severity": "low" | "medium" | "high", "recommendation": "string" }',
    '  ],',
    '  "actionPoints": ["string"],',
    '  "citations": [',
    '    { "title": "string", "url": "string", "description": "string" }',
    '  ],',
    '  "negotiationPoints": [',
    '    { "id": "string", "clauseId": "string", "originalClause": "string", "issue": "string", "counterProposal": "string", "talkingPoint": "string" }',
    '  ]',
    '}',
    '',
    `Strict Requirements:`,
    `- Language: All explanations, simplified text, and recommendations MUST be in ${langName}.`,
    `- Simplification level: ${level}.`,
    `- For every high-risk clause, YOU MUST generate a negotiation point with an actionable counter-proposal.`,
    `- Quote clause originalText accurately from the chunk.`,
    `- Do not hallucinate external facts or invent fake URLs. If no citations apply, return an empty array.`,
    `- Return JSON only, without conversational markdown introduction or sign-off.`,
    '',
    'Chunk Text:',
    content,
  ].join('\n');
}

export function mapToDocumentAnalysis(data: any): DocumentAnalysis {
  const safeStr = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);
  const safeArray = (v: unknown): any[] => (Array.isArray(v) ? v : []);

  const clauses: Clause[] = safeArray(data?.clauses).map((c: any, idx: number) => ({
    id: safeStr(c.id, String(idx + 1)),
    title: safeStr(c.title, `Clause ${idx + 1}`),
    originalText: safeStr(c.originalText),
    simplifiedText: safeStr(c.simplifiedText),
    riskLevel: (c.riskLevel === 'high' || c.riskLevel === 'medium' || c.riskLevel === 'low') ? c.riskLevel : 'low',
    explanation: safeStr(c.explanation),
    rolePerspectives: safeArray(c.rolePerspectives).map((rp: any) => ({
      role: safeStr(rp.role, 'Consumer') as any,
      interpretation: safeStr(rp.interpretation),
      obligations: safeArray(rp.obligations).map((o: unknown) => safeStr(o)).filter(Boolean),
      risks: safeArray(rp.risks).map((r: unknown) => safeStr(r)).filter(Boolean),
    })),
  }));

  const risks: Risk[] = safeArray(data?.risks).map((r: any, idx: number) => ({
    id: safeStr(r.id, `risk-${idx + 1}`),
    clause: safeStr(r.clause, 'General'),
    description: safeStr(r.description),
    severity: (r.severity === 'high' || r.severity === 'medium' || r.severity === 'low') ? r.severity : 'medium',
    recommendation: safeStr(r.recommendation),
  }));

  const actionPoints: string[] = safeArray(data?.actionPoints)
    .map((a: unknown) => safeStr(a).trim())
    .filter(Boolean);

  const citations: Citation[] = safeArray(data?.citations)
    .filter((cit: any) => cit && typeof cit === 'object' && cit.title)
    .map((cit: any) => ({
      title: safeStr(cit.title),
      url: isSafeUrl(cit.url) ? cit.url : '',
      description: safeStr(cit.description),
    }));

  const negotiationPoints: NegotiationPoint[] = safeArray(data?.negotiationPoints).map((np: any, idx: number) => ({
    id: safeStr(np.id, `np-${idx + 1}`),
    clauseId: safeStr(np.clauseId, ''),
    originalClause: safeStr(np.originalClause),
    issue: safeStr(np.issue),
    counterProposal: safeStr(np.counterProposal),
    talkingPoint: safeStr(np.talkingPoint),
  }));

  return {
    id: String(Date.now()),
    documentType: safeStr(data?.documentType, 'Legal Document'),
    plainSummary: safeStr(data?.plainSummary),
    clauses,
    risks,
    actionPoints,
    citations,
    negotiationPoints,
  };
}

/**
 * Main AI document analyzer with controlled concurrency, rate-limiting protection,
 * and robust chunk merging.
 */
export async function analyzeDocumentWithGemini(params: AnalyzeParams): Promise<DocumentAnalysis> {
  const { content, language, simplificationLevel } = params;

  logger.documentAction('Starting document analysis', content.length);

  const chunks = splitTextIntoChunks(content, 4000, 400);
  const merged: DocumentAnalysis = {
    id: String(Date.now()),
    documentType: 'Legal Document',
    plainSummary: '',
    clauses: [],
    risks: [],
    actionPoints: [],
    citations: [],
    negotiationPoints: [],
  };

  const seenClauseKeys = new Set<string>();
  const seenRiskKeys = new Set<string>();
  const seenActionKeys = new Set<string>();
  const seenCitationKeys = new Set<string>();

  // Process chunks with controlled concurrency (max 2 parallel tasks to protect API quotas)
  let lastError: Error | null = null;
  const chunkResults = await runWithConcurrency(
    chunks,
    async (chunkText, index) => {
      const prompt = buildChunkPrompt(chunkText, language, simplificationLevel, index + 1, chunks.length);
      try {
        const { text } = await generateContentWithFallback({
          model: GEMINI_MODEL_FAST,
          contents: prompt,
          config: {
            temperature: 0.2,
            maxOutputTokens: 2500,
            responseMimeType: 'application/json',
          },
        });
        const parsed = safeParseJson(text);
        return mapToDocumentAnalysis(parsed);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        logger.error(`[DocumentAnalysis] Error analyzing chunk ${index + 1}:`, err);
        return null;
      }
    },
    2
  );

  const validResults = chunkResults.filter(Boolean);
  if (validResults.length === 0 && chunks.length > 0) {
    throw lastError || new Error('Failed to analyze document chunks with Gemini');
  }

  // Deterministically merge chunk results
  for (const partial of chunkResults) {
    if (!partial) continue;

    if (partial.documentType && merged.documentType === 'Legal Document') {
      merged.documentType = partial.documentType;
    }

    for (const c of partial.clauses) {
      const key = `${c.title.trim()}::${c.originalText.slice(0, 50).trim()}`.toLowerCase();
      if (!seenClauseKeys.has(key)) {
        seenClauseKeys.add(key);
        merged.clauses.push(c);
      }
    }

    for (const r of partial.risks) {
      const key = `${r.clause.trim()}::${r.description.slice(0, 50).trim()}`.toLowerCase();
      if (!seenRiskKeys.has(key)) {
        seenRiskKeys.add(key);
        merged.risks.push(r);
      }
    }

    for (const a of partial.actionPoints) {
      const key = a.toLowerCase().trim();
      if (!seenActionKeys.has(key)) {
        seenActionKeys.add(key);
        merged.actionPoints.push(a);
      }
    }

    for (const cit of partial.citations) {
      const key = cit.title.toLowerCase().trim();
      if (!seenCitationKeys.has(key)) {
        seenCitationKeys.add(key);
        merged.citations.push(cit);
      }
    }

    for (const np of partial.negotiationPoints) {
      merged.negotiationPoints.push(np);
    }
  }

  // Ensure high-risk clauses have negotiation points
  for (const c of merged.clauses) {
    if (c.riskLevel === 'high') {
      const existing = merged.negotiationPoints.find((np) => np.clauseId === c.id || np.originalClause === c.originalText);
      if (!existing) {
        merged.negotiationPoints.push({
          id: `np-auto-${c.id}`,
          clauseId: c.id,
          originalClause: c.originalText,
          issue: `High risk identified in clause: ${c.title}`,
          counterProposal: `Propose standard mutual terms or liability caps to balance obligations.`,
          talkingPoint: `Request revision of ${c.title} to adhere to industry standard fairness principles.`,
        });
      }
    }
  }

  // Generate plain-language summary if missing
  if (!merged.plainSummary && merged.clauses.length > 0) {
    merged.plainSummary = `This legal document contains ${merged.clauses.length} key clauses and ${merged.risks.length} identified risk points. Please review all high-severity items and consult a legal professional before signing.`;
  }

  return merged;
}
