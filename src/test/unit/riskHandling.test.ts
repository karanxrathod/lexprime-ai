import { describe, it, expect } from 'vitest';
import { mapToDocumentAnalysis } from '../../services/ai/documentAnalysis';

describe('Risk Handling & Classification', () => {
  it('correctly maps and preserves low, medium, and high risk levels', () => {
    const data = {
      clauses: [],
      risks: [
        { id: 'r1', clause: 'Indemnity', description: 'Uncapped indemnity', severity: 'high', recommendation: 'Cap liability' },
        { id: 'r2', clause: 'Payment', description: 'Net 45 terms', severity: 'medium', recommendation: 'Request Net 30' },
        { id: 'r3', clause: 'Notices', description: 'Electronic notices permitted', severity: 'low', recommendation: 'Acceptable' },
      ],
    };

    const result = mapToDocumentAnalysis(data);
    expect(result.risks).toHaveLength(3);
    expect(result.risks[0].severity).toBe('high');
    expect(result.risks[1].severity).toBe('medium');
    expect(result.risks[2].severity).toBe('low');
  });

  it('normalizes missing or invalid severity levels to medium fallback', () => {
    const data = {
      risks: [
        { id: 'r1', clause: 'Jurisdiction', description: 'Foreign courts', severity: 'extreme' /* invalid */, recommendation: 'Change venue' },
      ],
    };

    const result = mapToDocumentAnalysis(data);
    expect(result.risks[0].severity).toBe('medium');
  });

  it('provides safe fallback values for missing recommendation and description', () => {
    const data = {
      risks: [
        { clause: 'Data Breach' }, // Missing id, description, severity, recommendation
      ],
    };

    const result = mapToDocumentAnalysis(data);
    expect(result.risks).toHaveLength(1);
    expect(result.risks[0].id).toBe('risk-1');
    expect(result.risks[0].description).toBe('');
    expect(result.risks[0].recommendation).toBe('');
    expect(result.risks[0].severity).toBe('medium');
  });

  it('safely extracts negotiation points for risk items', () => {
    const data = {
      negotiationPoints: [
        {
          id: 'np-1',
          clauseId: 'c1',
          originalClause: 'All IP transfers immediately',
          issue: 'Overly broad IP assignment',
          counterProposal: 'Retain pre-existing IP rights',
          talkingPoint: 'Align with industry standard carve-outs',
        },
      ],
    };

    const result = mapToDocumentAnalysis(data);
    expect(result.negotiationPoints).toHaveLength(1);
    expect(result.negotiationPoints[0].issue).toContain('IP assignment');
    expect(result.negotiationPoints[0].counterProposal).toContain('Retain pre-existing');
  });
});
