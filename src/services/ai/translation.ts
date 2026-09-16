/**
 * Legal Translation & Multilingual Service
 * Provides legal terminology translation and script detection for Hindi, Marathi, and English.
 */

import { generateContentWithFallback, GEMINI_MODEL_FAST } from './geminiClient';
import { logger } from '../../utils/logger';

export function hasDevanagari(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const match = text.match(/[\u0900-\u097F]/g);
  return Boolean(match && match.length > 10);
}

export async function translateToEnglish(text: string): Promise<string> {
  if (!text || text.trim() === '') return '';

  logger.info('[Translation] Translating document segment to English');

  const prompt = `You are an expert legal translator. Translate the following legal document text into clear, professional English. Maintain strict accuracy, legal terminology, and original clause formatting.\n\nText to translate:\n${text}`;

  try {
    const { text: translated } = await generateContentWithFallback({
      model: GEMINI_MODEL_FAST,
      contents: prompt,
      config: {
        temperature: 0.1,
        maxOutputTokens: 2500,
      },
    });
    return translated.trim();
  } catch (error: any) {
    logger.error('[Translation] Translation failed:', error?.message || error);
    throw error;
  }
}
