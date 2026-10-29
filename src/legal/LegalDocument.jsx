import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { LEGAL_VERSION, ORGANIZER } from './identity';
import './legal.css';

const destinations = [
  { path: '/aviso-legal', es: 'Aviso legal', en: 'Legal notice' },
  { path: '/politica-de-privacidad/madrid', es: 'Privacidad UE', en: 'EU privacy' },
  { path: '/politica-de-privacidad/dubai', es: 'Privacidad EAU', en: 'UAE privacy' },
  { path: '/politica-de-cookies', es: 'Cookies', en: 'Cookies' },
  { path: '/terminos-de-servicio/madrid', es: 'Condiciones Madrid', en: 'Madrid terms' },
  { path: '/terminos-de-servicio/dubai', es: 'Condiciones Dubái', en: 'Dubai terms' },
  { path: '/privacidad-patrocinadores', es: 'Patrocinio y networking', en: 'Sponsorship and networking' },
  { path: '/fotografia-y-video', es: 'Fotografía y vídeo', en: 'Photography and video' },
];

export function getLegalLang(i18n) {
  return (i18n.resolvedLanguage || i18n.language || 'es').startsWith('en') ? 'en' : 'es';
}

export default function LegalDocument({ document, documentType = 'policy' }) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const lang = getLegalLang(i18n);
  const copy = document[lang] || document.es || document.en;
  const subtitle = copy.subtitle || '';
  return (
    <main className="xops-legal" id="main-content">
      <SEO
        title={copy.title}
        description={subtitle}
        path={location.pathname}
        baseUrl={typeof window !== 'undefined' ? window.location.origin : 'https://xopsconference.com'}
        lang={lang}
      />
      <div className="container">
        <div className="xops-legal__layout">
          <article className="xops-legal__document" aria-labelledby="legal-title">
            <p className="xops-legal__eyebrow">{documentType === 'terms' ? (lang === 'es' ? 'Condiciones contractuales' : 'Contractual terms') : (lang === 'es' ? 'Información y transparencia' : 'Information and transparency')}</p>
            <h1 id="legal-title">{copy.title}</h1>
            <p className="xops-legal__lead">{subtitle}</p>
            <div className="xops-legal__metadata">
              <span>{lang === 'es' ? 'Versión' : 'Version'}: {LEGAL_VERSION}</span>
              <span>{ORGANIZER.name} · {ORGANIZER.taxId}</span>
            </div>
            <nav aria-label={lang === 'es' ? 'Índice de esta política' : 'Document contents'} className="xops-legal__toc">
              <strong>{lang === 'es' ? 'En esta página' : 'On this page'}</strong>
              <ol>
                {copy.sections.map((section, index) => (
                  <li key={index}><a href={'#legal-section-' + index}>{section.title.replace(/^\d+\.\s*/, '')}</a></li>
                ))}
              </ol>
            </nav>
            {copy.sections.map((section, index) => (
              <section key={index} id={'legal-section-' + index} className="xops-legal__section" aria-labelledby={'legal-heading-' + index}>
                <h2 id={'legal-heading-' + index}>{section.title}</h2>
                {(section.paragraphs || []).map((paragraph, idx) => <p key={idx}>{paragraph}</p>)}
                {section.bullets?.length > 0 && (
                  <ul>{section.bullets.map((bullet, idx) => <li key={idx}>{bullet}</li>)}</ul>
                )}
              </section>
            ))}
            <div className="xops-legal__contact">
              <h2>{lang === 'es' ? '¿Necesitas aclaraciones o ejercer tus derechos?' : 'Questions or rights requests?'}</h2>
              <p>{lang === 'es' ? 'Escríbenos e indica la edición del evento y el motivo de tu consulta.' : 'Contact us and indicate the event edition and the subject of your enquiry.'}</p>
              <a href={'mailto:' + ORGANIZER.privacyEmail}>{ORGANIZER.privacyEmail}</a>
            </div>
          </article>
          <aside className="xops-legal__aside" aria-label={lang === 'es' ? 'Otras políticas' : 'Other legal documents'}>
            <h2>{lang === 'es' ? 'Información legal' : 'Legal information'}</h2>
            <ul>
              {destinations.map((dest) => (
                <li key={dest.path}>
                  <Link to={dest.path} aria-current={location.pathname === dest.path ? 'page' : undefined}>{dest[lang]}</Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
