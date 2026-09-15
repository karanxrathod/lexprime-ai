import { describe, it, expect } from 'vitest';
import {
  extractBalancedBraces,
  safeParseJson,
  mapToDocumentAnalysis,
} from '../../services/ai/documentAnalysis';

describe('Gemini Response Parser & Sanitizer', () => {
  it('correctly parses pure, valid JSON', () => {
    const raw = JSON.stringify({
      documentType: 'Non-Disclosure Agreement',
      clauses: [
        {
          id: '1',
          title: 'Confidentiality',
          originalText: 'Receiving party shall keep information secret.',
          simplifiedText: 'You cannot share secret info.',
          riskLevel: 'medium',
          explanation: 'Standard NDA clause.',
        },
      ],
      risks: [],
      actionPoints: ['Do not disclose information'],
      citations: [],
      negotiationPoints: [],
    });

    const parsed = safeParseJson<any>(raw);
    expect(parsed.documentType).toBe('Non-Disclosure Agreement');
    expect(parsed.clauses).toHaveLength(1);
    expect(parsed.clauses[0].title).toBe('Confidentiality');
  });

  it('extracts JSON enclosed within markdown code fences (```json ... ```)', () => {
    const fenced = `
Here is the legal breakdown:
\`\`\`json
{
  "documentType": "Lease Agreement",
  "clauses": [
    {
      "id": "c1",
      "title": "Rent Payment",
      "originalText": "Rent shall be paid monthly.",
      "simplifiedText": "Pay rent every month.",
      "riskLevel": "low"
    }
  ]
}
\`\`\`
Let me know if you need further clarification.
`;

    const parsed = safeParseJson<any>(fenced);
    expect(parsed.documentType).toBe('Lease Agreement');
    expect(parsed.clauses).toHaveLength(1);
  });

  it('extracts JSON enclosed within plain markdown code fences (``` ... ```)', () => {
    const fenced = `
\`\`\`
{
  "documentType": "Employment Agreement",
  "clauses": []
}
\`\`\`
`;
    const parsed = safeParseJson<any>(fenced);
    expect(parsed.documentType).toBe('Employment Agreement');
  });

  it('repairs malformed JSON (trailing commas, single quotes, unquoted keys)', () => {
    // Malformed JSON that standard JSON.parse fails on
    const malformed = `
{
  documentType: 'Service Agreement',
  'clauses': [
    {
      id: "1",
      title: "Termination",
      originalText: "Terminable on 30 days notice.",
      riskLevel: "medium",
    },
  ],
}
`;
    const parsed = safeParseJson<any>(malformed);
    expect(parsed.documentType).toBe('Service Agreement');
    expect(parsed.clauses).toHaveLength(1);
    expect(parsed.clauses[0].title).toBe('Termination');
  });

  it('extracts balanced braces from conversational text', () => {
    const mixed = 'Note: The agreement is structured as follows: {"title": "Vendor Contract", "valid": true} - please review.';
    const braces = extractBalancedBraces(mixed.slice(mixed.indexOf('{')));
    expect(braces).toBe('{"title": "Vendor Contract", "valid": true}');
  });

  it('throws a descriptive error when output is completely non-JSON', () => {
    const completelyInvalid = 'I apologize, but as an AI I cannot review this document.';
    expect(() => safeParseJson(completelyInvalid)).toThrow('Non-JSON response');
  });

  it('throws when passed empty input', () => {
    expect(() => safeParseJson('')).toThrow('Non-JSON response');
  });

  it('handles unexpected properties and normalizes missing fields via mapToDocumentAnalysis', () => {
    const incompleteData = {
      randomExtraKey: 'unwanted payload',
      clauses: [
        {
          title: 'Arbitration',
          // missing id, simplifiedText, explanation, etc.
          riskLevel: 'invalid-level-should-default-to-low',
        },
      ],
    };

    const analysis = mapToDocumentAnalysis(incompleteData);
    expect(analysis.documentType).toBe('Legal Document');
    expect(analysis.clauses).toHaveLength(1);
    expect(analysis.clauses[0].id).toBe('1');
    expect(analysis.clauses[0].riskLevel).toBe('low');
    expect(analysis.risks).toEqual([]);
    expect(analysis.actionPoints).toEqual([]);
    expect(analysis.citations).toEqual([]);
  });
});
