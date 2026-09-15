import { describe, it, expect } from 'vitest';
import { mapToDocumentAnalysis } from '../../services/ai/documentAnalysis';

describe('Clause Processing & Role Perspectives', () => {
  it('correctly maps clause fields including role-based perspectives', () => {
    const rawData = {
      clauses: [
        {
          id: 'c-101',
          title: 'Early Termination Penalty',
          originalText: 'Tenant must pay 3 months rent upon breaking lease.',
          simplifiedText: 'You have to pay 3 extra months of rent if you leave early.',
          riskLevel: 'high',
          explanation: 'Severe financial penalty for early exit.',
          rolePerspectives: [
            {
              role: 'Tenant',
              interpretation: 'Creates high barrier to relocating in emergency.',
              obligations: ['Pay 3 months rent penalty'],
              risks: ['Heavy unexpected expense'],
            },
            {
              role: 'Landlord',
              interpretation: 'Guarantees income while finding a replacement.',
              obligations: ['Mitigate vacancy time'],
              risks: ['Dispute over payment collection'],
            },
          ],
        },
      ],
    };

    const result = mapToDocumentAnalysis(rawData);
    expect(result.clauses).toHaveLength(1);
    const clause = result.clauses[0];
    expect(clause.id).toBe('c-101');
    expect(clause.title).toBe('Early Termination Penalty');
    expect(clause.rolePerspectives).toBeDefined();
    expect(clause.rolePerspectives).toHaveLength(2);

    const tenantPerspective = clause.rolePerspectives?.find((p) => p.role === 'Tenant');
    expect(tenantPerspective).toBeDefined();
    expect(tenantPerspective?.obligations).toContain('Pay 3 months rent penalty');
  });

  it('safely assigns default role when role perspective is missing', () => {
    const rawData = {
      clauses: [
        {
          title: 'Arbitration Clause',
          rolePerspectives: [
            {
              interpretation: 'Disputes resolved privately.',
            },
          ],
        },
      ],
    };

    const result = mapToDocumentAnalysis(rawData);
    expect(result.clauses[0].rolePerspectives?.[0].role).toBe('Consumer');
    expect(result.clauses[0].rolePerspectives?.[0].obligations).toEqual([]);
  });

  it('generates IDs and titles when missing from AI output', () => {
    const rawData = {
      clauses: [
        {
          originalText: 'The contractor shall deliver within 14 days.',
        },
      ],
    };

    const result = mapToDocumentAnalysis(rawData);
    expect(result.clauses[0].id).toBe('1');
    expect(result.clauses[0].title).toBe('Clause 1');
  });
});
