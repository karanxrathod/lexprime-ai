/**
 * Document Authenticity Verification Service
 * Checks legal document integrity, compliance with standard statutes,
 * fake indicators, and safety scores.
 */

import type { AuthenticityAnalysis } from '../../types/legal';
import { requireGenAIClient, GEMINI_MODEL_FAST } from './geminiClient';
import { safeParseJson } from './documentAnalysis';
import { logger } from '../../utils/logger';

export async function analyzeDocumentAuthenticity(
  content: string,
  language: 'en' | 'hi' | 'mr'
): Promise<AuthenticityAnalysis> {
  const genAI = requireGenAIClient();
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_FAST });

  logger.info('[Authenticity] Running authenticity check');

  const langName = language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English';

  const prompt = [
    'You are LexPrime AI, a forensic document and legal compliance analyst.',
    'Analyze the following document text for authenticity, statutory compliance, and potential fake or predatory red flags.',
    'Return a strict JSON object matching this schema:',
    '',
    '{',
    '  "authenticityScore": number,', // 0-100
    '  "isCompliant": boolean,',
    '  "compliantWith": "string",',
    '  "redFlags": ["string"],',
    '  "safetyScore": number,', // 0-100
    '  "safetyAnalysis": "string",',
    '  "fakeIndication": "Low" | "Medium" | "High",',
    '  "recommendation": "string"',
    '}',
    '',
    `Language: ${langName}.`,
    'Be vigilant. Inspect for boilerplate anomalies, unfair one-sided terms, and missing execution requirements.',
    'Return ONLY JSON.',
    '',
    'Document Sample (first 5000 chars):',
    content.slice(0, 5000),
  ].join('\n');

  try {
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
      },
    });

    const text = response.response.text();
    const data = safeParseJson<any>(text);

    return {
      authenticityScore: typeof data.authenticityScore === 'number' ? data.authenticityScore : 70,
      isCompliant: Boolean(data.isCompliant),
      compliantWith: typeof data.compliantWith === 'string' ? data.compliantWith : 'Standard Contract Principles',
      redFlags: Array.isArray(data.redFlags) ? data.redFlags.map(String) : [],
      safetyScore: typeof data.safetyScore === 'number' ? data.safetyScore : 65,
      safetyAnalysis: typeof data.safetyAnalysis === 'string' ? data.safetyAnalysis : 'Document exhibits standard terms.',
      fakeIndication: ['Low', 'Medium', 'High'].includes(data.fakeIndication) ? data.fakeIndication : 'Low',
      recommendation: typeof data.recommendation === 'string' ? data.recommendation : 'Review with a legal professional before signing.',
    };
  } catch (err: any) {
    logger.warn('[Authenticity] Authenticity analysis failed gracefully:', err?.message || err);
    return {
      authenticityScore: 50,
      isCompliant: false,
      compliantWith: 'Verification Incomplete',
      redFlags: ['Automated verification could not be completed. Please review with an attorney.'],
      safetyScore: 50,
      safetyAnalysis: 'Manual verification recommended.',
      fakeIndication: 'Medium',
      recommendation: 'Consult a qualified lawyer to verify document validity and signatures.',
    };
  }
}
