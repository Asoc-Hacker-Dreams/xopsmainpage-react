import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useConsent } from '../contexts/ConsentContext';
import CookiePreferencesDialog from './CookiePreferencesDialog';
import './CookieConsentBanner.css';

const copy = {
  es: {
    title: 'Privacidad y cookies',
    text: 'Usamos almacenamiento necesario para que esta web funcione. La analítica opcional mide visitas, campañas, pasos del checkout y compras confirmadas. Permanece desactivada hasta que la autorices; no enviamos nombre ni correo a GA4. No utilizamos etiquetas publicitarias.',
    detail: 'Rechazar no impide consultar el programa ni comprar entradas.',
    accept: 'Aceptar todo', reject: 'Rechazar todo', custom: 'Personalizar', link: 'Política de cookies',
  },
  en: {
    title: 'Privacy and cookies',
    text: 'We use essential storage to run the website. Optional analytics measures visits, campaign sources, checkout steps and verified purchases. It stays off until you opt in; we do not send names or email addresses to GA4. No advertising tags are used.',
    detail: 'Rejecting optional cookies does not prevent viewing the programme or buying tickets.',
    accept: 'Accept all', reject: 'Reject all', custom: 'Customise', link: 'Cookie policy',
  },
};

export default function CookieConsentBanner() {
  const { i18n } = useTranslation();
  const { showBanner, acceptAll, rejectAll } = useConsent();
  const [showPreferences, setShowPreferences] = useState(false);
  if (!showBanner) return null;
  const lang = (i18n.resolvedLanguage || i18n.language || 'es').startsWith('en') ? 'en' : 'es';
  const t = copy[lang];

  return (
    <>
      <section className="cookie-consent-banner" role="region" aria-label={t.title}>
        <Container>
          <div className="xops-cmp-banner-layout">
            <div className="cookie-content">
              <h2 className="cookie-title">{t.title}</h2>
              <p className="cookie-text">{t.text}</p>
              <p className="cookie-text-small">{t.detail}{' '}<a href="/politica-de-cookies" className="cookie-link" target="_blank" rel="noopener noreferrer">{t.link}</a>.</p>
            </div>
            <div className="cookie-buttons">
              <Button variant="primary" className="xops-cmp-equal" type="button" onClick={rejectAll}>{t.reject}</Button>
              <Button variant="primary" className="xops-cmp-equal" type="button" onClick={acceptAll}>{t.accept}</Button>
              <Button variant="outline-light" type="button" onClick={() => setShowPreferences(true)}>{t.custom}</Button>
            </div>
          </div>
        </Container>
      </section>
      <CookiePreferencesDialog show={showPreferences} onHide={() => setShowPreferences(false)} language={lang} />
    </>
  );
}
