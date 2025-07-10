# GitHub Copilot Instructions for X-Ops Conference Project

## 🎯 Project Overview

This is the main website for X-Ops Conference, built with React, Vite, and Bootstrap. The project follows OSDO (Open SecDevOps) compliance standards and implements comprehensive security practices.

### Tech Stack
- **Frontend**: React 18.3.1, React Router DOM 6.27.0
- **Build Tool**: Vite 5.4.9
- **Styling**: Bootstrap 5.3.3, React Bootstrap 2.10.5
- **Testing**: Vitest, React Testing Library
- **Security**: ESLint Security Plugin, Snyk, GitLeaks, Semgrep
- **CI/CD**: GitHub Actions with OSDO compliance pipeline
- **Deployment**: Netlify (primary), AWS Amplify (secondary)

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

### Vite Configuration
- Base path configured for deployment
- Rollup optimizations for production builds
- Manual chunks for vendor splitting

### ESLint Configuration
- Security rules enabled
- React best practices enforced
- Custom rules in `.eslintrc.security.json`

### Testing Configuration
- Coverage threshold: 70%
- Integration tests in `src/test/`
- Unit tests alongside components

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

### Common Issues
1. **React Router 404s on Netlify**: Ensure `_redirects` file exists
2. **Build failures**: Check Node version (v20 required)
3. **Test failures**: Clear cache with `npm run test -- --clearCache`
4. **ESLint errors**: Run `npm run lint -- --fix` for auto-fixes

### Performance Optimization
- Use React.memo for expensive components
- Implement code splitting for routes
- Optimize bundle size with tree shaking
- Monitor Core Web Vitals

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

## 🤝 Collaboration Guidelines

### Code Reviews
- All PRs require security scan passing
- Test coverage must not decrease
- Follow established patterns and conventions
- Document any deviations with justification

### Communication
- Use clear, descriptive variable names
- Comment complex logic
- Update documentation with changes
- Tag security-related changes appropriately

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

**Remember**: Security and code quality are paramount. When in doubt, consult the OSDO compliance guidelines or ask for a security review.