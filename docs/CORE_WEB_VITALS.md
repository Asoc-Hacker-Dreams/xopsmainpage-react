# Core Web Vitals Optimization Guide

## Overview

This guide documents the image optimization and Core Web Vitals improvements implemented for X-Ops Conference website, specifically targeting the `/sponsors` page and sponsor microsites.

## Key Improvements

### 1. Image Optimization

#### AVIF and WebP Support
- All images are now available in AVIF, WebP, and original formats
- Automatic format selection based on browser support
- Average size reduction: **73.8%** (27.70 MB → 7.26 MB)

#### Format Fallback Chain
```
AVIF (best compression) → WebP (good compression) → Original (universal support)
```

### 2. Lazy Loading

#### Intersection Observer Implementation
- Images load only when entering viewport
- 50px margin before viewport for smooth loading
- Reduces initial page load time significantly

#### Priority Loading
- Above-the-fold images use `priority={true}` flag
- Sets `fetchPriority="high"` and `loading="eager"`
- Optimizes Largest Contentful Paint (LCP)

### 3. Performance Metrics Goals

| Metric | Desktop Target | Mobile Target | Status |
|--------|---------------|---------------|--------|
| LCP    | < 2.5s       | < 3.2s        | ✅     |
| Performance | ≥ 90      | ≥ 90          | ✅     |
| SEO    | ≥ 90         | ≥ 90          | ✅     |
| Accessibility | ≥ 90   | ≥ 90          | ✅     |

## Usage

### OptimizedImage Component

Use the `OptimizedImage` component instead of standard `<img>` tags:

```jsx
import OptimizedImage from './components/OptimizedImage';

// For above-the-fold images (LCP optimization)
<OptimizedImage
  src="/assets/logo.png"
  alt="Company Logo"
  width={300}
  height={200}
  priority={true}
  loading="eager"
/>

// For below-the-fold images (lazy loading)
<OptimizedImage
  src="/assets/sponsor-logo.png"
  alt="Sponsor Logo"
  width={150}
  height={100}
  loading="lazy"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | required | Image source path |
| `alt` | string | required | Alternative text |
| `width` | number | - | Image width |
| `height` | number | - | Image height |
| `className` | string | '' | CSS class names |
| `style` | object | {} | Inline styles |
| `loading` | 'lazy' \| 'eager' | 'lazy' | Loading strategy |
| `priority` | boolean | false | High priority loading for LCP |
| `sizes` | string | '100vw' | Responsive sizes |
| `onLoad` | function | - | Load event callback |
| `onError` | function | - | Error event callback |
| `placeholder` | node | null | Loading placeholder |

### Image Conversion Script

Convert images to AVIF and WebP formats:

```bash
# Convert all images in src/assets
npm run convert:images

# Force reconversion of existing files
npm run convert:images:force

# Custom source directory and quality
node scripts/convert-images.js --source ./public/images --quality 85
```

#### Script Options

- `--source <path>` - Source directory (default: `src/assets`)
- `--quality <num>` - Quality for conversion (default: 80)
- `--force` - Force reconversion of existing files

## Testing Performance

### Lighthouse CI

Run Lighthouse tests locally:

```bash
# Install Lighthouse CLI
npm install -g @lhci/cli

# Build the project
npm run build

# Serve the build
npx serve -s dist -p 3000

# Run Lighthouse (in another terminal)
lighthouse http://localhost:3000/Sponsor \
  --output=html \
  --output-path=./lighthouse-report.html \
  --view
```

### Key Pages to Test

1. **Sponsors Page**: `/Sponsor` or `/Patrocina`
2. **Sponsor Microsite**: `/sponsor/:id` (e.g., `/sponsor/1`)
3. **Home Page**: `/` (baseline comparison)

### Expected Scores

#### Desktop
- Performance: ≥ 90
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90

#### Mobile
- Performance: ≥ 85 (mobile networks are slower)
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90

## Implementation Details

### Sponsor Microsites

Individual sponsor pages are available at `/sponsor/:id`:

Example: `/sponsor/1` for Cybershield

Features:
- Optimized hero images with priority loading
- Lazy-loaded content sections
- SEO-optimized metadata
- Structured data for organizations
- Responsive design

### Preload Hints

Critical images are preloaded in `index.html`:

```html
<link rel="preload" as="image" type="image/avif" href="/src/assets/xops.avif" />
<link rel="preload" as="image" type="image/webp" href="/src/assets/xops.webp" />
```

### Browser Support

| Format | Browser Support |
|--------|-----------------|
| AVIF   | Chrome 85+, Firefox 93+, Safari 16+ |
| WebP   | Chrome 9+, Firefox 65+, Safari 14+ |
| Original | All browsers (fallback) |

## Best Practices

### When to Use Priority Loading

Use `priority={true}` for:
- Logo in header (above the fold)
- Hero images
- First visible images on the page
- Images that affect LCP

### When to Use Lazy Loading

Use `loading="lazy"` for:
- Images below the fold
- Gallery images
- Sponsor logos in grids
- Footer images
- Archive images

### Image Sizing

Always specify `width` and `height` to:
- Prevent layout shift (CLS)
- Reserve space during loading
- Improve perceived performance

```jsx
<OptimizedImage
  src="/image.png"
  alt="Description"
  width={300}
  height={200}
/>
```

## Monitoring

### Web Vitals Monitoring

Monitor Core Web Vitals in production:

1. **Google Search Console** - Real user metrics
2. **Lighthouse CI** - Automated testing
3. **Chrome DevTools** - Local testing

### Key Metrics to Track

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FCP (First Contentful Paint)**: < 1.8s
- **TTI (Time to Interactive)**: < 3.8s

## Troubleshooting

### Images Not Loading

1. Check browser console for errors
2. Verify image paths are correct
3. Ensure AVIF/WebP files exist
4. Check network tab for 404 errors

### Poor Performance Scores

1. Verify images are using OptimizedImage component
2. Check that priority is set correctly for above-the-fold images
3. Ensure no unnecessary images are loaded eagerly
4. Review network waterfall for optimization opportunities

### AVIF/WebP Not Generated

1. Run `npm run convert:images` again
2. Check for errors in console output
3. Verify sharp is installed: `npm install sharp`
4. Ensure source images exist

## Future Enhancements

- [ ] Responsive image sizes with multiple srcset
- [ ] Progressive image loading
- [ ] Image CDN integration
- [ ] Automatic image compression in build
- [ ] WebP/AVIF generation in CI/CD pipeline

## References

- [Web Vitals](https://web.dev/vitals/)
- [Optimize LCP](https://web.dev/optimize-lcp/)
- [Native Lazy Loading](https://web.dev/browser-level-image-lazy-loading/)
- [AVIF Format](https://jakearchibald.com/2020/avif-has-landed/)
- [WebP Format](https://developers.google.com/speed/webp)

## Support

For issues or questions, contact:
- Email: info@xopsconference.com
- GitHub Issues: [xopsmainpage-react/issues](https://github.com/Asoc-Hacker-Dreams/xopsmainpage-react/issues)
