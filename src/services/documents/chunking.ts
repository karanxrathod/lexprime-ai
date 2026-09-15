/**
 * Document Chunking Service
 * Splits lengthy legal documents into manageable, overlapping chunks
 * that fit within LLM context windows while preserving paragraph/clause boundaries.
 */

export interface ChunkingOptions {
  targetLen?: number;
  overlap?: number;
  preserveParagraphs?: boolean;
}

/**
 * Splits text into logical chunks suitable for legal LLM analysis.
 * 
 * @param text The input legal text.
 * @param targetLen Maximum characters per chunk (default: 4000).
 * @param overlap Number of overlapping characters between chunks (default: 400).
 * @returns An array of text chunk strings.
 */
export function splitTextIntoChunks(
  text: string,
  targetLen = 4000,
  overlap = 400
): string[] {
  if (!text || text.trim() === '') {
    return [];
  }

  const trimmed = text.trim();
  if (trimmed.length <= targetLen) {
    return [trimmed];
  }

  const chunks: string[] = [];
  let start = 0;
  const safeOverlap = Math.min(overlap, Math.floor(targetLen * 0.4));

  while (start < trimmed.length) {
    const end = Math.min(trimmed.length, start + targetLen);
    let slice = trimmed.slice(start, end);

    // Try to break at a natural paragraph boundary if we have not reached the end of text
    if (end < trimmed.length) {
      const lastParagraph = slice.lastIndexOf('\n\n');
      if (lastParagraph > targetLen * 0.5) {
        slice = slice.slice(0, lastParagraph).trim();
      } else {
        // Fallback: try sentence boundary
        const lastSentence = slice.lastIndexOf('. ');
        if (lastSentence > targetLen * 0.6) {
          slice = slice.slice(0, lastSentence + 1).trim();
        }
      }
    }

    if (slice.length > 0) {
      chunks.push(slice);
    }

    if (end >= trimmed.length) break;

    // Advance start, keeping overlap
    const step = Math.max(1, slice.length - safeOverlap);
    start += step;
  }

  return chunks;
}
