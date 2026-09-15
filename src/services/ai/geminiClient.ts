/**
 * Gemini Client Service
 * Centralizes GoogleGenerativeAI client instantiation, model configuration,
 * and API key resolution with graceful fallbacks.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGeminiApiKey } from '../../utils/apiKey';
import { logger } from '../../utils/logger';

// Updated to standard stable models: gemini-1.5-flash with gemini-2.5-flash fallback
export const GEMINI_MODEL_FAST = 'gemini-1.5-flash';
export const GEMINI_MODEL_PRO = 'gemini-1.5-flash';
export const GEMINI_MODEL_FALLBACK = 'gemini-2.5-flash';

export function getGenAIClient(): GoogleGenerativeAI | null {
  const key = getGeminiApiKey();
  if (!key) {
    logger.warn('No Gemini API key found in storage or environment.');
    return null;
  }
  return new GoogleGenerativeAI(key);
}

export function requireGenAIClient(): GoogleGenerativeAI {
  const client = getGenAIClient();
  if (!client) {
    throw new Error('Gemini API key is required. Please set your key in Settings or environment.');
  }
  return client;
}
