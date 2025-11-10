# GitHub Copilot Instructions for X-Ops Conference Project

## 🎯 Project Overview

This is the main website for X-Ops Conference, built with React, Vite, and Bootstrap. The project follows OSDO (Open SecDevOps) compliance standards and implements comprehensive security practices.

### Tech Stack
- **Frontend**: React 18.3.1, React Router DOM 6.27.0
- **Build Tool**: Vite 6.3.5 (latest)
- **Styling**: Bootstrap 5.3.3, React Bootstrap 2.10.5
- **Data Layer**: Dexie 4.2.1 (IndexedDB wrapper)
- **Testing**: Vitest, React Testing Library
- **Security**: ESLint Security Plugin, Snyk, GitLeaks, Semgrep
- **CI/CD**: GitHub Actions with OSDO compliance pipeline
- **Deployment**: Netlify (primary), AWS Amplify (secondary)

### Architecture Patterns
- **Data Access Layer (DAL)**: Abstraction layer for data sources (JSON/CMS)
- **Offline-First**: IndexedDB caching with Dexie for conference data
- **Progressive Web App (PWA)**: Service Worker, offline support, installable
- **Cookie Consent Management**: GDPR-compliant consent system

## 📋 Code Generation Guidelines

### 1. Component Structure
When creating React components, follow this pattern:

```jsx
import PropTypes from 'prop-types';
import AnimationWrapper from './AnimationWrapper';
import { Container, Row, Col } from 'react-bootstrap';

const ComponentName = ({ prop1, prop2 }) => {
  return (
    <section id="section-id" className="section-class">
      <Container>
        <AnimationWrapper animation="fade-up" duration={1000}>
          {/* Component content */}
        </AnimationWrapper>
      </Container>
    </section>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.object
};

export default ComponentName;
```

### 1.1 Data Layer Integration
When working with conference data (speakers, talks, schedule), use the Data Access Layer (DAL):

```jsx
import { useEffect, useState } from 'react';
import { DAL } from '../data/dal';

const ConferenceComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await DAL.getAgenda({ day: '2025-05-30' });
        setData(result);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Render data */}</div>;
};
```

**DAL Methods Available:**
- `DAL.getAgenda(filters)` - Get talks/schedule with filters (day, track, type, room)
- `DAL.getTalk(idOrSlug)` - Get specific talk by ID or slug
- `DAL.getSpeakers(filters)` - Get speakers with optional filters
- `DAL.getSpeaker(idOrSlug)` - Get specific speaker by ID or slug

### 2. Testing Requirements
Always create tests for new components:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('renders without crashing', () => {
    render(<ComponentName />);
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });
});
```

### 3. Security Best Practices
- **Never hardcode sensitive data** (API keys, secrets, tokens)
- **Sanitize all user inputs** before rendering
- **Use environment variables** for configuration
- **Implement CSP headers** for production deployments
- **Follow OWASP guidelines** for web application security

### 4. Styling Guidelines
- Use Bootstrap utility classes when possible
- Custom CSS should be minimal and component-scoped
- Maintain responsive design (mobile-first approach)
- Use CSS variables for theme colors:
  ```css
  :root {
    --primary-color: #0066CC;
    --secondary-color: #FF6B6B;
    --text-color: #333333;
    --background-color: #F8F9FA;
  }
  ```

### 5. File Organization
```
src/
├── components/         # React components
│   ├── __tests__/     # Component tests
│   └── *.jsx          # Component files
├── assets/            # Images, fonts, static files
├── styles/            # Global styles
├── utils/             # Helper functions
└── test/              # Integration tests
```

## 🛡️ Security and Compliance

### OSDO Compliance Requirements
1. **All code must pass security linting** before merge
2. **Dependencies must be audited** for vulnerabilities
3. **No secrets in code** - use environment variables
4. **SBOM generation** required for releases
5. **Test coverage** must be above 70%

### Security Headers for Production
```javascript
// Always include these headers in production deployments
{
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline';"
}
```

## 🚀 Development Workflow

### 1. Before Starting Development
```bash
# Update dependencies
npm install

# Run security audit
npm run security:audit

# Run tests
npm test
```

### 2. During Development
- Use `npm run dev` for local development
- Run `npm run lint` before committing
- Test on multiple browsers and devices
- Check accessibility with screen readers

### 3. Before Committing
```bash
# Run all OSDO checks
npm run osdo:test
npm run osdo:sca
npm run osdo:sast

# Format and lint code
npm run lint

# Run tests with coverage
npm run test:coverage
```

## 📝 Commit Message Convention

Follow conventional commits format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions or corrections
- `chore`: Maintenance tasks
- `security`: Security improvements

Example:
```
feat(speakers): add new speaker component with animation

- Implemented responsive grid layout
- Added fade-in animations
- Integrated with speaker data API

Closes #123
```

## 🌐 Internationalization

Currently, the site is in Spanish. When adding content:
- Use proper Spanish grammar and spelling
- Maintain formal tone appropriate for a professional conference
- Consider cultural context for Spain/Latin America audiences

## 🎨 UI/UX Guidelines

### Animation Standards
- Use `AnimationWrapper` component for consistency
- Animations should be subtle (duration: 800-1500ms)
- Disable animations for `prefers-reduced-motion`

### Responsive Breakpoints
```scss
// Bootstrap 5 breakpoints
$mobile: 576px;     // sm
$tablet: 768px;     // md
$desktop: 992px;    // lg
$large: 1200px;     // xl
$xlarge: 1400px;    // xxl
```

### Image Optimization
- Use WebP format when possible
- Implement lazy loading for below-fold images
- Provide appropriate alt text for accessibility
- Optimize file sizes (max 200KB for heroes, 100KB for thumbnails)

## 🔧 Configuration Files

### Vite Configuration (`vite.config.js`)
**CRITICAL**: When modifying this file, preserve these exact configurations to avoid merge conflicts:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://xopsconference.com',
      dynamicRoutes: [/* DO NOT remove existing routes */],
      outDir: 'dist',
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          bootstrap: ['bootstrap', 'react-bootstrap'],
          // ADD new dependencies here, don't modify existing entries
        }
      }
    }
  },
  // DO NOT add optimizeDeps here unless absolutely necessary
  // Vite 6+ handles dependency optimization automatically
})
```

**Rules for Vite Config Modifications:**
1. **NEVER remove existing `manualChunks` entries** - only add new ones
2. **NEVER modify the `sitemap` plugin configuration** - only add routes to `dynamicRoutes` array
3. **If adding Dexie or IndexedDB dependencies**: Add to `manualChunks` as a separate chunk
4. **Before merging**: Check that no existing chunks were removed
5. **Dependency Resolution Issues**: Run `npm install` before debugging build errors

### ESLint Configuration
- Security rules enabled
- React best practices enforced
- Custom rules in `.eslintrc.security.json`
- **DO NOT modify** `eslint.config.js` without testing with `npm run lint`

### Testing Configuration
- Coverage threshold: 70%
- Integration tests in `src/test/`
- Unit tests alongside components
- **DO NOT modify** `vitest.config.js` thresholds without team approval

## 📦 Dependencies Management

### Adding New Dependencies
1. Justify the need for the dependency
2. Check license compatibility (MIT, Apache-2.0, BSD preferred)
3. Run security audit after installation
4. Update SBOM if adding to production

### Updating Dependencies
```bash
# Check outdated packages
npm outdated

# Update with caution
npm update <package-name>

# Always test after updates
npm test
```

## 🐛 Debugging Guidelines

### Common Issues & Solutions

#### 1. Build Failures

**Issue**: `Rollup failed to resolve import "dexie"`
```bash
# Solution: Install missing dependencies
npm install
npm run build
```

**Issue**: `Module not found` errors
```bash
# Solution: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Build succeeds but large bundle sizes
```bash
# Check: Ensure vite.config.js has proper code splitting
# Verify manualChunks includes: vendor, bootstrap, dexie
npm run build -- --mode=analyze  # If available
```

#### 2. Runtime Errors

**Issue**: `IndexedDB` or `Dexie` errors in production
- **Cause**: Browser doesn't support IndexedDB or storage quota exceeded
- **Solution**: Add error boundaries and fallback to JSON-only mode
- **Check**: `src/data/dal.js` has proper error handling

**Issue**: Service Worker not updating
```bash
# Solution: Hard refresh and clear cache
# Chrome: Ctrl+Shift+Del -> Clear cached images and files
# Or: Application -> Service Workers -> Unregister
```

**Issue**: PWA not installing
- **Check**: `manifest.json` is valid and served correctly
- **Check**: HTTPS is enabled (required for PWA)
- **Check**: Service worker is registered without errors

#### 3. Test Failures

**Issue**: `Cannot find module 'dexie'` in tests
```bash
# Solution: Add to vitest.config.js or test setup
# Mock Dexie if using fake-indexeddb
```

**Issue**: Tests fail with "localStorage is not defined"
- **Already handled** in `src/test/setup.js`
- If still failing, check test imports `setup.js`

**Issue**: Coverage drops below 70%
```bash
# Check which files reduced coverage
npm run test:coverage
# Review: .osdo/results/coverage/index.html
```

#### 4. Development Issues

**Issue**: Hot reload not working
```bash
# Solution: Check file watchers
npm run dev
# If persists: Restart Vite server
```

**Issue**: React Router 404s on Netlify
- **Solution**: Ensure `public/_redirects` exists with:
```
/*    /index.html   200
```

**Issue**: ESLint errors after merge
```bash
# Auto-fix what's possible
npm run lint -- --fix

# Check security rules specifically
npm run security:eslint
```

#### 5. Data Layer Issues

**Issue**: `DAL.getAgenda()` returns empty array
- **Check**: `schedule2025.json` exists and is valid JSON
- **Check**: IndexedDB initialized properly
- **Solution**: Clear IndexedDB in DevTools -> Application -> Storage

**Issue**: Speaker or talk not found by slug
- **Cause**: Slug generation may have changed
- **Solution**: Check `dal.js` `generateSlug()` function
- **Verify**: Slugs are URL-friendly (lowercase, no special chars)

### Performance Optimization

#### Bundle Size Optimization
- Use React.memo for expensive components (speaker cards, event listings)
- Implement code splitting for archive routes
- Lazy load images with `loading="lazy"` attribute
- Monitor bundle with: `npm run build` (check dist/ folder sizes)

#### Runtime Performance
- Use Dexie indexes for faster queries (`timeISO`, `track`, `room`)
- Implement virtual scrolling for long lists (100+ items)
- Optimize re-renders with `useMemo` and `useCallback`
- Monitor Core Web Vitals with Lighthouse

#### Offline Performance
- Ensure Service Worker caches critical assets
- IndexedDB provides offline data access
- Test offline mode: DevTools -> Network -> Offline

## 📚 Additional Resources

### Project Documentation
- OSDO Compliance: `.osdo/README.md`
- Testing Guide: `.osdo/CHECKLIST.md`
- Security Policies: `.github/SECURITY.md`

### External Resources
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Bootstrap Documentation](https://getbootstrap.com)
- [OWASP Security Guidelines](https://owasp.org)

## 🔀 Merge Conflict Resolution Guide

### Common Conflict Files and How to Resolve Them

#### 1. `vite.config.js` Conflicts
**Most Common Issue**: Conflicting `manualChunks` or `dynamicRoutes` additions

**Resolution Strategy:**
```javascript
// ACCEPT BOTH changes by merging them
manualChunks: {
  vendor: ['react', 'react-dom', 'react-router-dom'],
  bootstrap: ['bootstrap', 'react-bootstrap'],
  dexie: ['dexie'],  // From branch A
  animations: ['aos']  // From branch B
}
```

**Steps:**
1. Identify what each branch added (not modified)
2. Merge all additions into a single object/array
3. Keep alphabetical order when possible
4. Test build after resolution: `npm run build`

#### 2. `package.json` Conflicts
**Most Common Issue**: Conflicting dependency versions or scripts

**Resolution Strategy:**
- **Dependencies**: Use the HIGHER version number (unless breaking changes)
- **Scripts**: Keep both if they serve different purposes
- **After resolution**: ALWAYS run `npm install` and `npm audit`

**Example:**
```json
// If conflict between:
// Branch A: "dexie": "^4.0.0"
// Branch B: "dexie": "^4.2.1"
// Resolution: Use "^4.2.1" (latest compatible)
```

#### 3. Route Definitions (`App.jsx`, sitemap routes)
**Most Common Issue**: Duplicate route additions

**Resolution Strategy:**
1. Merge all unique routes
2. Remove duplicates (case-sensitive check)
3. Group routes logically (archive/2025, archive/2024, etc.)
4. Update sitemap in `vite.config.js` accordingly

#### 4. Data Files (`schedule2025.json`, speaker lists)
**Most Common Issue**: Conflicting event/speaker additions

**Resolution Strategy:**
- **NEVER accept one side completely** - this loses data
- Manually merge arrays of speakers/events
- Validate JSON syntax after merge
- Run validation: `npm run validate:data` (if available)

#### 5. Component Files Conflicts
**Most Common Issue**: Different feature additions to same component

**Resolution Strategy:**
1. Accept both code blocks
2. Ensure imports are merged (no duplicates)
3. Check PropTypes definitions are compatible
4. Test component after merge: `npm test ComponentName.test.jsx`

### Merge Conflict Prevention

**Before Creating a Branch:**
```bash
# Always start from updated develop
git checkout feature/copilot-integrations
git pull origin feature/copilot-integrations
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Keep branch updated during development
git fetch feature/copilot-integrations
git rebase origin/feature/copilot-integrations  # Or merge if preferred
```

**Branch Naming Convention:**
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code improvements
- `docs/description` - Documentation only
- `security/description` - Security updates

### Conflict Resolution Checklist

After resolving conflicts, ALWAYS:
- [ ] Run `npm install` (if `package.json` was modified)
- [ ] Run `npm run build` (verify build works)
- [ ] Run `npm run lint` (check for linting errors)
- [ ] Run `npm test` (ensure tests pass)
- [ ] Run `npm run osdo:test` (OSDO compliance)
- [ ] Check file is syntactically valid (JSON, JSX, etc.)
- [ ] Test feature in browser (`npm run dev`)

## 🤝 Collaboration Guidelines

### Code Reviews
- All PRs require security scan passing
- Test coverage must not decrease
- Follow established patterns and conventions
- Document any deviations with justification
- **Conflict-free PRs**: Resolve conflicts BEFORE requesting review

### Communication
- Use clear, descriptive variable names
- Comment complex logic
- Update documentation with changes
- Tag security-related changes appropriately
- **Merge conflicts**: Notify team in PR if complex conflicts occurred

### Branch Integration Strategy
1. **Small, Focused PRs**: Keep changes minimal to reduce conflicts
2. **Frequent Syncing**: Rebase/merge from develop daily
3. **Communicate Changes**: Notify team of major refactors to config files
4. **File Locks**: Coordinate on `vite.config.js`, `package.json` modifications

---

## 📌 Quick Reference

### Essential Commands
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm test                 # Run all tests
npm run test:coverage    # Run tests with coverage
npm run security:audit   # Run security audit
npm run osdo:test       # Run OSDO compliance tests
npm run lint            # Lint code
npm run preview         # Preview production build
```

### Environment Variables
```env
VITE_API_URL=           # API endpoint
VITE_GA_TRACKING_ID=    # Google Analytics ID
VITE_ENVIRONMENT=       # development|staging|production
```

### Git Workflow
```bash
git checkout -b feature/description
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin feature/description
# Create PR with description and tests
```

---

## 📌 Quick Reference

### Essential Commands
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm test                 # Run all tests
npm run test:coverage    # Run tests with coverage
npm run security:audit   # Run security audit
npm run osdo:test       # Run OSDO compliance tests
npm run lint            # Lint code
npm run preview         # Preview production build
```

### Environment Variables
```env
VITE_API_URL=           # API endpoint
VITE_GA_TRACKING_ID=    # Google Analytics ID
VITE_ENVIRONMENT=       # development|staging|production
VITE_DATA_SOURCE=       # json (default) | cms (future)
```

### Project-Specific Patterns

#### Adding New Conference Data
1. Update `src/data/schedule2025.json` with new talks/speakers
2. DAL will auto-sync to IndexedDB on next load
3. Test with: `DAL.getAgenda()` in browser console
4. Verify slugs are generated correctly

#### Adding New Archive Year
1. Create folder: `src/pages/archive/YYYY/`
2. Add components: `SpeakersYYYY.jsx`, `EventsYYYY.jsx`
3. Update routes in `src/App.jsx`
4. Add to sitemap in `vite.config.js`

#### Modifying Build Configuration
**⚠️ CRITICAL**: Always test build after config changes
```bash
npm run build
npm run preview  # Test production build locally
```

### Troubleshooting Quick Commands
```bash
# Full reset (nuclear option)
rm -rf node_modules package-lock.json dist .osdo/results
npm install
npm run build

# Clear test cache
npm test -- --clearCache

# Verify all checks pass
npm run lint && npm test && npm run build

# Check bundle sizes
ls -lh dist/assets/*.js
```

---

**Remember**: 
- Security and code quality are paramount
- Resolve merge conflicts carefully using the guide above
- Always run full test suite before merging
- Document complex changes in commit messages
- When in doubt, consult the OSDO compliance guidelines or ask for a security review

**For Copilot Users**:
- This file guides code generation and conflict resolution
- Follow patterns strictly to maintain consistency
- Update this file when new patterns emerge
- Report recurring conflicts for pattern improvement