import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FeedbackForm, { saveFeedbackToStorage, getFeedbackFromStorage, getAllFeedbackFromStorage } from './FeedbackForm';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.gtag
(window as any).gtag = vi.fn();

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('FeedbackForm', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('renders feedback form when show is true', () => {
    renderWithRouter(
      <FeedbackForm show={true} onHide={() => {}} />
    );
    
    expect(screen.getByText('Encuesta Post-Evento')).toBeInTheDocument();
    expect(screen.getByText('⭐ Valoración General *')).toBeInTheDocument();
  });

  it('renders talk-specific title when talkTitle is provided', () => {
    renderWithRouter(
      <FeedbackForm 
        show={true} 
        onHide={() => {}} 
        talkTitle="DevOps Best Practices"
      />
    );
    
    expect(screen.getByText('Valora: DevOps Best Practices')).toBeInTheDocument();
  });

  it('disables submit button when overall rating is 0', () => {
    renderWithRouter(
      <FeedbackForm show={true} onHide={() => {}} />
    );
    
    const submitButton = screen.getByText('Enviar Feedback');
    expect(submitButton).toBeDisabled();
  });

  it('shows thank you message after submission', async () => {
    renderWithRouter(
      <FeedbackForm show={true} onHide={() => {}} />
    );
    
    // Click on 5th star
    const stars = screen.getAllByRole('radio');
    fireEvent.click(stars[4]); // 5th star
    
    // Submit
    const submitButton = screen.getByText('Enviar Feedback');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('¡Gracias por tu feedback!')).toBeInTheDocument();
    });
  });

  it('calls onHide when close button is clicked', async () => {
    const onHide = vi.fn();
    renderWithRouter(
      <FeedbackForm show={true} onHide={onHide} />
    );
    
    const closeButton = screen.getByText('Cerrar');
    fireEvent.click(closeButton);
    
    expect(onHide).toHaveBeenCalled();
  });
});

describe('Feedback Storage Utilities', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('saves feedback to localStorage', () => {
    const feedback = {
      id: 'test-1',
      overallRating: 5,
      contentRating: 4,
      speakerRating: 5,
      comment: 'Great talk!',
      wouldRecommend: true,
      submittedAt: new Date().toISOString(),
      type: 'session' as const,
    };
    
    saveFeedbackToStorage(feedback);
    
    const stored = getAllFeedbackFromStorage();
    expect(stored).toHaveLength(1);
    expect(stored[0].overallRating).toBe(5);
  });

  it('retrieves feedback by talkId', () => {
    const feedback = {
      id: 'test-1',
      talkId: 'talk-123',
      overallRating: 5,
      contentRating: 4,
      speakerRating: 5,
      comment: 'Great talk!',
      wouldRecommend: true,
      submittedAt: new Date().toISOString(),
      type: 'session' as const,
    };
    
    saveFeedbackToStorage(feedback);
    
    const retrieved = getFeedbackFromStorage('talk-123');
    expect(retrieved).not.toBeNull();
    expect(retrieved?.overallRating).toBe(5);
  });

  it('returns null for non-existent talkId', () => {
    const retrieved = getFeedbackFromStorage('non-existent');
    expect(retrieved).toBeNull();
  });

  it('updates existing feedback for same talkId', () => {
    const feedback1 = {
      id: 'test-1',
      talkId: 'talk-123',
      overallRating: 3,
      contentRating: 3,
      speakerRating: 3,
      comment: 'Okay',
      wouldRecommend: null,
      submittedAt: new Date().toISOString(),
      type: 'session' as const,
    };
    
    const feedback2 = {
      id: 'test-2',
      talkId: 'talk-123',
      overallRating: 5,
      contentRating: 5,
      speakerRating: 5,
      comment: 'Actually, it was great!',
      wouldRecommend: true,
      submittedAt: new Date().toISOString(),
      type: 'session' as const,
    };
    
    saveFeedbackToStorage(feedback1);
    saveFeedbackToStorage(feedback2);
    
    const stored = getAllFeedbackFromStorage();
    expect(stored).toHaveLength(1);
    expect(stored[0].overallRating).toBe(5);
  });
});
