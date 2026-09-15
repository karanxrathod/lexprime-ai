/**
 * Safe logging utility for legal document application.
 * Ensures sensitive document contents, user credentials, and raw prompts
 * are never leaked to the console in production environments.
 */

const isDev = Boolean(import.meta.env.DEV || import.meta.env.VITE_DEBUG_MODE === 'true');

export function maskSensitive(text: string, visibleChars = 8): string {
  if (!text) return '';
  if (text.length <= visibleChars) return '***';
  return text.slice(0, visibleChars) + '... [REDACTED ' + (text.length - visibleChars) + ' chars]';
}

export const logger = {
  info: (message: string, ...args: unknown[]): void => {
    if (isDev) {
      console.log(`[LexPrime Info] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]): void => {
    console.warn(`[LexPrime Warn] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]): void => {
    console.error(`[LexPrime Error] ${message}`, ...args);
  },
  debug: (message: string, ...args: unknown[]): void => {
    if (isDev) {
      console.debug(`[LexPrime Debug] ${message}`, ...args);
    }
  },
  documentAction: (action: string, docLength?: number): void => {
    if (isDev) {
      console.log(`[LexPrime Document] Action: ${action}, Length: ${docLength ?? 0} characters`);
    }
  }
};
