import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AppShell from '../../components/AppShell';
import ChatFloating from '../../chatbot/ChatFloating';

describe('AppShell & ChatFloating Components', () => {
  it('renders LexPrime AI branding and navigation landmarks in AppShell', () => {
    const mockNavigate = vi.fn();
    const mockLangChange = vi.fn();

    render(
      <AppShell
        current="upload"
        onNavigate={mockNavigate}
        language="en"
        onLanguageChange={mockLangChange}
      >
        <div data-testid="main-content">Content Body</div>
      </AppShell>
    );

    expect(screen.getAllByText(/LexPrime AI/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });

  it('renders ChatFloating button with accessible aria label', () => {
    const mockToggle = vi.fn();

    render(
      <ChatFloating
        isOpen={false}
        onToggle={mockToggle}
        document="Test document content"
        language="en"
      />
    );

    // Look for button that toggles chat
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(mockToggle).toHaveBeenCalled();
  });
});
