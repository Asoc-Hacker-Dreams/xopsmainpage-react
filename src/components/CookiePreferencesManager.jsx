import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useConsent, CONSENT_CATEGORIES } from '../contexts/ConsentContext';

const CookiePreferencesManager = ({ show, onHide }) => {
  const { consent, savePreferences, acceptAll, rejectAll } = useConsent();
  const [preferences, setPreferences] = useState(consent);

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
    onHide();
  };

  const handleAcceptAll = () => {
    acceptAll();
    onHide();
  };

  const handleRejectAll = () => {
    rejectAll();
    onHide();
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
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg"
      centered
      className="cookie-preferences-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>🍪 Gestión de Cookies</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="cookie-preferences-content">
          <p className="mb-4">
            Gestiona tus preferencias de cookies. Puedes cambiar estas configuraciones en cualquier momento.
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
                  id={`manage-cookie-${category}`}
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
              <strong>Vigencia:</strong> Tu elección se guardará durante 12 meses.
            </p>
            <p className="mb-1">
              <strong>Eliminación:</strong> Puedes borrar las cookies desde la configuración de tu navegador.
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
        <Button variant="outline-secondary" onClick={handleRejectAll}>
          Rechazar Todo
        </Button>
        <Button variant="success" onClick={handleAcceptAll}>
          Aceptar Todo
        </Button>
        <Button variant="primary" onClick={handleSavePreferences}>
          Guardar Preferencias
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CookiePreferencesManager;