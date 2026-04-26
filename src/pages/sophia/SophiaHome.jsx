import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './SophiaHome.css';

function SophiaHome() {
  const { t } = useTranslation();

  return (
    <div className="sophia-home">
      {/* Header */}
      <header className="sophia-header">
        <nav className="sophia-nav">
          <Link to="/sophia" className="sophia-brand">
            <span className="sophia-icon">◇</span>
            <span>Sophia Metapolis</span>
          </Link>
          <div className="sophia-nav-links">
            <Link to="/sophia">{t('sophia.nav.home')}</Link>
            <Link to="/sophia/about">{t('sophia.nav.about')}</Link>
            <Link to="/sophia/postulate">{t('sophia.nav.postulate')}</Link>
            <Link to="/wallet">{t('sophia.nav.wallet')}</Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="sophia-hero">
        <div className="sophia-hero-content">
          <h1 className="sophia-title">{t('sophia.home.title')}</h1>
          <p className="sophia-subtitle">{t('sophia.home.subtitle')}</p>
          <p className="sophia-description">{t('sophia.home.description')}</p>
          <div className="sophia-ctas">
            <Link to="/sophia/about" className="sophia-btn-primary">
              {t('sophia.home.cta')}
            </Link>
            <Link to="/sophia/postulate" className="sophia-btn-secondary">
              {t('sophia.home.postulate')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="sophia-features">
        <div className="sophia-feature">
          <span className="sophia-feature-icon">⚖️</span>
          <h3>{t('sophia.about.governance.title')}</h3>
          <p>{t('sophia.about.governance.description').substring(0, 80)}...</p>
        </div>
        <div className="sophia-feature">
          <span className="sophia-feature-icon">🏛️</span>
          <h3>{t('sophia.about.model.title')}</h3>
          <p>{t('sophia.about.model.description').substring(0, 80)}...</p>
        </div>
        <div className="sophia-feature">
          <span className="sophia-feature-icon">🎫</span>
          <h3>{t('sophia.about.citizenship.title')}</h3>
          <p>{t('sophia.about.citizenship.participation')}</p>
        </div>
      </section>

      {/* Events teaser */}
      <section className="sophia-events">
        <h2>{t('sophia.home.events')}</h2>
        <div className="sophia-event-card">
          <h3>X-Ops Conference Dubai 2026</h3>
          <p>Dubai, UAE · October 15-17, 2026</p>
          <Link to="/events/x-ops-conference-dubai-2026" className="sophia-btn-outline">
            {t('tickets.event.viewDetails')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="sophia-footer">
        <p className="sophia-footer-note">
          {t('sophia.footer.sophiaNote')} <Link to="/sophia">{t('sophia.footer.knowSophia')}</Link>
        </p>
        <div className="sophia-footer-links">
          <Link to="/sophia/about">{t('sophia.footer.legal')}</Link>
          <Link to="/sophia/about">{t('sophia.footer.privacy')}</Link>
          <Link to="/sophia/about">{t('sophia.footer.terms')}</Link>
        </div>
      </footer>
    </div>
  );
}

export default SophiaHome;