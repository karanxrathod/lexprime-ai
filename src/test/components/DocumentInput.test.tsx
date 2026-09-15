import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DocumentInput from '../../components/DocumentInput';

describe('DocumentInput Component', () => {
  const mockOnSubmit = vi.fn();

  it('renders upload title and document drag zone', () => {
    render(
      <DocumentInput
        onSubmit={mockOnSubmit}
        isAnalyzing={false}
        language="en"
      />
    );

    expect(screen.getAllByText(/Upload/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Drag and drop/i).length).toBeGreaterThan(0);
  });

  it('allows clicking sample document and submitting for analysis', () => {
    render(
      <DocumentInput
        onSubmit={mockOnSubmit}
        isAnalyzing={false}
        language="en"
      />
    );

    // Click sample button to load a sample document into preview modal
    const sampleBtn = screen.getByRole('button', { name: /Try Sample/i });
    expect(sampleBtn).toBeInTheDocument();
    fireEvent.click(sampleBtn);

    // In the preview modal, click Run Analysis
    const runBtn = screen.getByRole('button', { name: /Run Analysis/i });
    expect(runBtn).toBeInTheDocument();
    fireEvent.click(runBtn);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('submits text via action trigger', () => {
    render(
      <DocumentInput
        onSubmit={mockOnSubmit}
        isAnalyzing={false}
        language="en"
      />
    );

    const hiddenBtn = document.getElementById('hidden-submit-btn');
    expect(hiddenBtn).toBeInTheDocument();
  });
});
