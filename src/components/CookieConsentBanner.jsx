import React, { useState } from 'react';
import { Modal, Button, Container, Row, Col, Form } from 'react-bootstrap';
import { useConsent, CONSENT_CATEGORIES } from '../contexts/ConsentContext';
import './CookieConsentBanner.css';

const CookieConsentBanner = () => {
  const { showBanner, acceptAll, rejectAll, savePreferences } = useConsent();
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    [CONSENT_CATEGORIES.ESSENTIAL]: true,
    [CONSENT_CATEGORIES.ANALYTICS]: false,
    [CONSENT_CATEGORIES.MARKETING]: false
  });

  if (!showBanner) {
    return null;
  }

  const handleCustomizeClick = () => {
    setShowPreferences(true);
  };

  const handleClosePreferences = () => {
    setShowPreferences(false);
  };

  const handlePreferenceChange = (category, enabled) => {
    if (category === CONSENT_CATEGORIES.ESSENTIAL) {
      return; // Essential cookies cannot be disabled
    }
    setPreferences(prev => ({
      ...prev,
      [category]: enabled
    }));
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
    setShowPreferences(false);
  };

  const getCategoryDescription = (category) => {
    switch (category) {
      case CONSENT_CATEGORIES.ESSENTIAL:
        return 'Necesarias para el funcionamiento básico del sitio web (navegación, autenticación, etc.). No se pueden desactivar.';
      case CONSENT_CATEGORIES.ANALYTICS:
        return 'Nos ayudan a entender cómo los visitantes interactúan con el sitio web, recopilando información de forma anónima (Google Analytics).';
      case CONSENT_CATEGORIES.MARKETING:
        return 'Se utilizan para mostrar anuncios relevantes y medir la efectividad de las campañas publicitarias.';
      default:
        return '';
    }
  };

  const getCategoryTitle = (category) => {
    switch (category) {
      case CONSENT_CATEGORIES.ESSENTIAL:
        return 'Cookies Esenciales';
      case CONSENT_CATEGORIES.ANALYTICS:
        return 'Cookies Analíticas';
      case CONSENT_CATEGORIES.MARKETING:
        return 'Cookies de Marketing';
      default:
        return category;
    }
  };

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="cookie-consent-banner">
        <Container>
          <Row className="align-items-center">
            <Col lg={8} md={7} sm={12}>
              <div className="cookie-content">
                <h5 className="cookie-title">🍪 Gestión de Cookies</h5>
                <p className="cookie-text">
                  Utilizamos cookies para mejorar tu experiencia de navegación, analizar el tráfico del sitio y personalizar el contenido. 
                  Puedes aceptar todas las cookies, rechazar las no esenciales o personalizar tus preferencias.
                </p>
                <p className="cookie-text-small">
                  Al continuar navegando, aceptas nuestra{' '}
                  <a href="/politica-cookies" className="cookie-link" target="_blank" rel="noopener noreferrer">
                    Política de Cookies
                  </a>.
                </p>
              </div>
            </Col>
            <Col lg={4} md={5} sm={12}>
              <div className="cookie-buttons">
                <Button 
                  variant="success" 
                  size="sm" 
                  onClick={acceptAll}
                  className="me-2 mb-2"
                >
                  Aceptar Todo
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  onClick={rejectAll}
                  className="me-2 mb-2"
                >
                  Rechazar Todo
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={handleCustomizeClick}
                  className="mb-2"
                >
                  Personalizar
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Preferences Modal */}
      <Modal 
        show={showPreferences} 
        onHide={handleClosePreferences} 
        size="lg"
        centered
        className="cookie-preferences-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>🍪 Preferencias de Cookies</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="cookie-preferences-content">
            <p className="mb-4">
              Personaliza qué tipos de cookies quieres permitir. Tu elección se guardará durante 12 meses.
            </p>
            
            {Object.values(CONSENT_CATEGORIES).map(category => (
              <div key={category} className="cookie-category mb-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="flex-grow-1">
                    <h6 className="cookie-category-title">
                      {getCategoryTitle(category)}
                    </h6>
                    <p className="cookie-category-description text-muted">
                      {getCategoryDescription(category)}
                    </p>
                  </div>
                  <Form.Check
                    type="switch"
                    id={`cookie-${category}`}
                    checked={preferences[category]}
                    disabled={category === CONSENT_CATEGORIES.ESSENTIAL}
                    onChange={(e) => handlePreferenceChange(category, e.target.checked)}
                    className="cookie-switch"
                  />
                </div>
                {category === CONSENT_CATEGORIES.ESSENTIAL && (
                  <small className="text-info">
                    <i className="bi bi-info-circle me-1"></i>
                    Las cookies esenciales no se pueden desactivar.
                  </small>
                )}
              </div>
            ))}
            
            <div className="cookie-info-box p-3 bg-light rounded">
              <h6>💡 Información Adicional</h6>
              <p className="mb-1">
                <strong>¿Qué son las cookies?</strong> Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo.
              </p>
              <p className="mb-1">
                <strong>Gestión:</strong> Puedes cambiar estas preferencias en cualquier momento desde el enlace en el pie de página.
              </p>
              <p className="mb-0">
                <strong>Más información:</strong>{' '}
                <a href="/politica-cookies" target="_blank" rel="noopener noreferrer">
                  Consulta nuestra Política de Cookies completa
                </a>
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={rejectAll}>
            Rechazar Todo
          </Button>
          <Button variant="success" onClick={acceptAll}>
            Aceptar Todo
          </Button>
          <Button variant="primary" onClick={handleSavePreferences}>
            Guardar Preferencias
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CookieConsentBanner;