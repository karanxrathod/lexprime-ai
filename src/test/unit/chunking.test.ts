import { describe, it, expect } from 'vitest';
import { splitTextIntoChunks } from '../../services/documents/chunking';

describe('Document Chunking Service', () => {
  it('returns an empty array when given an empty or whitespace string', () => {
    expect(splitTextIntoChunks('')).toEqual([]);
    expect(splitTextIntoChunks('   \n\t  ')).toEqual([]);
  });

  it('returns a single chunk when document is shorter than target length', () => {
    const text = 'This is a short legal agreement consisting of only a single clause.';
    const chunks = splitTextIntoChunks(text, 1000, 100);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe(text);
  });

  it('splits long documents into multiple chunks with overlap', () => {
    const paragraph1 = 'Clause 1: The tenant agrees to maintain the premises in good order and condition during the tenancy term.';
    const paragraph2 = 'Clause 2: Rent is due on the first day of each calendar month payable via automated bank transfer.';
    const paragraph3 = 'Clause 3: Security deposit shall be returned within thirty days following formal inspection.';
    const doc = [paragraph1, paragraph2, paragraph3].join('\n\n');

    const chunks = splitTextIntoChunks(doc, 120, 20);
    expect(chunks.length).toBeGreaterThan(1);
    // Every chunk should contain content
    chunks.forEach((chunk) => {
      expect(chunk.length).toBeGreaterThan(0);
    });
  });

  it('preserves natural paragraph boundaries where possible', () => {
    const p1 = 'First long section explaining governing law and definitions in standard corporate terminology.';
    const p2 = 'Second distinct section outlining liability caps and indemnities between both contracting entities.';
    const fullText = `${p1}\n\n${p2}`;

    // Target length just large enough to break at \n\n
    const chunks = splitTextIntoChunks(fullText, 120, 15);
    expect(chunks.length).toBeGreaterThanOrEqual(1);
    expect(chunks[0]).toContain(p1);
  });

  it('handles very large documents without infinite loop or crash', () => {
    const largeDoc = 'Legal obligation clause repeated for large volume test. '.repeat(1000); // ~56,000 chars
    const chunks = splitTextIntoChunks(largeDoc, 4000, 400);

    expect(chunks.length).toBeGreaterThan(10);
    chunks.forEach((chunk) => {
      expect(chunk.length).toBeLessThanOrEqual(4500);
    });
  });
});
