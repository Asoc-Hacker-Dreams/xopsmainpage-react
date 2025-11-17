# Custom Hooks Documentation

This directory contains custom React hooks used throughout the X-Ops Conference application.

## Available Hooks

### `usePWA` - PWA Installation Management

This hook provides Progressive Web App (PWA) installation prompt management.

## Usage

```javascript
import { usePWA } from './hooks/usePWA';

function MyComponent() {
  const { canPrompt, promptInstall } = usePWA();

  const handleInstall = async () => {
    const result = await promptInstall();
    console.log('Install result:', result); // 'accepted' or 'dismissed'
  };

  return (
    <div>
      {canPrompt && (
        <button onClick={handleInstall}>
          Install App
        </button>
      )}
    </div>
  );
}
```

## Features

- ✅ Captures `beforeinstallprompt` event
- ✅ Returns `canPrompt` boolean and `promptInstall` function
- ✅ Respects user choice (stores rejection in localStorage)
- ✅ Prevents re-prompting if user dismissed
- ✅ Includes custom banner component with styling
- ✅ Mobile responsive design

## Implementation Details

The hook automatically:
1. Listens for the `beforeinstallprompt` event
2. Stores the deferred prompt for later use
3. Checks localStorage for previous user rejections
4. Provides a clean API for triggering the install prompt
5. Handles user choice and stores rejection state

## Browser Compatibility

This feature works on Chromium-based browsers (Chrome, Edge, Opera) and supports the Web App Manifest standard.

---

## `useSponsorAnalytics` - GA4 Sponsor Event Tracking

This hook provides Google Analytics 4 (GA4) event tracking for sponsor-related interactions with Consent Mode v2 compliance.

### Usage

```javascript
import useSponsorAnalytics from './hooks/useSponsorAnalytics';

function SponsorPage({ sponsor }) {
  const {
    trackViewSponsor,
    trackCtaClick,
    trackAssetDownload,
    trackLeadSubmit,
    canTrack
  } = useSponsorAnalytics(sponsor);

  useEffect(() => {
    // Track page view when component mounts
    trackViewSponsor();
  }, [trackViewSponsor]);

  const handlePrimaryClick = () => {
    trackCtaClick('primary');
    // Handle CTA action
  };

  const handleDownload = () => {
    trackAssetDownload('pdf');
    // Handle download
  };

  const handleFormSubmit = () => {
    trackLeadSubmit();
    // Handle form submission
  };

  return (
    <div>
      <button onClick={handlePrimaryClick}>Contact</button>
      <button onClick={handleDownload}>Download Brochure</button>
      <form onSubmit={handleFormSubmit}>
        {/* Form fields */}
      </form>
    </div>
  );
}
```

### Features

- ✅ Respects Consent Mode v2 (only tracks with analytics consent)
- ✅ Four event types: `view_sponsor`, `cta_click`, `asset_download`, `lead_submit`
- ✅ Automatic parameter enrichment: `sponsor_id`, `sponsor_slug`, `sponsor_tier`
- ✅ Additional parameters: `cta_type`, `asset_type`
- ✅ Safe handling when gtag is not available
- ✅ Console warnings for debugging without consent
- ✅ Null-safe sponsor data handling

### Event Types

#### `trackViewSponsor()`
Tracks when a user views a sponsor's page or section.

**Parameters sent:**
- `sponsor_id`
- `sponsor_slug`
- `sponsor_tier`

#### `trackCtaClick(ctaType)`
Tracks call-to-action button clicks.

**Parameters sent:**
- `sponsor_id`
- `sponsor_slug`
- `sponsor_tier`
- `cta_type` (e.g., 'primary', 'secondary', 'website', 'booking')

#### `trackAssetDownload(assetType)`
Tracks asset download events.

**Parameters sent:**
- `sponsor_id`
- `sponsor_slug`
- `sponsor_tier`
- `asset_type` (e.g., 'pdf', 'whitepaper', 'brochure', 'dossier')

#### `trackLeadSubmit()`
Tracks lead form submission events.

**Parameters sent:**
- `sponsor_id`
- `sponsor_slug`
- `sponsor_tier`

### Consent Mode v2 Compliance

The hook automatically checks for analytics consent before firing any events. If consent is not given:
- Events are not sent to GA4
- Console logs indicate the event was blocked
- No data is transmitted

### Implementation Details

The hook:
1. Uses the `ConsentContext` to check for analytics consent
2. Only sends events if `CONSENT_CATEGORIES.ANALYTICS` consent is granted
3. Validates sponsor data before sending events
4. Uses `window.gtag()` to send events to Google Analytics 4
5. Provides helpful console messages for debugging

### Acceptance Criteria

✅ **AC1:** When cookies are accepted and navigating microsite, `view_sponsor` fires with `sponsor_id`
✅ **AC2:** When no consent and clicking CTA, no event is fired