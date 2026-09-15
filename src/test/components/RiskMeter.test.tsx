import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RiskMeter from '../../components/RiskMeter';

describe('RiskMeter Component (Accessibility & Visualization)', () => {
  it('renders risk meter with heading and textual label', () => {
    render(<RiskMeter score={75} />);

    expect(screen.getByText(/RISK METER/i)).toBeInTheDocument();
    // High risk range (60-80) must show textual "HIGH" description, not just color
    expect(screen.getAllByText(/HIGH/i).length).toBeGreaterThan(0);
  });

  it('correctly maps low risk score to LOW label', () => {
    render(<RiskMeter score={25} />);
    expect(screen.getAllByText(/LOW/i).length).toBeGreaterThan(0);
  });

  it('correctly maps critical risk score to CRITICAL label', () => {
    render(<RiskMeter score={90} />);
    expect(screen.getAllByText(/CRITICAL/i).length).toBeGreaterThan(0);
  });

  it('supports explicit text level override', () => {
    render(<RiskMeter score={50} level="MODERATE" />);
    expect(screen.getByText('MODERATE')).toBeInTheDocument();
  });
});
