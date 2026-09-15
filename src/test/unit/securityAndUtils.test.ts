import { describe, it, expect, beforeEach } from 'vitest';
import { isSafeUrl, sanitizeHtml, escapeHtml } from '../../utils/sanitizer';
import { maskSensitive } from '../../utils/logger';
import { runWithConcurrency } from '../../utils/concurrencyPool';
import { getGeminiApiKey, setGeminiApiKey, removeGeminiApiKey } from '../../utils/apiKey';

describe('Security Utilities & Sanitization', () => {
  describe('URL Sanitization (isSafeUrl)', () => {
    it('accepts valid http and https URLs', () => {
      expect(isSafeUrl('https://legislative.gov.in/act/indian-contract-act-1872')).toBe(true);
      expect(isSafeUrl('http://example.com/legal-notice')).toBe(true);
    });

    it('blocks dangerous javascript: and data: URIs to prevent XSS', () => {
      expect(isSafeUrl('javascript:alert(1)')).toBe(false);
      expect(isSafeUrl('JAVASCRIPT:document.cookie')).toBe(false);
      expect(isSafeUrl('data:text/html;base64,PHNjcmlwdD4=')).toBe(false);
      expect(isSafeUrl('vbscript:msgbox(1)')).toBe(false);
    });

    it('handles null, undefined, or empty URLs safely', () => {
      expect(isSafeUrl('')).toBe(false);
      expect(isSafeUrl(null as any)).toBe(false);
      expect(isSafeUrl('not a url')).toBe(false);
    });
  });

  describe('HTML Sanitization (sanitizeHtml & escapeHtml)', () => {
    it('removes script tags and inline event handlers from AI/user HTML', () => {
      const maliciousHtml = '<div><h3>Notice</h3><script>stealData()</script><img src="x" onerror="alert(1)"/></div>';
      const clean = sanitizeHtml(maliciousHtml);

      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('stealData()');
      expect(clean).not.toContain('onerror=');
      expect(clean).toContain('<h3>Notice</h3>');
    });

    it('escapes special characters in escapeHtml', () => {
      const dangerous = '<script>alert("XSS") & \'test\'</script>';
      const escaped = escapeHtml(dangerous);

      expect(escaped).not.toContain('<script>');
      expect(escaped).toContain('&lt;script&gt;');
      expect(escaped).toContain('&amp;');
      expect(escaped).toContain('&quot;');
    });
  });

  describe('Privacy Logger (maskSensitive)', () => {
    it('redacts full document text to protect client confidentiality', () => {
      const sensitiveContract = 'CONFIDENTIAL: Party A agrees to pay $1,000,000 to Party B.';
      const masked = maskSensitive(sensitiveContract, 13);

      expect(masked).toContain('CONFIDENTIAL:');
      expect(masked).toContain('REDACTED');
      expect(masked).not.toContain('$1,000,000');
    });

    it('handles short strings safely', () => {
      expect(maskSensitive('short')).toBe('***');
    });
  });

  describe('Concurrency Limiter Pool (runWithConcurrency)', () => {
    it('executes tasks with controlled concurrency and preserves order', async () => {
      const items = [1, 2, 3, 4, 5];
      let active = 0;
      let maxActive = 0;

      const results = await runWithConcurrency(
        items,
        async (num) => {
          active++;
          maxActive = Math.max(maxActive, active);
          await new Promise((resolve) => setTimeout(resolve, 10));
          active--;
          return num * 10;
        },
        2 // Max 2 concurrent
      );

      expect(results).toEqual([10, 20, 30, 40, 50]);
      expect(maxActive).toBeLessThanOrEqual(2);
    });

    it('returns empty array when given empty input', async () => {
      const results = await runWithConcurrency([], async () => 'test');
      expect(results).toEqual([]);
    });
  });

  describe('API Key Storage Management', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('stores, retrieves, and removes user API key override safely', () => {
      expect(getGeminiApiKey()).toBeNull();

      setGeminiApiKey('AIzaSyTestKey123456');
      expect(getGeminiApiKey()).toBe('AIzaSyTestKey123456');

      removeGeminiApiKey();
      expect(getGeminiApiKey()).toBeNull();
    });
  });
});
