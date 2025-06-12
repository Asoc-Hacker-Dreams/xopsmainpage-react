import { usePWA } from '../hooks/usePWA';
import './PWAInstallBanner.css';

const PWAInstallBanner = () => {
  const { canPrompt, promptInstall } = usePWA();

  const handleInstall = async () => {
    const result = await promptInstall();
    console.log('PWA install result:', result);
  };

  const handleDismiss = () => {
    // Store dismissal in localStorage to prevent showing again
    localStorage.setItem('pwa-banner-dismissed', 'true');
    // Force re-render by setting a state that would cause component to hide
    window.location.reload();
  };

  // Don't show banner if user can't prompt, already dismissed, or already installed
  const bannerDismissed = localStorage.getItem('pwa-banner-dismissed') === 'true';
  const isInstalled = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  
  if (!canPrompt || bannerDismissed || isInstalled) {
    return null;
  }

  return (
    <div className="pwa-install-banner">
      <div className="pwa-banner-content">
        <div className="pwa-banner-text">
          <h4>📱 Instala X-OPS Conference</h4>
          <p>Obtén acceso rápido y disfruta de una mejor experiencia</p>
        </div>
        <div className="pwa-banner-actions">
          <button onClick={handleInstall} className="pwa-install-btn">
            Instalar
          </button>
          <button onClick={handleDismiss} className="pwa-dismiss-btn">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;