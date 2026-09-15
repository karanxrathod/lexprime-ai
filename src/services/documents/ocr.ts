/**
 * OCR Document Extraction Service
 * Uses Tesseract.js for optical character recognition on scanned PDFs/images
 * as an intelligent fallback when direct text extraction yields insufficient text.
 */

import { Language } from '../../translations';
import { logger } from '../../utils/logger';

export function mapOcrLang(lang: Language): string {
  // Multi-language OCR configuration for English, Hindi, and Marathi
  if (lang === 'hi') return 'hin+eng';
  if (lang === 'mr') return 'mar+eng';
  return 'eng+hin+mar';
}

export async function ocrExtractTextFromPdf(
  file: File | Blob,
  lang: Language = 'en',
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!file || file.size === 0) {
    return '';
  }

  try {
    // Dynamic import of Tesseract and pdfjs for code-splitting
    const [Tesseract, pdfjsLib] = await Promise.all([
      import('tesseract.js'),
      import('pdfjs-dist'),
    ]);

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await (pdfjsLib as any).getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    const texts: string[] = [];
    const tessLang = mapOcrLang(lang);

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      if (context) {
        await page.render({ canvasContext: context, viewport }).promise;
      }

      const { data } = await Tesseract.recognize(canvas, tessLang, {
        logger: (m: any) => {
          if (m.status === 'recognizing text' && typeof m.progress === 'number') {
            const base = 20;
            const perPage = (100 - base) / numPages;
            const pageProgress = base + perPage * (i - 1 + m.progress);
            onProgress?.(Math.min(99, Math.floor(pageProgress)));
          }
        },
      });

      if (data && data.text) {
        texts.push(data.text.trim());
      }
    }

    return texts.join('\n\n').trim();
  } catch (err: any) {
    logger.error('[OCR Service] Optical character recognition error:', err?.message || err);
    throw new Error('OCR text recognition failed: ' + (err?.message || 'Unknown error'));
  }
}
