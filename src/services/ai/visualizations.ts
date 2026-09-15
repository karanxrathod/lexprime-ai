/**
 * Legal Visualizations Service
 * Converts complex legal agreements into visual structures:
 * Flowcharts, Timelines, Responsibility Matrices, Mindmaps, and SVG diagrams.
 */

import type { VisualizationBundle } from '../../types/legal';
import { requireGenAIClient, GEMINI_MODEL_FAST } from './geminiClient';
import { safeParseJson } from './documentAnalysis';
import { logger } from '../../utils/logger';

export interface VisualizationParams {
  document: string;
  language: 'en' | 'hi' | 'mr';
  partyALabel?: string;
  partyBLabel?: string;
}

export async function generateVisualizationsWithGemini(
  params: VisualizationParams
): Promise<VisualizationBundle> {
  const genAI = requireGenAIClient();
  const { document, language, partyALabel = 'Party A', partyBLabel = 'Party B' } = params;
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_FAST });

  logger.info('[Visualizations] Generating visual structures');

  const langName = language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English';

  const prompt = [
    'You are LexPrime AI, an expert at legal visualization architecture.',
    'Convert the following legal document into clear, structured visualization models.',
    'Return a strict JSON object with this structure:',
    '',
    '{',
    '  "textSummary": "string",',
    '  "flows": [',
    '    {',
    '      "id": "string",',
    '      "label": "string",',
    '      "nodes": [ { "id": "string", "label": "string", "type": "start" | "decision" | "process" | "end" } ],',
    '      "edges": [ { "from": "string", "to": "string", "label": "string" } ],',
    '      "relatedClauses": ["string"]',
    '    }',
    '  ],',
    '  "responsibilities": {',
    '    "label": "string",',
    '    "partyALabel": "string",',
    '    "partyBLabel": "string",',
    '    "items": [ { "topic": "string", "partyA": "string", "partyB": "string", "relatedClause": "string" } ]',
    '  },',
    '  "povTimeline": {',
    '    "court": [ { "title": "string", "subtitle": "string", "date": "string", "description": "string", "color": "string", "icon": "file" | "clock" | "warning" | "check" } ],',
    '    "receiver": [ { "title": "string", "subtitle": "string", "date": "string", "description": "string", "color": "string", "icon": "file" | "clock" | "warning" | "check" } ],',
    '    "overall": [ { "title": "string", "subtitle": "string", "date": "string", "description": "string", "color": "string", "icon": "file" | "clock" | "warning" | "check" } ]',
    '  }',
    '}',
    '',
    `Language: ${langName}.`,
    `- Party labels: ${partyALabel} vs ${partyBLabel}.`,
    '- Return valid JSON only.',
    '',
    'Document Text:',
    document.slice(0, 10000),
  ].join('\n');

  const response = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 3000,
      responseMimeType: 'application/json',
    },
  });

  const text = response.response.text();
  const data = safeParseJson<any>(text);

  const safeStr = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);
  const safeArray = (v: unknown): any[] => (Array.isArray(v) ? v : []);

  const bundle: VisualizationBundle = {
    textSummary: safeStr(data?.textSummary),
    povTimeline: data?.povTimeline ? {
      court: safeArray(data.povTimeline.court).map((e: any) => ({
        title: safeStr(e.title),
        subtitle: safeStr(e.subtitle),
        date: safeStr(e.date),
        description: safeStr(e.description),
        color: safeStr(e.color, 'bg-blue-500'),
        icon: ['file', 'clock', 'warning', 'check'].includes(e.icon) ? e.icon : 'file',
      })),
      receiver: safeArray(data.povTimeline.receiver).map((e: any) => ({
        title: safeStr(e.title),
        subtitle: safeStr(e.subtitle),
        date: safeStr(e.date),
        description: safeStr(e.description),
        color: safeStr(e.color, 'bg-red-500'),
        icon: ['file', 'clock', 'warning', 'check'].includes(e.icon) ? e.icon : 'file',
      })),
      overall: safeArray(data.povTimeline.overall).map((e: any) => ({
        title: safeStr(e.title),
        subtitle: safeStr(e.subtitle),
        date: safeStr(e.date),
        description: safeStr(e.description),
        color: safeStr(e.color, 'bg-gray-500'),
        icon: ['file', 'clock', 'warning', 'check'].includes(e.icon) ? e.icon : 'file',
      })),
    } : undefined,
    flows: safeArray(data?.flows).map((f: any, fidx: number) => ({
      id: safeStr(f?.id, String(fidx + 1)),
      label: safeStr(f?.label, `Process Flow ${fidx + 1}`),
      nodes: safeArray(f?.nodes).map((n: any, nidx: number) => ({
        id: safeStr(n?.id, `n-${fidx + 1}-${nidx + 1}`),
        label: safeStr(n?.label, 'Step'),
        type: ['start', 'decision', 'process', 'end'].includes(n?.type) ? n?.type : undefined,
      })),
      edges: safeArray(f?.edges).map((e: any) => ({
        from: safeStr(e?.from),
        to: safeStr(e?.to),
        label: safeStr(e?.label),
      })),
      relatedClauses: safeArray(f?.relatedClauses).map((s: unknown) => safeStr(s)).filter(Boolean),
    })),
    responsibilities: data?.responsibilities ? {
      label: safeStr(data.responsibilities?.label, 'Responsibility Breakdown'),
      partyALabel: safeStr(data.responsibilities?.partyALabel, partyALabel),
      partyBLabel: safeStr(data.responsibilities?.partyBLabel, partyBLabel),
      items: safeArray(data.responsibilities?.items).map((it: any) => ({
        topic: safeStr(it?.topic),
        partyA: safeStr(it?.partyA),
        partyB: safeStr(it?.partyB),
        relatedClause: safeStr(it?.relatedClause),
      })),
    } : null,
  };

  return bundle;
}

export async function generateLegalSVG(prompt: string): Promise<string> {
  const genAI = requireGenAIClient();
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_FAST });

  const systemPrompt = `
    You are an expert vector illustrator for legal concepts.
    Generate a modern, clean, valid SVG icon or illustration representing the given legal topic.
    Requirements:
    - Return ONLY raw SVG code.
    - Style: Professional, vibrant flat vector graphics.
    - Must include viewBox for responsive rendering.
  `;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\nRequest: ' + prompt }] }],
  });

  const text = result.response.text();
  const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/);
  return svgMatch ? svgMatch[0] : text.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '').trim();
}

export async function generateMindmapCode(topic: string): Promise<string> {
  const genAI = requireGenAIClient();
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_FAST });

  const systemPrompt = `
    You are an expert at creating Mermaid.js mindmaps.
    Generate a STRICTLY CONCISE mindmap for the given legal topic.
    Requirements:
    - Return ONLY raw mermaid code.
    - Diagram Type: 'mindmap'.
    - Node text must be 1-3 words max. No markdown fences.
  `;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\nTopic: ' + topic }] }],
  });

  let text = result.response.text();
  text = text.replace(/```mermaid/g, '').replace(/```/g, '').trim();
  return text;
}
