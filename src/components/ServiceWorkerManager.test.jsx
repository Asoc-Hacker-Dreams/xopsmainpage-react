import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ServiceWorkerManager from './ServiceWorkerManager';

// Mock del service worker
const mockServiceWorker = {
  register: vi.fn(),
  addEventListener: vi.fn(),
  controller: null,
};

const mockRegistration = {
  addEventListener: vi.fn(),
  installing: null,
  waiting: null,
};

describe('ServiceWorkerManager', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock navigator.serviceWorker
    Object.defineProperty(navigator, 'serviceWorker', {
      value: mockServiceWorker,
      writable: true,
    });
    
    // Mock document.readyState
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: true,
    });
    
    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      value: { reload: vi.fn() },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crashing', () => {
    mockServiceWorker.register.mockResolvedValue(mockRegistration);
    render(<ServiceWorkerManager />);
    expect(true).toBe(true); // Component renders without errors
  });

  it('registers service worker on mount when document is ready', async () => {
    mockServiceWorker.register.mockResolvedValue(mockRegistration);
    
    render(<ServiceWorkerManager />);
    
    await waitFor(() => {
      expect(mockServiceWorker.register).toHaveBeenCalledWith('/sw.js');
    });
  });

  it('shows update toast when waiting worker is available', async () => {
    const mockWaitingWorker = {
      postMessage: vi.fn(),
      addEventListener: vi.fn(),
      state: 'installed',
    };
    
    mockRegistration.waiting = mockWaitingWorker;
    mockServiceWorker.controller = {};
    mockServiceWorker.register.mockResolvedValue(mockRegistration);
    
    render(<ServiceWorkerManager />);
    
    await waitFor(() => {
      expect(screen.getByText(/nueva versión disponible/i)).toBeInTheDocument();
      expect(screen.getByText(/una nueva versión de la aplicación está disponible/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument();
    });
  });

  it('handles update button click correctly', async () => {
    const mockWaitingWorker = {
      postMessage: vi.fn(),
      addEventListener: vi.fn(),
      state: 'installed',
    };
    
    mockRegistration.waiting = mockWaitingWorker;
    mockServiceWorker.controller = {};
    mockServiceWorker.register.mockResolvedValue(mockRegistration);
    
    render(<ServiceWorkerManager />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument();
    });
    
    const updateButton = screen.getByRole('button', { name: /actualizar/i });
    fireEvent.click(updateButton);
    
    expect(mockWaitingWorker.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
  });

  it('dismisses toast when close button is clicked', async () => {
    const mockWaitingWorker = {
      postMessage: vi.fn(),
      addEventListener: vi.fn(),
      state: 'installed',
    };
    
    mockRegistration.waiting = mockWaitingWorker;
    mockServiceWorker.controller = {};
    mockServiceWorker.register.mockResolvedValue(mockRegistration);
    
    render(<ServiceWorkerManager />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/close/i)).toBeInTheDocument();
    });
    
    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText(/nueva versión disponible/i)).not.toBeInTheDocument();
    });
  });

  it('handles service worker registration failure gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockServiceWorker.register.mockRejectedValue(new Error('Registration failed'));
    
    render(<ServiceWorkerManager />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Service worker registration failed:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });

  it('does not register service worker when not supported', () => {
    // Remove serviceWorker from navigator
    Object.defineProperty(navigator, 'serviceWorker', {
      value: undefined,
      writable: true,
    });
    
    render(<ServiceWorkerManager />);
    
    expect(mockServiceWorker.register).not.toHaveBeenCalled();
  });
});
