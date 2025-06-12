import { useState, useEffect } from 'react';

// Custom event type for beforeinstallprompt
// This event is not standard but is supported by Chromium-based browsers
export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [userRejected, setUserRejected] = useState(false);

  useEffect(() => {
    // Check if user previously rejected the prompt
    const rejected = localStorage.getItem('pwa-install-rejected');
    if (rejected === 'true') {
      setUserRejected(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Only store the prompt if user hasn't rejected before
      if (!userRejected && rejected !== 'true') {
        setDeferredPrompt(e);
      }
    };

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Cleanup event listener
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [userRejected]);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      return null;
    }

    try {
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user's response
      const choice = await deferredPrompt.userChoice;
      
      // Handle user's choice
      if (choice.outcome === 'dismissed') {
        // User rejected the prompt, remember this choice
        localStorage.setItem('pwa-install-rejected', 'true');
        setUserRejected(true);
      }
      
      // Clear the deferred prompt
      setDeferredPrompt(null);
      
      return choice.outcome;
    } catch (error) {
      console.error('Error showing install prompt:', error);
      setDeferredPrompt(null);
      return null;
    }
  };

  return {
    canPrompt: !!deferredPrompt && !userRejected,
    promptInstall
  };
}