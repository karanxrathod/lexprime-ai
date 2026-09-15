import { describe, it, expect, vi } from 'vitest';
import { analyzeClauseEnforceabilityWithGemini } from '../../services/ai/enforceability';
import { analyzeDocumentAuthenticity } from '../../services/ai/authenticity';
import { generateVisualizationsWithGemini, generateMindmapCode } from '../../services/ai/visualizations';
import { isBackendProxyConfigured, callAiBackendProxy } from '../../services/ai/backendProxy';
import { translateToEnglish } from '../../services/ai/translation';

vi.mock('../../services/ai/geminiClient', () => ({
  getGenAIClient: vi.fn(() => ({
    getGenerativeModel: vi.fn(() => ({
      generateContent: vi.fn().mockImplementation(async (req: any) => {
        const text = req.contents?.[0]?.parts?.[0]?.text || '';
        if (text.includes('enforceability specialist')) {
          return {
            response: {
              text: () => JSON.stringify({
                clause: 'Non-compete for 5 years across India',
                jurisdiction: 'India',
                simplifiedMeaning: 'Restricts employment post-resignation.',
                status: 'not_enforceable',
                jurisdictionNotes: 'Section 27 of Indian Contract Act renders post-employment non-compete void.',
                references: [{ title: 'Section 27 ICA', url: 'https://legislative.gov.in', description: 'Restraint of trade' }],
                alternatives: ['Non-solicitation agreement']
              })
            }
          };
        }
        if (text.includes('forensic document')) {
          return {
            response: {
              text: () => JSON.stringify({
                authenticityScore: 85,
                isCompliant: true,
                compliantWith: 'Indian Contract Act 1872',
                redFlags: [],
                safetyScore: 80,
                safetyAnalysis: 'Standard commercial contract.',
                fakeIndication: 'Low',
                recommendation: 'Document is standard.'
              })
            }
          };
        }
        if (text.includes('visualization architecture')) {
          return {
            response: {
              text: () => JSON.stringify({
                textSummary: 'Summary of contract flows',
                flows: [{ id: '1', label: 'Dispute Flow', nodes: [{ id: 'n1', label: 'Notice' }], edges: [] }],
                responsibilities: { label: 'Duties', partyALabel: 'Tenant', partyBLabel: 'Landlord', items: [] }
              })
            }
          };
        }
        if (text.includes('Mermaid.js mindmaps')) {
          return {
            response: {
              text: () => '```mermaid\nmindmap\n  root((Contract))\n    Clauses\n```'
            }
          };
        }
        if (text.includes('legal translator')) {
          return {
            response: {
              text: () => 'Translated English contract text.'
            }
          };
        }
        return { response: { text: () => '{}' } };
      }),
    })),
  })),
  requireGenAIClient: vi.fn(() => ({
    getGenerativeModel: vi.fn(() => ({
      generateContent: vi.fn().mockImplementation(async (req: any) => {
        const text = req.contents?.[0]?.parts?.[0]?.text || '';
        if (text.includes('enforceability specialist')) {
          return {
            response: {
              text: () => JSON.stringify({
                clause: 'Non-compete for 5 years across India',
                jurisdiction: 'India',
                simplifiedMeaning: 'Restricts employment post-resignation.',
                status: 'not_enforceable',
                jurisdictionNotes: 'Section 27 of Indian Contract Act renders post-employment non-compete void.',
                references: [{ title: 'Section 27 ICA', url: 'https://legislative.gov.in', description: 'Restraint of trade' }],
                alternatives: ['Non-solicitation agreement']
              })
            }
          };
        }
        if (text.includes('forensic document')) {
          return {
            response: {
              text: () => JSON.stringify({
                authenticityScore: 85,
                isCompliant: true,
                compliantWith: 'Indian Contract Act 1872',
                redFlags: [],
                safetyScore: 80,
                safetyAnalysis: 'Standard commercial contract.',
                fakeIndication: 'Low',
                recommendation: 'Document is standard.'
              })
            }
          };
        }
        if (text.includes('visualization architecture')) {
          return {
            response: {
              text: () => JSON.stringify({
                textSummary: 'Summary of contract flows',
                flows: [{ id: '1', label: 'Dispute Flow', nodes: [{ id: 'n1', label: 'Notice' }], edges: [] }],
                responsibilities: { label: 'Duties', partyALabel: 'Tenant', partyBLabel: 'Landlord', items: [] }
              })
            }
          };
        }
        if (text.includes('Mermaid.js mindmaps')) {
          return {
            response: {
              text: () => '```mermaid\nmindmap\n  root((Contract))\n    Clauses\n```'
            }
          };
        }
        if (text.includes('legal translator')) {
          return {
            response: {
              text: () => 'Translated English contract text.'
            }
          };
        }
        return { response: { text: () => '{}' } };
      }),
    })),
  })),
  GEMINI_MODEL_FAST: 'gemini-2.0-flash',
}));

describe('Extended AI Services: Enforceability, Authenticity, Visualizations, & Proxy', () => {
  it('analyzes clause enforceability with regional statutory reasoning', async () => {
    const result = await analyzeClauseEnforceabilityWithGemini({
      clause: 'Non-compete for 5 years across India',
      jurisdiction: 'India',
      language: 'en'
    });

    expect(result.status).toBe('not_enforceable');
    expect(result.jurisdictionNotes).toContain('Section 27');
    expect(result.references).toHaveLength(1);
    expect(result.references[0].url).toContain('https://');
  });

  it('verifies document authenticity and returns forensic metrics', async () => {
    const authResult = await analyzeDocumentAuthenticity('Sample contract text', 'en');
    expect(authResult.authenticityScore).toBe(85);
    expect(authResult.isCompliant).toBe(true);
    expect(authResult.fakeIndication).toBe('Low');
  });

  it('synthesizes visualization structures and mindmap syntax', async () => {
    const visuals = await generateVisualizationsWithGemini({
      document: 'Tenant and Landlord agreement details.',
      language: 'en'
    });
    expect(visuals.flows).toHaveLength(1);
    expect(visuals.responsibilities).toBeDefined();

    const mindmap = await generateMindmapCode('Lease Termination');
    expect(mindmap).toContain('mindmap');
  });

  it('translates document text to English', async () => {
    const translated = await translateToEnglish('कागदपत्र मजकूर');
    expect(translated).toBe('Translated English contract text.');
  });

  it('verifies backend proxy configuration and fallback', async () => {
    // In local dev without VITE_API_BASE_URL
    const configured = isBackendProxyConfigured();
    expect(typeof configured).toBe('boolean');

    const result = await callAiBackendProxy('analyze', {});
    expect(result.success).toBe(false);
  });
});
