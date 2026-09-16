/**
 * Document Chat Service
 * Provides contextual, document-grounded question answering for legal documents
 * with built-in uncertainty handling and responsible AI disclaimers.
 */

import type { ChatRequest, ChatMessage } from '../../types/chat';
import { generateContentWithFallback, GEMINI_MODEL_FAST } from './geminiClient';
import { logger } from '../../utils/logger';

export const RESPONSIBLE_AI_DISCLAIMER =
  '\n\n*Disclaimer: LexPrime AI provides informational analysis grounded in your document. It is not professional legal advice.*';

export async function chatWithGemini(req: ChatRequest): Promise<ChatMessage> {

  logger.info('[DocumentChat] Processing chat query');

  const systemPreamble = [
    'You are LexPrime AI, an intelligent, empathetic legal assistant dedicated to expanding access to legal understanding.',
    'Core Guidelines:',
    '- Answer questions strictly grounded in the provided document context.',
    '- If an answer is not contained in or inferable from the document, explicitly say so: state what is missing and suggest which clauses to look for (e.g. termination, indemnity, governing law).',
    '- Never fabricate terms, legal obligations, penalties, or deadlines.',
    '- For hypothetical / "what-if" questions, structure the answer clearly: (1) Summary, (2) What the Document Says, (3) Key Risks & Penalties, (4) Practical Options, (5) Plain-Language Explanation.',
    '- Respect the requested language: Hindi (hi), Marathi (mr), or English (en).',
    '- Always advise consulting a qualified attorney for high-stakes decisions.',
  ].join('\n');

  // Compact conversation history to control context window and token usage
  const compactHistory = (req.history || [])
    .slice(-6)
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const langLabel = req.language === 'hi' ? 'Hindi' : req.language === 'mr' ? 'Marathi' : 'English';

  const userPrompt = [
    systemPreamble,
    '',
    `Language: ${langLabel}`,
    '',
    'Document Context:',
    '---',
    (req.document || '').slice(0, 16000), // Protect token limit
    '---',
    '',
    'Recent Conversation History:',
    compactHistory || '(No prior messages)',
    '',
    'User Question:',
    req.message,
  ].join('\n');

  const { text: rawAnswer } = await generateContentWithFallback({
    model: GEMINI_MODEL_FAST,
    contents: userPrompt,
    config: {
      temperature: 0.3,
      maxOutputTokens: 2048,
    },
  });

  let answer = rawAnswer.trim();

  // Attach legal disclaimer if not already present
  if (!answer.toLowerCase().includes('not legal advice') && !answer.toLowerCase().includes('disclaimer')) {
    answer += RESPONSIBLE_AI_DISCLAIMER;
  }

  return { role: 'model', content: answer };
}
