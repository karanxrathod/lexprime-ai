/**
 * Clause Enforceability Service
 * Evaluates legal validity and regional enforceability of contract terms.
 */

import type { ClauseEnforceabilityResult, Citation } from '../../types/legal';
import { generateContentWithFallback, GEMINI_MODEL_FAST } from './geminiClient';
import { safeParseJson } from './documentAnalysis';
import { isSafeUrl } from '../../utils/sanitizer';
import { logger } from '../../utils/logger';

export interface EnforceabilityParams {
  clause: string;
  jurisdiction: string;
  language: 'en' | 'hi' | 'mr';
}

export async function analyzeClauseEnforceabilityWithGemini(
  params: EnforceabilityParams
): Promise<ClauseEnforceabilityResult> {
  const { clause, jurisdiction, language } = params;

  logger.info('[Enforceability] Analyzing clause for jurisdiction:', jurisdiction);

  const langName = language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English';

  const prompt = [
    'You are LexPrime AI, a legal enforceability specialist.',
    'Given a single legal clause and a specified jurisdiction, return a strict JSON object describing its enforceability and legal standing.',
    '',
    'JSON Schema:',
    '{',
    '  "clause": "string",',
    '  "jurisdiction": "string",',
    '  "simplifiedMeaning": "string",',
    '  "status": "enforceable" | "restricted" | "not_enforceable" | "uncertain",',
    '  "jurisdictionNotes": "string",',
    '  "references": [ { "title": "string", "url": "string", "description": "string" } ],',
    '  "alternatives": ["string"]',
    '}',
    '',
    `Language for simplifiedMeaning and jurisdictionNotes: ${langName}.`,
    'Assess enforceability strictly based on established legal principles in the named jurisdiction.',
    'Never fabricate case laws or fake URLs. If no verified link exists, leave url as an empty string.',
    'Return ONLY valid JSON without conversational wrapper.',
    '',
    `Jurisdiction: ${jurisdiction}`,
    'Clause:',
    clause,
  ].join('\n');

  const { text } = await generateContentWithFallback({
    model: GEMINI_MODEL_FAST,
    contents: prompt,
    config: {
      temperature: 0.2,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
    },
  });

  const data = safeParseJson<any>(text);

  const safeStr = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);
  const safeArray = (v: unknown): any[] => (Array.isArray(v) ? v : []);
  const validStatus = (s: unknown): ClauseEnforceabilityResult['status'] => {
    return ['enforceable', 'restricted', 'not_enforceable', 'uncertain'].includes(String(s))
      ? (s as ClauseEnforceabilityResult['status'])
      : 'uncertain';
  };

  return {
    clause: safeStr(data?.clause, clause),
    jurisdiction: safeStr(data?.jurisdiction, jurisdiction),
    simplifiedMeaning: safeStr(data?.simplifiedMeaning),
    status: validStatus(data?.status),
    jurisdictionNotes: safeStr(data?.jurisdictionNotes),
    references: safeArray(data?.references)
      .filter((ct: any) => ct && typeof ct === 'object' && ct.title)
      .map((ct: any): Citation => ({
        title: safeStr(ct.title),
        url: isSafeUrl(ct.url) ? ct.url : '',
        description: safeStr(ct.description),
      })),
    alternatives: safeArray(data?.alternatives).map((s) => safeStr(s)).filter(Boolean),
  };
}
