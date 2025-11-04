import '@testing-library/jest-dom';
import { vi } from 'vitest';
import 'fake-indexeddb/auto';

// Mock para usePWA hook
vi.mock('../hooks/usePWA.js', () => ({
  default: () => ({
    isStandalone: false,
    canInstall: false,
    installPrompt: null,
    handleInstall: vi.fn()
  })
}));

// Mock para Service Worker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: vi.fn(() => Promise.resolve()),
    ready: Promise.resolve({
      unregister: vi.fn(() => Promise.resolve(true))
    })
  },
  writable: true
});

// Mock para window.matchMedia (responsive design)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock para IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock para scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true
});

// Mock para localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Setup global para testing
global.beforeEach = () => {
  vi.clearAllMocks();
};
