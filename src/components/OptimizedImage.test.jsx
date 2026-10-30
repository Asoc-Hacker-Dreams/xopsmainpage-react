import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import OptimizedImage from './OptimizedImage';

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe(element) {
    // Simulate immediate intersection for tests
    this.callback([{ isIntersecting: true, target: element }]);
  }

  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = MockIntersectionObserver;

describe('OptimizedImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image" 
      />
    );
    
    expect(screen.getByAltText('Test image')).toBeInTheDocument();
  });

  it('renders with priority flag for LCP optimization', () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Priority image" 
        priority={true}
      />
    );
    
    const img = screen.getByAltText('Priority image');
    expect(img).toHaveAttribute('fetchPriority', 'high');
    expect(img).toHaveAttribute('decoding', 'sync');
  });

  it('renders with lazy loading by default', () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Lazy image" 
      />
    );
    
    const img = screen.getByAltText('Lazy image');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('generates correct image format sources', () => {
    const { container } = render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Multi-format image" 
        priority={true}
      />
    );
    
    const picture = container.querySelector('picture');
    expect(picture).toBeInTheDocument();
    
    const sources = picture.querySelectorAll('source');
    expect(sources).toHaveLength(2);
    
    // Check AVIF source
    expect(sources[0]).toHaveAttribute('type', 'image/avif');
    expect(sources[0]).toHaveAttribute('srcset', '/test-image.avif');
    
    // Check WebP source
    expect(sources[1]).toHaveAttribute('type', 'image/webp');
    expect(sources[1]).toHaveAttribute('srcset', '/test-image.webp');
  });

  it('applies custom className and style', () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Styled image" 
        className="custom-class"
        style={{ borderRadius: '8px' }}
        priority={true}
      />
    );
    
    const img = screen.getByAltText('Styled image');
    expect(img).toHaveClass('custom-class');
  });

  it('sets width and height attributes', () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Sized image" 
        width={300}
        height={200}
        priority={true}
      />
    );
    
    const img = screen.getByAltText('Sized image');
    expect(img).toHaveAttribute('width', '300');
    expect(img).toHaveAttribute('height', '200');
  });

  it('calls onLoad callback when image loads', async () => {
    const handleLoad = vi.fn();
    
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Loading image" 
        onLoad={handleLoad}
        priority={true}
      />
    );
    
    const img = screen.getByAltText('Loading image');
    
    // Simulate image load
    img.dispatchEvent(new Event('load'));
    
    await waitFor(() => {
      expect(handleLoad).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onError callback when image fails to load', async () => {
    const handleError = vi.fn();
    
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Error image" 
        onError={handleError}
        priority={true}
      />
    );
    
    const img = screen.getByAltText('Error image');
    
    // Simulate image error
    img.dispatchEvent(new Event('error'));
    
    await waitFor(() => {
      expect(handleError).toHaveBeenCalledTimes(1);
    });
  });
});
