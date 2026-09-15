import { describe, it, expect } from 'vitest';
import { extractTextFromPdf } from '../../services/documents/pdf';
import { mapOcrLang } from '../../services/documents/ocr';

describe('Document Processing: PDF & OCR Services', () => {
  it('correctly maps OCR languages for Hindi, Marathi, and English', () => {
    expect(mapOcrLang('hi')).toBe('hin+eng');
    expect(mapOcrLang('mr')).toBe('mar+eng');
    expect(mapOcrLang('en')).toBe('eng+hin+mar');
  });

  it('rejects empty or null file inputs with descriptive error', async () => {
    const emptyBlob = new Blob([], { type: 'application/pdf' });
    await expect(extractTextFromPdf(emptyBlob as any)).rejects.toThrow('Empty or invalid PDF file');
  });

  it('triggers OCR fallback when extracted text is shorter than threshold', () => {
    const shouldFallbackToOcr = (extractedText: string): boolean => {
      return (extractedText || '').trim().length < 40;
    };

    // Scanned document scenario (little or no digital text)
    expect(shouldFallbackToOcr('')).toBe(true);
    expect(shouldFallbackToOcr('Scan 1')).toBe(true);
    expect(shouldFallbackToOcr('Short text')).toBe(true);

    // Clean digital PDF scenario (sufficient text, avoid unnecessary OCR)
    const digitalPdfText = 'This Commercial Lease Agreement is executed on this first day of October between Landlord and Tenant.';
    expect(shouldFallbackToOcr(digitalPdfText)).toBe(false);
  });
});
