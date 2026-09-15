import { describe, it, expect } from 'vitest';
import { translations, Language } from '../../translations';
import { hasDevanagari } from '../../services/ai/translation';

describe('Multilingual Support & Language Detection', () => {
  it('detects Devanagari script for Hindi and Marathi text', () => {
    const hindiSample = 'यह एक कानूनी दस्तावेज़ है जिसमें अनुबंध की शर्तें दी गई हैं।';
    const marathiSample = 'हा एक कायदेशीर करार आहे ज्यामध्ये भाडेकरूचे हक्क स्पष्ट केले आहेत.';
    const englishSample = 'This is a legal document outlining tenant rights and duties.';

    expect(hasDevanagari(hindiSample)).toBe(true);
    expect(hasDevanagari(marathiSample)).toBe(true);
    expect(hasDevanagari(englishSample)).toBe(false);
  });

  it('handles empty or short text in Devanagari detection safely', () => {
    expect(hasDevanagari('')).toBe(false);
    expect(hasDevanagari('नमस्ते')).toBe(false); // under 10 char threshold
  });

  it('contains complete critical translation keys across English, Hindi, and Marathi', () => {
    const langs: Language[] = ['en', 'hi', 'mr'];
    const requiredKeys = [
      'upload',
      'results',
      'visuals',
      'analyze',
      'analyzing',
      'uploadTitle',
      'uploadSubtitle',
      'dashboard',
      'settings',
    ];

    langs.forEach((lang) => {
      const dict = translations[lang];
      expect(dict, `Dictionary for ${lang} should exist`).toBeDefined();
      requiredKeys.forEach((key) => {
        expect((dict as any)[key], `Key "${key}" should exist in language "${lang}"`).toBeDefined();
        expect(typeof (dict as any)[key]).toBe('string');
        expect((dict as any)[key].length).toBeGreaterThan(0);
      });
    });
  });
});
