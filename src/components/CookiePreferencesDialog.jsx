import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useConsent, CONSENT_CATEGORIES } from '../contexts/ConsentContext';

const translations = {
  es: {
    title: 'Preferencias de privacidad', intro: 'Puedes activar o desactivar cada finalidad opcional. Las cookies esenciales siempre permanecen activas.',
    essential: 'Necesarias', essentialsText: 'Guardan tu elección de privacidad y permiten prestar funciones técnicas solicitadas.',
    analytics: 'Analítica', analyticsText: 'Google Analytics: medición de visitas e interacciones solo tras autorización.',
    accept: 'Aceptar todo', reject: 'Rechazar todo', save: 'Guardar selección', more: 'Consultar política de cookies',
  },
  en: {
    title: 'Privacy preferences', intro: 'Enable or disable each optional purpose. Essential storage is always active.',
    essential: 'Essential', essentialsText: 'Remembers your privacy choice and supports technically necessary requested features.',
    analytics: 'Analytics', analyticsText: 'Google Analytics: measuring visits and interactions only after opt-in.',
    accept: 'Accept all', reject: 'Reject all', save: 'Save selection', more: 'Read cookie policy',
  },
};
const categories = [
  { id: CONSENT_CATEGORIES.ESSENTIAL, key: 'essential', label: 'essentialsText' },
  { id: CONSENT_CATEGORIES.ANALYTICS, key: 'analytics', label: 'analyticsText' },
];

export default function CookiePreferencesDialog({ show, onHide, language = 'es' }) {
  const { consent, acceptAll, rejectAll, savePreferences } = useConsent();
  const [draft, setDraft] = useState({ ...consent });
  const copy = translations[language.startsWith('en') ? 'en' : 'es'];
  useEffect(() => { if (show) setDraft({ ...consent }); }, [show, consent]);

  const apply = (callback) => { callback(); onHide(); };
  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="cookie-preferences-modal" aria-labelledby="xops-preferences-title">
      <Modal.Header closeButton>
        <Modal.Title id="xops-preferences-title">{copy.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="cookie-preferences-content">
          <p>{copy.intro}</p>
          {categories.map((category) => (
            <div className="cookie-category" key={category.id}>
              <div className="d-flex justify-content-between align-items-center gap-3">
                <div>
                  <h3 className="cookie-category-title">{copy[category.key]}</h3>
                  <p className="cookie-category-description" id={'xops-desc-' + category.id}>{copy[category.label]}</p>
                </div>
                <Form.Check type="switch" className="cookie-switch" id={'xops-pref-' + category.id}
                  aria-label={copy[category.key]} aria-describedby={'xops-desc-' + category.id}
                  checked={category.id === 'essential' ? true : draft[category.id] === true}
                  disabled={category.id === 'essential'}
                  onChange={(event) => setDraft((current) => ({ ...current, [category.id]: event.target.checked }))} />
              </div>
            </div>
          ))}
          <a href="/politica-de-cookies" target="_blank" rel="noopener noreferrer">{copy.more}</a>
        </div>
      </Modal.Body>
      <Modal.Footer className="xops-cmp-actions">
        <Button type="button" variant="primary" className="xops-cmp-equal" onClick={() => apply(rejectAll)}>{copy.reject}</Button>
        <Button type="button" variant="primary" className="xops-cmp-equal" onClick={() => apply(acceptAll)}>{copy.accept}</Button>
        <Button type="button" variant="outline-primary" onClick={() => apply(() => savePreferences(draft))}>{copy.save}</Button>
      </Modal.Footer>
    </Modal>
  );
}
