import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../data/schedule2026.json', () => ({ default: [] }));

vi.mock('../AnimationWrapper', () => ({
  default: ({ children }) => <div data-testid="animation-wrapper">{children}</div>,
}));

vi.mock('react-bootstrap', () => ({
  Container: ({ children }) => <div>{children}</div>,
  Row: ({ children, ...props }) => <div>{children}</div>,
  Col: ({ children, ...props }) => <div>{children}</div>,
  Modal: ({ children, show }) => (show ? <div role="dialog">{children}</div> : null),
}));

import Events from './Events';

describe('Events component', () => {
  it('shows coming-soon banner when schedule is empty', () => {
    render(<Events />);
    expect(screen.getByText(/Ponentes y agenda próximamente/i)).toBeInTheDocument();
  });

  it('shows CFP call to action when schedule is empty', () => {
    render(<Events />);
    expect(screen.getByText(/Call for Papers/i)).toBeInTheDocument();
  });

  it('does not show day-filter buttons when schedule is empty', () => {
    render(<Events />);
    expect(screen.queryByText(/viernes/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sábado/i)).not.toBeInTheDocument();
  });

  it('renders the events section with correct id', () => {
    render(<Events />);
    expect(document.querySelector('#events')).toBeInTheDocument();
  });
});
