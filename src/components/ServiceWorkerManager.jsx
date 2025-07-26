import { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ServiceWorkerManager = () => {
  const [registration, setRegistration] = useState(null);
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      // Register service worker on window load
      const handleLoad = async () => {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js');
          setRegistration(reg);
          
          // Listen for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  setWaitingWorker(newWorker);
                  setShowUpdateToast(true);
                }
              });
            }
          });

          // Check if there's already a waiting worker
          if (reg.waiting) {
            setWaitingWorker(reg.waiting);
            setShowUpdateToast(true);
          }

        } catch (error) {
          console.error('Service worker registration failed:', error);
        }
      };

      // Register on window load
      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      // Send skip waiting message to the waiting worker
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      
      // Listen for the controlling change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Reload the page to get the new version
        window.location.reload();
      });
      
      setShowUpdateToast(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdateToast(false);
  };

  return (
    <ToastContainer position="bottom-end" className="p-3">
      <Toast
        show={showUpdateToast}
        onClose={handleDismiss}
        bg="primary"
        className="text-white"
      >
        <Toast.Header closeButton={false}>
          <strong className="me-auto">Nueva versión disponible</strong>
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Close"
            onClick={handleDismiss}
          />
        </Toast.Header>
        <Toast.Body>
          <div className="d-flex justify-content-between align-items-center">
            <span>Una nueva versión de la aplicación está disponible</span>
            <button
              className="btn btn-light btn-sm ms-2"
              onClick={handleUpdate}
            >
              Actualizar
            </button>
          </div>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ServiceWorkerManager;
