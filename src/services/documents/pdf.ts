/**
 * PDF Document Extraction Service
 * Extracts text content from PDF files using pdfjs-dist.
 */

import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Initialize PDF.js worker
if (typeof window !== 'undefined' && (pdfjsLib as any).GlobalWorkerOptions) {
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;
}

export async function extractTextFromPdf(
  file: File | Blob,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!file || file.size === 0) {
    throw new Error('Empty or invalid PDF file');
  }

  const arrayBuffer = await file.arrayBuffer();
  onProgress?.(20);

  const loadingTask = (pdfjsLib as any).getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  if (numPages === 0) {
    return '';
  }

  const pageTexts: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items
      .map((it: any) => ('str' in it ? it.str : ''))
      .filter(Boolean);
    pageTexts.push(strings.join(' '));
    onProgress?.(20 + Math.round((i / numPages) * 60));
  }

  return pageTexts.join('\n\n').trim();
}
