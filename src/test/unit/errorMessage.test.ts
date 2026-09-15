import { describe, it, expect } from 'vitest';
import { getUserFriendlyErrorMessage } from '../../utils/errorMessage';

describe('User-Friendly Error Message Mapping', () => {
  it('identifies quota / rate limit errors safely without exposing technical details', () => {
    const error = new Error('Resource has been exhausted (e.g. check quota): 429 ResourceExhausted');
    const msgEn = getUserFriendlyErrorMessage(error, 'en');
    const msgHi = getUserFriendlyErrorMessage(error, 'hi');
    const msgMr = getUserFriendlyErrorMessage(error, 'mr');

    expect(msgEn).toContain('Gemini quota has been exceeded');
    expect(msgHi).toContain('Gemini कोटा समाप्त हो गया है');
    expect(msgMr).toContain('Gemini कोटा संपला आहे');
  });

  it('identifies missing or invalid API keys without leaking keys', () => {
    const error = new Error('API key not valid. Please pass a valid API key.');
    const msg = getUserFriendlyErrorMessage(error, 'en');

    expect(msg).toContain('AI configuration is unavailable');
    expect(msg).toContain('Settings');
    expect(msg).not.toContain('API key not valid');
  });

  it('identifies permission denied / rejected requests', () => {
    const error = new Error('403 Forbidden: PERMISSION_DENIED');
    const msg = getUserFriendlyErrorMessage(error, 'en');

    expect(msg).toContain('Gemini API request was rejected');
  });

  it('identifies network failures and connection timeouts', () => {
    const errorNet = new Error('Failed to fetch');
    const msgNet = getUserFriendlyErrorMessage(errorNet, 'en');
    expect(msgNet).toContain('Network request failed');

    const errorTimeout = new Error('Request timed out after 30000ms');
    const msgTimeout = getUserFriendlyErrorMessage(errorTimeout, 'en');
    expect(msgTimeout).toContain('Analysis timed out');
  });

  it('provides safe generic fallback for unexpected errors', () => {
    const error = new Error('Unexpected internal parsing state 500');
    const msg = getUserFriendlyErrorMessage(error, 'en');
    expect(msg).toBe('Analysis failed. Please try again.');
  });
});
