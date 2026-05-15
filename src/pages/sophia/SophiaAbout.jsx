import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './SophiaAbout.css';

function SophiaAbout() {
  const { t } = useTranslation();

  return (
    <div className="sophia-about">
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

      <div className="sophia-about-content">
        <h1>{t('sophia.about.title')}</h1>

        {/* Governance */}
        <section className="sophia-section">
          <div className="sophia-section-icon">⚖️</div>
          <h2>{t('sophia.about.governance.title')}</h2>
          <p>{t('sophia.about.governance.description')}</p>
          <div className="sophia-archetypes">
            <div className="sophia-archetype">
              <span className="sophia-archetype-icon">👁️</span>
              <h3>Horus</h3>
              <p>Protección y seguridad. Gestiona la integridad del espacio digital.</p>
            </div>
            <div className="sophia-archetype">
              <span className="sophia-archetype-icon">🔥</span>
              <h3>Sulis</h3>
              <p>Bienestar y social. Cuidante del tejido comunitario.</p>
            </div>
            <div className="sophia-archetype">
              <span className="sophia-archetype-icon">📚</span>
              <h3>Minerva</h3>
              <p>Conocimiento y sabiduría. Guardiana del saber colectivo.</p>
            </div>
          </div>
        </section>

        {/* Federal Model */}
        <section className="sophia-section">
          <div className="sophia-section-icon">🏛️</div>
          <h2>{t('sophia.about.model.title')}</h2>
          <p>{t('sophia.about.model.description')}</p>
          <div className="sophia-community-types">
            <div className="sophia-community-type">
              <h3>Círculos</h3>
              <p>Comunidades profesionales. Especialistas en un dominio compartiendo conocimiento.</p>
            </div>
            <div className="sophia-community-type">
              <h3>Cofradías</h3>
              <p>Comunidades temáticas. Personas unidas por pasiones y proyectos comunes.</p>
            </div>
            <div className="sophia-community-type">
              <h3>Capítulos</h3>
              <p>Comunidades geográficas. Personas de una región organizándose localmente.</p>
            </div>
          </div>
        </section>

        {/* Citizenship */}
        <section className="sophia-section">
          <div className="sophia-section-icon">🎫</div>
          <h2>{t('sophia.about.citizenship.title')}</h2>
          <div className="sophia-citizenship-flow">
            <div className="sophia-citizenship-step">
              <span className="step-num">1</span>
              <h3>{t('sophia.about.citizenship.entry')}</h3>
              <p>Postulación con declaración personal. El cuerpo de gobernanza revisa y decide.</p>
            </div>
            <div className="sophia-citizenship-step">
              <span className="step-num">2</span>
              <h3>Participación activa</h3>
              <p>{t('sophia.about.citizenship.participation')}</p>
            </div>
            <div className="sophia-citizenship-step">
              <span className="step-num">3</span>
              <h3>Proceso justo</h3>
              <p>{t('sophia.about.citizenship.exit')}</p>
            </div>
          </div>
        </section>

        <div className="sophia-about-cta">
          <Link to="/sophia/postulate" className="sophia-btn-primary">Iniciar postulación</Link>
          <Link to="/sophia" className="sophia-btn-secondary">Volver a home</Link>
        </div>
      </div>

      <footer className="sophia-footer">
        <p className="sophia-footer-note">
          {t('sophia.footer.sophiaNote')} <Link to="/sophia">{t('sophia.footer.knowSophia')}</Link>
        </p>
      </footer>
    </div>
  );
}

export default SophiaAbout;