/**
 * Gemini Client Service
 * Centralizes GoogleGenAI client instantiation (@google/genai), model configuration,
 * resilient execution with automatic fallback, and safe error diagnostics.
 */

import { GoogleGenAI } from '@google/genai';
import { getGeminiApiKey } from '../../utils/apiKey';
import { logger } from '../../utils/logger';

// Verified current stable Flash models
export const PRIMARY_MODEL = 'gemini-3.6-flash';
export const FALLBACK_MODEL = 'gemini-3.5-flash';

// Backward-compatible alias exports
export const GEMINI_MODEL_FAST = PRIMARY_MODEL;
export const GEMINI_MODEL_PRO = PRIMARY_MODEL;
export const GEMINI_MODEL_FALLBACK = FALLBACK_MODEL;

let cachedClient: GoogleGenAI | null = null;
let cachedKey: string | null = null;

export function getGenAIClient(): GoogleGenAI | null {
  const key = getGeminiApiKey();
  if (!key) {
    logger.warn('No Gemini API key found in storage or environment.');
    return null;
  }
  if (cachedClient && cachedKey === key) {
    return cachedClient;
  }
  cachedKey = key;
  cachedClient = new GoogleGenAI({ apiKey: key });
  return cachedClient;
}

export function requireGenAIClient(): GoogleGenAI {
  const client = getGenAIClient();
  if (!client) {
    throw new Error('Gemini API key is required. Please set your key in Settings or environment.');
  }
  return client;
}

export interface GenerateOptions {
  model?: string;
  contents: any;
  config?: {
    temperature?: number;
    maxOutputTokens?: number;
    responseMimeType?: string;
    systemInstruction?: string | { parts: { text: string }[] };
    tools?: any[];
    toolConfig?: any;
  };
}

export interface GeminiCallResult {
  text: string;
  rawResponse: any;
  modelUsed: string;
}

export function sanitizeErrorMessage(msg: string): string {
  return msg
    .replace(/AIzaSy[A-Za-z0-9_-]{33}/g, '[REDACTED]')
    .replace(/key=[^&\s]+/g, 'key=[REDACTED]')
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer [REDACTED]');
}

export async function generateContentWithFallback(
  options: GenerateOptions
): Promise<GeminiCallResult> {
  const ai = requireGenAIClient();
  const primary = options.model || PRIMARY_MODEL;
  const modelsToTry = [primary];
  if (primary !== FALLBACK_MODEL) {
    modelsToTry.push(FALLBACK_MODEL);
  }

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      logger.info(`[Gemini] Generating content with model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });

      // Extract text safely: prefer text property or parts
      let text = (response.text || '').trim();
      if (!text && response.candidates?.[0]?.content?.parts) {
        text = response.candidates[0].content.parts
          .map((p: any) => p.text || '')
          .filter(Boolean)
          .join('')
          .trim();
      }

      return {
        text,
        rawResponse: response,
        modelUsed: model,
      };
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.code || (err?.message?.match(/\b([45]\d\d)\b/) ? Number(RegExp.$1) : undefined);
      const safeMsg = sanitizeErrorMessage(err?.message || String(err));
      
      logger.error(`[Gemini] Request failed:
  status: ${status || 'N/A'}
  model: ${model}
  message: ${safeMsg}`);

      // If this was the primary model and we have a fallback, log warning and continue loop
      if (model === primary && modelsToTry.length > 1) {
        logger.warn(`[Gemini] Primary model ${primary} failed (status: ${status || 'unknown'}), attempting fallback ${FALLBACK_MODEL}...`);
      }
    }
  }

  const finalStatus = lastError?.status || lastError?.code || 'unknown';
  const finalMsg = sanitizeErrorMessage(lastError?.message || String(lastError));
  const errToThrow = new Error(`Gemini request failed (status: ${finalStatus}, model: ${modelsToTry[modelsToTry.length - 1]}): ${finalMsg}`);
  (errToThrow as any).status = finalStatus;
  (errToThrow as any).cause = lastError;
  throw errToThrow;
}
