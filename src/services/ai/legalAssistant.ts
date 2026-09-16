/**
 * AI Legal Assistant Service
 * Provides role-based conversational legal assistance (Corporate, Civil, Criminal, IP, Family law)
 * with professional boundaries and disclaimers.
 */

import { generateContentWithFallback, GEMINI_MODEL_FAST } from './geminiClient';
import { logger } from '../../utils/logger';

export interface LawyerRoleSpec {
  title: string;
  systemPrompt: string;
}

export async function chatWithAILawyer(
  role: LawyerRoleSpec,
  message: string,
  history: { role: 'user' | 'model'; content: string }[] = []
): Promise<string> {
  logger.info('[AILawyer] Starting chat session with role:', role.title);

  const systemPrompt = `
    ${role.systemPrompt}
    
    Guidelines:
    - You are LexPrime AI, a helpful, professional, and empathetic AI legal assistant specialized in ${role.title}.
    - Provide clear, accurate, and relevant legal information.
    - Always clarify that your advice is for informational purposes only, and does not replace a qualified attorney.
    - Never invent fictitious laws or false precedents.
    - Keep responses concise, structured, and easy to understand.
  `;

  const contents: any[] = history.slice(-8).map((msg) => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  contents.push({
    role: 'user',
    parts: [{ text: message }],
  });

  const { text } = await generateContentWithFallback({
    model: GEMINI_MODEL_FAST,
    contents,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.4,
      maxOutputTokens: 2048,
    },
  });

  return text.trim();
}
