/**
 * Gemini Client Service
 * Centralizes GoogleGenerativeAI client instantiation, model configuration,
 * and API key resolution with graceful fallbacks.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGeminiApiKey } from '../../utils/apiKey';
import { logger } from '../../utils/logger';

export const GEMINI_MODEL_FAST = 'gemini-2.0-flash';
export const GEMINI_MODEL_PRO = 'gemini-2.0-flash'; // Standardized on stable flash model

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
