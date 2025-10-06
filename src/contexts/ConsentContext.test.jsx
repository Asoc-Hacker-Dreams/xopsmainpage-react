import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConsentProvider, useConsent, CONSENT_CATEGORIES } from '../contexts/ConsentContext';
import React from 'react';

// Mock localStorage
const mockLocalStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value;
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Test component to access consent context
const TestComponent = ({ onConsentChange }) => {
  const consent = useConsent();
  
  React.useEffect(() => {
    if (onConsentChange) {
      onConsentChange(consent);
    }
  }, [consent, onConsentChange]);

  return (
    <div>
      <span data-testid="has-interacted">{consent.hasInteracted ? 'true' : 'false'}</span>
      <span data-testid="show-banner">{consent.showBanner ? 'true' : 'false'}</span>
      <span data-testid="essential-consent">{consent.consent.essential ? 'true' : 'false'}</span>
      <span data-testid="analytics-consent">{consent.consent.analytics ? 'true' : 'false'}</span>
      <span data-testid="marketing-consent">{consent.consent.marketing ? 'true' : 'false'}</span>
      <button onClick={consent.acceptAll} data-testid="accept-all">Accept All</button>
      <button onClick={consent.rejectAll} data-testid="reject-all">Reject All</button>
      <button onClick={() => consent.updateCategory(CONSENT_CATEGORIES.ANALYTICS, true)} data-testid="enable-analytics">
        Enable Analytics
      </button>
    </div>
  );
};

describe('ConsentContext', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  it('should provide default consent state', () => {
    render(
      <ConsentProvider>
        <TestComponent />
      </ConsentProvider>
    );

    expect(screen.getByTestId('has-interacted')).toHaveTextContent('false');
    expect(screen.getByTestId('show-banner')).toHaveTextContent('true');
    expect(screen.getByTestId('essential-consent')).toHaveTextContent('true');
    expect(screen.getByTestId('analytics-consent')).toHaveTextContent('false');
    expect(screen.getByTestId('marketing-consent')).toHaveTextContent('false');
  });

  it('should accept all cookies when acceptAll is called', async () => {
    render(
      <ConsentProvider>
        <TestComponent />
      </ConsentProvider>
    );

    fireEvent.click(screen.getByTestId('accept-all'));

    await waitFor(() => {
      expect(screen.getByTestId('has-interacted')).toHaveTextContent('true');
      expect(screen.getByTestId('show-banner')).toHaveTextContent('false');
      expect(screen.getByTestId('essential-consent')).toHaveTextContent('true');
      expect(screen.getByTestId('analytics-consent')).toHaveTextContent('true');
      expect(screen.getByTestId('marketing-consent')).toHaveTextContent('true');
    });
  });

  it('should reject all non-essential cookies when rejectAll is called', async () => {
    render(
      <ConsentProvider>
        <TestComponent />
      </ConsentProvider>
    );

    fireEvent.click(screen.getByTestId('reject-all'));

    await waitFor(() => {
      expect(screen.getByTestId('has-interacted')).toHaveTextContent('true');
      expect(screen.getByTestId('show-banner')).toHaveTextContent('false');
      expect(screen.getByTestId('essential-consent')).toHaveTextContent('true');
      expect(screen.getByTestId('analytics-consent')).toHaveTextContent('false');
      expect(screen.getByTestId('marketing-consent')).toHaveTextContent('false');
    });
  });

  it('should update specific category when updateCategory is called', async () => {
    render(
      <ConsentProvider>
        <TestComponent />
      </ConsentProvider>
    );

    fireEvent.click(screen.getByTestId('enable-analytics'));

    await waitFor(() => {
      expect(screen.getByTestId('analytics-consent')).toHaveTextContent('true');
      expect(screen.getByTestId('marketing-consent')).toHaveTextContent('false');
    });
  });

  it('should persist consent to localStorage', async () => {
    render(
      <ConsentProvider>
        <TestComponent />
      </ConsentProvider>
    );

    fireEvent.click(screen.getByTestId('accept-all'));

    await waitFor(() => {
      const stored = mockLocalStorage.getItem('xops-cookie-consent');
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored);
      expect(parsed.consent.essential).toBe(true);
      expect(parsed.consent.analytics).toBe(true);
      expect(parsed.consent.marketing).toBe(true);
      expect(parsed.version).toBe('1.0');
      expect(parsed.timestamp).toBeTruthy();
    });
  });

  it('should load consent from localStorage on initialization', () => {
    // Pre-populate localStorage
    const consentData = {
      consent: {
        essential: true,
        analytics: true,
        marketing: false
      },
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    mockLocalStorage.setItem('xops-cookie-consent', JSON.stringify(consentData));

    render(
      <ConsentProvider>
        <TestComponent />
      </ConsentProvider>
    );

    expect(screen.getByTestId('has-interacted')).toHaveTextContent('true');
    expect(screen.getByTestId('show-banner')).toHaveTextContent('false');
    expect(screen.getByTestId('essential-consent')).toHaveTextContent('true');
    expect(screen.getByTestId('analytics-consent')).toHaveTextContent('true');
    expect(screen.getByTestId('marketing-consent')).toHaveTextContent('false');
  });

  it('should show banner for expired consent', () => {
    // Create expired consent (13 months old)
    const expiredDate = new Date();
    expiredDate.setMonth(expiredDate.getMonth() - 13);
    
    const consentData = {
      consent: {
        essential: true,
        analytics: true,
        marketing: true
      },
      timestamp: expiredDate.toISOString(),
      version: '1.0'
    };
    mockLocalStorage.setItem('xops-cookie-consent', JSON.stringify(consentData));

    render(
      <ConsentProvider>
        <TestComponent />
      </ConsentProvider>
    );

    expect(screen.getByTestId('show-banner')).toHaveTextContent('true');
    expect(screen.getByTestId('has-interacted')).toHaveTextContent('false');
  });

  it('should not allow disabling essential cookies', () => {
    let consentContext;
    
    render(
      <ConsentProvider>
        <TestComponent onConsentChange={(consent) => { consentContext = consent; }} />
      </ConsentProvider>
    );

    // Try to disable essential cookies
    consentContext.updateCategory(CONSENT_CATEGORIES.ESSENTIAL, false);

    // Essential should still be true
    expect(screen.getByTestId('essential-consent')).toHaveTextContent('true');
  });
});