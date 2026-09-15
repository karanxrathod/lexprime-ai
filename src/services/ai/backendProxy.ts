/**
 * Backend Proxy Service for Secure AI Requests
 * 
 * In production environments, client apps should route AI requests through
 * a secure server-side proxy (e.g. Firebase Cloud Functions, Cloud Run, or custom API)
 * where the Gemini API secrets are held in secure environment variables,
 * preventing exposure in client-side bundles.
 */

import { logger } from '../../utils/logger';
import { getGeminiApiKey } from '../../utils/apiKey';

export interface ProxyRequestPayload {
  endpoint: string;
  data: unknown;
  signal?: AbortSignal;
}

export interface ProxyResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Check if the application is configured to use a secure backend proxy.
 */
export function isBackendProxyConfigured(): boolean {
  const proxyUrl = import.meta.env.VITE_API_BASE_URL;
  return Boolean(proxyUrl && proxyUrl.trim() !== '' && !proxyUrl.includes('localhost'));
}

/**
 * Execute request via secure backend proxy or determine if local client execution is needed.
 */
export async function callAiBackendProxy<T>(
  endpoint: string,
  payload: unknown,
  signal?: AbortSignal
): Promise<ProxyResponse<T>> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    return {
      success: false,
      error: 'Backend proxy endpoint not configured. Using client-side execution.'
    };
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/+$/, '')}/api/ai/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal,
    });

    if (!response.ok) {
      const errText = await response.text();
      logger.error(`[AI Proxy] Server returned ${response.status}`, errText);
      return {
        success: false,
        error: `Server error: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data as T,
    };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      logger.info('[AI Proxy] Request aborted by client');
      throw err;
    }
    logger.error('[AI Proxy] Request failed:', err?.message || err);
    return {
      success: false,
      error: err?.message || 'Failed to connect to AI backend service',
    };
  }
}
