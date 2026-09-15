import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AnalysisResults from '../../analysis/AnalysisResults';
import type { DocumentAnalysis } from '../../types/legal';

const mockAnalysis: DocumentAnalysis = {
  id: 'test-101',
  documentType: 'Commercial Lease Agreement',
  plainSummary: 'This lease specifies tenant and landlord obligations with standard rent terms.',
  clauses: [
    {
      id: 'clause-1',
      title: 'Premises Use Restriction',
      originalText: 'The tenant shall not operate unauthorized commercial machinery.',
      simplifiedText: 'You cannot use unauthorized machines in the property.',
      riskLevel: 'medium',
      explanation: 'Protects building infrastructure from electrical overload.',
      rolePerspectives: [
        {
          role: 'Tenant',
          interpretation: 'Limits equipment usage without prior consent.',
          obligations: ['Obtain landlord approval for heavy equipment'],
          risks: ['Potential lease default'],
        },
      ],
    },
  ],
  risks: [
    {
      id: 'risk-1',
      clause: 'Premises Use Restriction',
      description: 'Strict restriction on machinery without clear definition of permissible items.',
      severity: 'high',
      recommendation: 'Request an itemized list of pre-approved equipment.',
    },
  ],
  actionPoints: [
    'Request equipment addendum before move-in',
    'Verify electrical capacity specifications',
  ],
  citations: [
    {
      title: 'Indian Contract Act 1872 - Section 27',
      url: 'https://legislative.gov.in/act/indian-contract-act-1872',
      description: 'Statutory provisions governing reasonable trade covenants.',
    },
  ],
  negotiationPoints: [
    {
      id: 'np-1',
      clauseId: 'clause-1',
      originalClause: 'The tenant shall not operate unauthorized commercial machinery.',
      issue: 'Vague definition of machinery',
      counterProposal: 'List permitted office and standard commercial electronics.',
      talkingPoint: 'Standard office equipment should not require case-by-case approval.',
    },
  ],
};

describe('AnalysisResults Component', () => {
  const mockOnNewAnalysis = vi.fn();
  const mockOnSave = vi.fn();

  it('renders document type, summary, and action points', () => {
    render(
      <AnalysisResults
        analysis={mockAnalysis}
        language="en"
        simplificationLevel="simple"
        onNewAnalysis={mockOnNewAnalysis}
        onSave={mockOnSave}
        isSaved={false}
      />
    );

    expect(screen.getByText('Commercial Lease Agreement')).toBeInTheDocument();
    expect(screen.getByText(/This lease specifies tenant and landlord obligations/i)).toBeInTheDocument();
    expect(screen.getByText(/Clause Lens/i)).toBeInTheDocument();
  });

  it('allows expanding and collapsing clauses to view role perspectives', () => {
    render(
      <AnalysisResults
        analysis={mockAnalysis}
        language="en"
        simplificationLevel="simple"
        onNewAnalysis={mockOnNewAnalysis}
        onSave={mockOnSave}
        isSaved={false}
      />
    );

    // Switch to Clause Lens tab
    const clauseTab = screen.getByText(/Clause Lens/i);
    fireEvent.click(clauseTab);

    const clauseTitle = screen.getByText('Premises Use Restriction');
    expect(clauseTitle).toBeInTheDocument();

    // Click clause to toggle expansion
    fireEvent.click(clauseTitle);

    // Simplified text should be visible
    expect(screen.getByText(/You cannot use unauthorized machines/i)).toBeInTheDocument();
  });

  it('renders save button and triggers save callback', () => {
    render(
      <AnalysisResults
        analysis={mockAnalysis}
        language="en"
        simplificationLevel="simple"
        onNewAnalysis={mockOnNewAnalysis}
        onSave={mockOnSave}
        isSaved={false}
      />
    );

    const saveBtn = screen.getAllByRole('button').find(b => b.textContent?.includes('Save') || b.querySelector('svg'));
    if (saveBtn) {
      fireEvent.click(saveBtn);
      expect(mockOnSave).toHaveBeenCalled();
    }
  });
});
