import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ShareButtons from './ShareButtons';

// Mock window.open
const mockOpen = vi.fn();
window.open = mockOpen;

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

// Mock gtag
(window as any).gtag = vi.fn();

describe('ShareButtons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all share buttons in buttons variant', () => {
    render(<ShareButtons variant="buttons" />);
    
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('Copiar')).toBeInTheDocument();
  });

  it('opens Twitter share dialog when clicked', () => {
    render(
      <ShareButtons 
        url="https://example.com" 
        title="Test Title"
        variant="buttons"
      />
    );
    
    const twitterButton = screen.getByText('Twitter').closest('button');
    fireEvent.click(twitterButton!);
    
    expect(mockOpen).toHaveBeenCalled();
    const callUrl = mockOpen.mock.calls[0][0];
    expect(callUrl).toContain('twitter.com');
    expect(callUrl).toContain('Test%20Title');
  });

  it('opens LinkedIn share dialog when clicked', () => {
    render(
      <ShareButtons 
        url="https://example.com" 
        variant="buttons"
      />
    );
    
    const linkedinButton = screen.getByText('LinkedIn').closest('button');
    fireEvent.click(linkedinButton!);
    
    expect(mockOpen).toHaveBeenCalled();
    const callUrl = mockOpen.mock.calls[0][0];
    expect(callUrl).toContain('linkedin.com');
  });

  it('opens WhatsApp share dialog when clicked', () => {
    render(
      <ShareButtons 
        url="https://example.com" 
        title="Test"
        variant="buttons"
      />
    );
    
    const whatsappButton = screen.getByText('WhatsApp').closest('button');
    fireEvent.click(whatsappButton!);
    
    expect(mockOpen).toHaveBeenCalled();
    const callUrl = mockOpen.mock.calls[0][0];
    expect(callUrl).toContain('whatsapp.com');
    expect(callUrl).toContain('Test');
  });

  it('copies link to clipboard when copy button clicked', async () => {
    render(
      <ShareButtons 
        url="https://example.com" 
        variant="buttons"
      />
    );
    
    const copyButton = screen.getByText('Copiar').closest('button');
    fireEvent.click(copyButton!);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com');
  });

  it('renders icons variant correctly', () => {
    render(<ShareButtons variant="icons" />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  it('includes hashtags in Twitter share URL', () => {
    render(
      <ShareButtons 
        url="https://example.com" 
        title="Test"
        hashtags={['DevOps', 'Tech']}
        variant="buttons"
      />
    );
    
    const twitterButton = screen.getByText('Twitter').closest('button');
    fireEvent.click(twitterButton!);
    
    const callUrl = mockOpen.mock.calls[0][0];
    expect(callUrl).toContain('DevOps');
    expect(callUrl).toContain('Tech');
  });
});
