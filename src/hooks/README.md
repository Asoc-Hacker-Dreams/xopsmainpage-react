# PWA Hook Implementation

This implementation provides a React hook for managing Progressive Web App (PWA) installation prompts.

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