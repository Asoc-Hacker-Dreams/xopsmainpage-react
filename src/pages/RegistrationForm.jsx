import React, { useRef, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { triskelGateClient } from '../adapters/triskelgate/client';

/**
 * Formulario de solicitud de entrada — X-Ops Dubai 2026.
 *
 * Sustituye a la venta pública: no hay checkout abierto, el interesado
 * solicita, el equipo revisa y le envía un enlace de pago individual.
 *
 * Lo que se pide:
 *  - datos de identidad (obligatorios para el permiso y la acreditación)
 *  - datos de empresa (obligatorios para el registro en la puerta)
 *  - consentimiento de comunicaciones promocionales (OPCIONAL, desmarcado)
 *  - consentimiento de la política de privacidad (OBLIGATORIO)
 *
 * El envio lo hace la Vercel Function /api/registro, que entrega a
 * info@xopsconference.com. El formulario NUNCA guarda ni expone el
 * consentimiento: se registra junto a la solicitud.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegistrationForm() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    country: '',
    linkedin: '',
    motivation: '',
    marketingConsent: false,
    privacyConsent: false,
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  // Un id por intento de envio: si la persona pulsa dos veces o el navegador
  // reintenta, el backend lo trata como la misma solicitud (ON CONFLICT).
  const requestKeyRef = useRef(
    `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
  );

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = t('registration.errors.fullName');
    if (!EMAIL_RE.test(form.email.trim())) e.email = t('registration.errors.email');
    if (!form.company.trim()) e.company = t('registration.errors.company');
    if (!form.country.trim()) e.country = t('registration.errors.country');
    if (!form.privacyConsent) e.privacyConsent = t('registration.errors.privacy');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus({ state: 'sending', message: '' });
    try {
      const res = await triskelGateClient.createRegistration({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone || null,
        company: form.company,
        role: form.role || null,
        country: form.country,
        linkedin: form.linkedin || null,
        motivation: form.motivation || null,
        privacyConsent: form.privacyConsent === true,
        marketingConsent: form.marketingConsent === true,
        event: 'dubai-2026',
        source: 'web-registration-form',
        requestKey: requestKeyRef.current,
      });
      // El cliente devuelve el objeto ya parseado (no un Response).
      if (!res || res.success === false) {
        setStatus({
          state: 'error',
          message: (res && res.message) || t('registration.errors.submit'),
        });
        return;
      }
      setStatus({ state: 'ok', message: (res && res.message) || t('registration.success.body') });
      setForm({
        fullName: '', email: '', phone: '', company: '', role: '',
        country: '', linkedin: '', motivation: '',
        marketingConsent: false, privacyConsent: false,
      });
    } catch (err) {
      setStatus({ state: 'error', message: t('registration.errors.submit') });
    }
  };

  if (status.state === 'ok') {
    return (
      <Container className="py-5" style={{ maxWidth: 720 }}>
        <SEO title={t('registration.title')} description={t('registration.seoDesc')} />
        <Alert variant="success">
          <h1 className="h4 mb-3">{t('registration.success.title')}</h1>
          <p className="mb-0">{status.message}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: 760 }}>
      <SEO title={t('registration.title')} description={t('registration.seoDesc')} />

      <h1 className="h3 mb-2">{t('registration.title')}</h1>
      <p className="text-secondary mb-1">{t('registration.intro')}</p>
      <p className="text-secondary small mb-4">{t('registration.introNote')}</p>

      {status.state === 'error' && (
        <Alert variant="danger">{status.message}</Alert>
      )}

      <Form onSubmit={onSubmit} noValidate>
        <fieldset className="mb-4">
          <legend className="h6 mb-3">{t('registration.section.who')}</legend>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="reg-fullName">{t('registration.fields.fullName')} *</Form.Label>
            <Form.Control
              id="reg-fullName" name="fullName" value={form.fullName} onChange={set('fullName')}
              isInvalid={!!errors.fullName} required
            />
            <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={7}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="reg-email">{t('registration.fields.email')} *</Form.Label>
                <Form.Control
                  id="reg-email" type="email" name="email" value={form.email} onChange={set('email')}
                  isInvalid={!!errors.email} required
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="reg-phone">{t('registration.fields.phone')}</Form.Label>
                <Form.Control
                  id="reg-phone" type="tel" name="phone" value={form.phone} onChange={set('phone')}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={7}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="reg-company">{t('registration.fields.company')} *</Form.Label>
                <Form.Control
                  id="reg-company" name="company" value={form.company} onChange={set('company')}
                  isInvalid={!!errors.company} required
                />
                <Form.Control.Feedback type="invalid">{errors.company}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="reg-role">{t('registration.fields.role')}</Form.Label>
                <Form.Control id="reg-role" name="role" value={form.role} onChange={set('role')} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="reg-country">{t('registration.fields.country')} *</Form.Label>
                <Form.Control
                  id="reg-country" name="country" value={form.country} onChange={set('country')}
                  isInvalid={!!errors.country} required
                />
                <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="reg-linkedin">{t('registration.fields.linkedin')}</Form.Label>
                <Form.Control
                  id="reg-linkedin" name="linkedin" value={form.linkedin} onChange={set('linkedin')}
                  placeholder="linkedin.com/in/..."
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="reg-motivation">{t('registration.fields.motivation')}</Form.Label>
            <Form.Control
              id="reg-motivation" as="textarea" rows={3} name="motivation" value={form.motivation}
              onChange={set('motivation')}
            />
            <Form.Text>{t('registration.fields.motivationHint')}</Form.Text>
          </Form.Group>
        </fieldset>

        <fieldset className="mb-4">
          <legend className="h6 mb-3">{t('registration.section.consent')}</legend>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox" id="reg-marketing" name="marketingConsent"
              checked={form.marketingConsent} onChange={set('marketingConsent')}
              label={t('registration.fields.marketing')}
            />
            <Form.Text>{t('registration.fields.marketingHint')}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Check
              type="checkbox" id="reg-privacy" name="privacyConsent"
              checked={form.privacyConsent} onChange={set('privacyConsent')}
              isInvalid={!!errors.privacyConsent}
              label={<span>{t('registration.fields.privacy')} *</span>}
            />
            {errors.privacyConsent && (
              <div className="invalid-feedback d-block">{errors.privacyConsent}</div>
            )}
            <Form.Text>
              {t('registration.fields.privacyHint')}{' '}
              <a href="/privacy-policy" target="_blank" rel="noreferrer">
                {t('registration.fields.privacyLink')}
              </a>
            </Form.Text>
          </Form.Group>
        </fieldset>

        <Button type="submit" disabled={status.state === 'sending'}>
          {status.state === 'sending'
            ? t('registration.submitting')
            : t('registration.submit')}
        </Button>
      </Form>
    </Container>
  );
}
