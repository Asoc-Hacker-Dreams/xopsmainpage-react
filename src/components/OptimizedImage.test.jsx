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

  it('usa las fuentes alternativas que le pasan, ya resueltas por el bundler', () => {
    // Las alternativas llegan con el hash correcto porque el bundler las ha
    // resuelto. Esto es lo que se usa en produccion.
    const { container } = render(
      <OptimizedImage
        src="/assets/xops-D73UKbcv.png"
        avifSrc="/assets/xops-BBQ8ixat.avif"
        webpSrc="/assets/xops-iEZUSOEB.webp"
        alt="Multi-format image"
        priority={true}
      />
    );

    const picture = container.querySelector('picture');
    expect(picture).toBeInTheDocument();

    const sources = [...picture.querySelectorAll('source')];
    expect(sources).toHaveLength(2);
    expect(sources[0]).toHaveAttribute('type', 'image/avif');
    expect(sources[0]).toHaveAttribute('srcset', '/assets/xops-BBQ8ixat.avif');
    expect(sources[1]).toHaveAttribute('type', 'image/webp');
    expect(sources[1]).toHaveAttribute('srcset', '/assets/xops-iEZUSOEB.webp');
  });

  it('sin alternativas explicitas NO inventa URLs derivadas de un nombre con hash', () => {
    // Un nombre con hash de Vite no permite derivar el hash del AVIF/WebP:
    // la URL derivada no existe y, con el <source> en 404, el navegador no
    // cae al <img> de reserva y la imagen no se ve. Sin alternativas, solo
    // se sirve el original.
    const { container } = render(
      <OptimizedImage
        src="/assets/xops-D73UKbcv.png"
        alt="Sin alternativas"
        priority={true}
      />
    );

    const picture = container.querySelector('picture');
    const sources = [...picture.querySelectorAll('source')];
    expect(sources).toHaveLength(0);
    expect(picture.querySelector('img')?.getAttribute('src')).toBe('/assets/xops-D73UKbcv.png');
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

/**
 * BUG (26-nov-2026, detectado por Antonio en la web): el componente derivaba
 * las URLs de AVIF y WebP del nombre del fichero con un replace. Vite hashea
 * cada asset por separado, asi que un `xops.png` importado llega como
 * `/assets/xops-D73UKbcv.png` y el replace genera
 * `/assets/xops-D73UKbcv.avif`, que NO existe (el real es
 * `/assets/xops-BBQ8ixat.avif`).
 *
 * Con el <source> avif en 404, el navegador NO cae al <img> fallback y la
 * imagen no se ve (naturalWidth 0). Era el logo que no cargaba.
 *
 * El arreglo: que el llamante pase las alternativas ya resueltas por el
 * bundler (imports explicitos), en vez de derivarlas del nombre.
 */
describe('OptimizedImage — las fuentes alternativas no se derivan del nombre', () => {
  it('usa avifSrc y webpSrc cuando se le pasan (resueltos por el bundler)', () => {
    const { container } = render(
      <OptimizedImage
        src="/assets/xops-D73UKbcv.png"
        avifSrc="/assets/xops-BBQ8ixat.avif"
        webpSrc="/assets/xops-iEZUSOEB.webp"
        alt="Logo"
        width={56}
        height={51}
        priority
      />,
    );
    const sources = [...container.querySelectorAll('source')];
    const avif = sources.find((s) => s.getAttribute('type') === 'image/avif');
    const webp = sources.find((s) => s.getAttribute('type') === 'image/webp');
    expect(avif?.getAttribute('srcset')).toBe('/assets/xops-BBQ8ixat.avif');
    expect(webp?.getAttribute('srcset')).toBe('/assets/xops-iEZUSOEB.webp');
    // Y el <img> de reserva sigue siendo el original.
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/assets/xops-D73UKbcv.png');
  });

  it('sin fuentes explicitas NO deriva URLs de un nombre ya hasheado', () => {
    // Si no se le pasan las alternativas, no se inventan: un nombre con hash no
    // permite derivar los otros formatos. Se deja solo el original.
    const { container } = render(
      <OptimizedImage
        src="/assets/xops-D73UKbcv.png"
        alt="Logo"
        width={56}
        height={51}
        priority
      />,
    );
    const sources = [...container.querySelectorAll('source')];
    // Ningun source debe apuntar a una URL derivada (xops-D73UKbcv.avif).
    sources.forEach((s) => {
      const srcset = s.getAttribute('srcset') || '';
      expect(srcset).not.toMatch(/-[A-Za-z0-9_-]{8}\.avif$/);
      expect(srcset).not.toMatch(/-[A-Za-z0-9_-]{8}\.webp$/);
    });
  });
});
