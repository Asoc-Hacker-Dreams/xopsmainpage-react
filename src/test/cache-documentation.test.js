import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

describe('Cache Documentation Tests', () => {
  it('README includes Offline Data Caching section', () => {
    const readmePath = path.join(process.cwd(), 'README.md');
    const readmeContent = readFileSync(readmePath, 'utf8');
    
    expect(readmeContent).toContain('## Offline Data Caching');
    expect(readmeContent).toContain('DATA_CACHE');
    expect(readmeContent).toContain('DATA_URLS');
  });

  it('README includes cache versioning examples', () => {
    const readmePath = path.join(process.cwd(), 'README.md');
    const readmeContent = readFileSync(readmePath, 'utf8');
    
    expect(readmeContent).toContain('data-cache-v2');
    expect(readmeContent).toContain('caches.delete');
    expect(readmeContent).toContain('validCaches');
  });

  it('README includes manual purging instructions', () => {
    const readmePath = path.join(process.cwd(), 'README.md');
    const readmeContent = readFileSync(readmePath, 'utf8');
    
    expect(readmeContent).toContain('Para purga manual');
    expect(readmeContent).toContain('await caches.delete');
    expect(readmeContent).toContain('data-cache-v1');
  });

  it('Service Worker includes DATA_CACHE implementation', () => {
    const swPath = path.join(process.cwd(), 'public/sw.js');
    const swContent = readFileSync(swPath, 'utf8');
    
    expect(swContent).toContain('const DATA_CACHE = \'data-cache-v1\'');
    expect(swContent).toContain('const DATA_URLS = [');
    expect(swContent).toContain('/api/agenda');
    expect(swContent).toContain('/api/ponentes');
  });

  it('Service Worker includes cache versioning strategy', () => {
    const swPath = path.join(process.cwd(), 'public/sw.js');
    const swContent = readFileSync(swPath, 'utf8');
    
    expect(swContent).toContain('validCaches');
    expect(swContent).toContain('CACHE_NAME, DATA_CACHE');
    expect(swContent).toContain('caches.delete(cacheName)');
  });
});