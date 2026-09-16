import { describe, it, expect, vi } from 'vitest';
import { analyzeDocumentWithGemini } from '../../services/ai/documentAnalysis';
import { chatWithGemini } from '../../services/ai/documentChat';
import type { ChatRequest } from '../../types/chat';

// Mock the Gemini client to avoid external API calls and quota consumption in tests
vi.mock('../../services/ai/geminiClient', () => {
  const handler = async (req: any) => {
    const promptText = typeof req.contents === 'string' ? req.contents : (req.contents?.[0]?.parts?.[0]?.text || '');

    // If it is a chat request
    if (promptText.includes('User Question:')) {
      return {
        text: 'Under Section 4 of the uploaded agreement, the notice period required is 30 days prior to contract termination. Disclaimer: AI-generated information is for informational purposes and does not constitute legal advice.',
        rawResponse: {},
        modelUsed: 'gemini-3.6-flash'
      };
    }

    // Standard analysis request
    return {
      text: JSON.stringify({
        documentType: 'Non-Disclosure Agreement',
        plainSummary: 'This NDA protects proprietary technical information between the contracting entities.',
        clauses: [
          {
            id: '1',
            title: 'Confidential Information Definition',
            originalText: 'Confidential information includes all source code and business plans.',
            simplifiedText: 'Secret info includes code and plans.',
            riskLevel: 'low',
            explanation: 'Standard clear definition of proprietary data.',
            rolePerspectives: [
              {
                role: 'Consumer',
                interpretation: 'Clearly defines obligations',
                obligations: ['Keep secrets'],
                risks: [],
              },
            ],
          },
          {
            id: '2',
            title: 'Indemnity for Leak',
            originalText: 'Recipient agrees to indemnify Discloser for unlimited direct and indirect losses.',
            simplifiedText: 'You have to pay for all damages if secret info is leaked.',
            riskLevel: 'high',
            explanation: 'Uncapped indemnity creates severe financial exposure.',
            rolePerspectives: [
              {
                role: 'Business',
                interpretation: 'High unlimited exposure',
                obligations: ['Pay unlimited damages'],
                risks: ['Bankruptcy in case of dispute'],
              },
            ],
          },
        ],
        risks: [
          {
            id: 'risk-1',
            clause: 'Indemnity for Leak',
            description: 'Uncapped consequential liability.',
            severity: 'high',
            recommendation: 'Cap indemnity to contract value or 12 months fees.',
          },
        ],
        actionPoints: [
          'Add liability cap of ₹5,00,000',
          'Exclude non-willful breaches from indemnity',
        ],
        citations: [],
        negotiationPoints: [
          {
            id: 'np-1',
            clauseId: '2',
            originalClause: 'Recipient agrees to indemnify Discloser for unlimited losses.',
            issue: 'Uncapped consequential damages',
            counterProposal: 'Cap indemnity to total fees paid in previous 12 months.',
            talkingPoint: 'Standard commercial practice requires a mutual liability ceiling.',
          },
        ],
      }),
      rawResponse: {},
      modelUsed: 'gemini-3.6-flash'
    };
  };

  return {
    generateContentWithFallback: vi.fn().mockImplementation(handler),
    getGenAIClient: vi.fn(() => ({
      models: {
        generateContent: vi.fn().mockImplementation(handler)
      }
    })),
    requireGenAIClient: vi.fn(() => ({
      models: {
        generateContent: vi.fn().mockImplementation(handler)
      }
    })),
    PRIMARY_MODEL: 'gemini-3.6-flash',
    FALLBACK_MODEL: 'gemini-3.5-flash',
    GEMINI_MODEL_FAST: 'gemini-3.6-flash',
    GEMINI_MODEL_PRO: 'gemini-3.6-flash',
    GEMINI_MODEL_FALLBACK: 'gemini-3.5-flash',
  };
});

describe('Integration Workflows: Full End-to-End Logic', () => {
  it('Workflow 1: Document Upload -> Chunk & Parse -> Complete Legal Analysis', async () => {
    const documentText = `
      MUTUAL NON-DISCLOSURE AGREEMENT
      1. Definition: Confidential information includes all source code and business plans.
      2. Indemnity: Recipient agrees to indemnify Discloser for unlimited direct and indirect losses.
    `;

    const analysis = await analyzeDocumentWithGemini({
      content: documentText,
      language: 'en',
      simplificationLevel: 'simple',
    });

    expect(analysis).toBeDefined();
    expect(analysis.documentType).toBe('Non-Disclosure Agreement');
    expect(analysis.clauses).toHaveLength(2);
    expect(analysis.risks).toHaveLength(1);
    expect(analysis.risks[0].severity).toBe('high');
    expect(analysis.actionPoints).toHaveLength(2);
    expect(analysis.negotiationPoints).toHaveLength(1);
    expect(analysis.negotiationPoints[0].counterProposal).toContain('Cap indemnity');
  });

  it('Workflow 2: Document-Grounded Q&A Chat with Legal Disclaimer', async () => {
    const chatRequest: ChatRequest = {
      message: 'What is the required notice period for termination?',
      document: 'Section 4: Either party may terminate with 30 days prior written notice.',
      history: [],
      language: 'en',
    };

    const reply = await chatWithGemini(chatRequest);
    expect(reply.role).toBe('model');
    expect(reply.content).toContain('30 days');
    expect(reply.content.toLowerCase()).toContain('legal advice');
  });
});
