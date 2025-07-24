import { useState, useEffect } from 'react';

const AddToHomeScreen = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the install prompt
      setShowInstallPrompt(true);
      
      // Auto-hide after 10 seconds if not interacted with
      setTimeout(() => {
        setShowInstallPrompt(false);
      }, 10000);
    };

    const handleAppInstalled = () => {
      console.log('X-Ops Conference app was installed');
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
    // Hide for this session
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  // Don't show if already dismissed in this session
  const wasDismissed = sessionStorage.getItem('installPromptDismissed');
  
  if (!showInstallPrompt || wasDismissed) {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#000',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        maxWidth: '350px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        fontFamily: 'inherit'
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          Instalar X-Ops Conference
        </div>
        <div style={{ fontSize: '14px', opacity: 0.9 }}>
          Instala la app para acceso rápido y offline a la agenda, speakers y más.
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleInstallClick}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '5px',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Instalar
        </button>
        <button
          onClick={handleDismiss}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '8px 12px',
            borderRadius: '5px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AddToHomeScreen;