import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../adapters/triskelgate/client', () => ({
  triskelGateClient: {
    listTicketTypes: vi.fn(),
    createCheckout: vi.fn(),
  },
}));

vi.mock('react-bootstrap', () => ({
  Container: ({ children }) => <div>{children}</div>,
  Row: ({ children, ...p }) => <div>{children}</div>,
  Col: ({ children, ...p }) => <div>{children}</div>,
  Card: Object.assign(
    ({ children, className }) => <div className={className}>{children}</div>,
    { Body: ({ children }) => <div>{children}</div> }
  ),
  Button: ({ children, onClick, disabled, href, className }) =>
    href
      ? <a href={href} className={className}>{children}</a>
      : <button onClick={onClick} disabled={disabled} className={className}>{children}</button>,
  Spinner: () => <span>Cargando...</span>,
  Alert: ({ children, variant, onClose, dismissible }) => (
    <div role="alert" data-variant={variant}>
      {children}
      {dismissible && <button onClick={onClose}>cerrar</button>}
    </div>
  ),
}));

vi.mock('react-icons/bs', () => ({
  BsCheckCircleFill: () => <span>check</span>,
  BsStar: () => <span>star</span>,
  BsBriefcase: () => <span>brief</span>,
  BsArrowLeft: () => <span>back</span>,
}));

vi.mock('../components/SEO', () => ({ default: () => null }));

import { triskelGateClient } from '../adapters/triskelgate/client';
import Tickets from './Tickets';

const renderTickets = () => render(<BrowserRouter><Tickets /></BrowserRouter>);

describe('Tickets page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.prompt = vi.fn()
      .mockReturnValueOnce('Test User')
      .mockReturnValueOnce('test@example.com');
  });

  it('renders the three ticket tiers', () => {
    renderTickets();
    expect(screen.getByText('EXECUTIVE')).toBeInTheDocument();
    expect(screen.getByText('VIP PASS')).toBeInTheDocument();
    expect(screen.getByText('PARTNER')).toBeInTheDocument();
  });

  it('shows friendly message when TriskelGate is unreachable', async () => {
    triskelGateClient.listTicketTypes.mockRejectedValue(
      new TypeError('Failed to fetch'),
    );

    renderTickets();
    fireEvent.click(screen.getByText('Comprar Ahora'));

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/no está disponible/i);
      expect(alert).toHaveTextContent(/summit@xopsconferences\.com/i);
    });
  });

  it('shows technical error message for non-network failures', async () => {
    triskelGateClient.listTicketTypes.mockRejectedValue(
      new Error('No existe ticket activo "General" en evento 1'),
    );

    renderTickets();
    fireEvent.click(screen.getByText('Comprar Ahora'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/No existe ticket activo/i);
    });
  });
});
