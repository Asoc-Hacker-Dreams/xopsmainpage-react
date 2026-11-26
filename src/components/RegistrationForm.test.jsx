import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import RegistrationForm from '../pages/RegistrationForm';

vi.mock('../components/SEO', () => ({ default: () => null }));

// El componente usa useTranslation de react-i18next. Se mockea con un
// traductor mínimo que devuelve la clave, para que los tests no dependan de
// los ficheros de locales.
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// El alta va por el CLIENTE de TriskelGate, no por un fetch suelto: un
// `fetch('/api/registro')` en el navegador se resuelve contra el dominio de
// la web (donde no hay backend) y devuelve 405 Method Not Allowed. Eso fallo
// en produccion el 26-nov-2026.
const createRegistration = vi.fn();
vi.mock('../adapters/triskelgate/client', () => ({
  triskelGateClient: {
    createRegistration: (...args) => createRegistration(...args),
  },
}));

describe('RegistrationForm — formulario de solicitud de entrada', () => {
  beforeEach(() => {
    createRegistration.mockReset();
    createRegistration.mockResolvedValue({ success: true, id: 1, message: 'Solicitud recibida.' });
  });

  // El texto del label incluye el asterisco de campo obligatorio
  // ("registration.fields.fullName *"), asi que el match es por regex.
  const fill = (labelText, value) => {
    const input = screen.getByLabelText(new RegExp(`^${labelText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
    fireEvent.change(input, { target: { value } });
  };

  const renderForm = () =>
    render(
      <MemoryRouter>
        <RegistrationForm />
      </MemoryRouter>,
    );

  it('pide nombre, email, empresa y pais', () => {
    renderForm();
    expect(screen.getByLabelText(new RegExp('^registration.fields.fullName'))).toBeInTheDocument();
    expect(screen.getByLabelText(new RegExp('^registration.fields.email'))).toBeInTheDocument();
    expect(screen.getByLabelText(new RegExp('^registration.fields.company'))).toBeInTheDocument();
    expect(screen.getByLabelText(new RegExp('^registration.fields.country'))).toBeInTheDocument();
  });

  it('el consentimiento de promociones arranca DESMARCADO', () => {
    renderForm();
    const checkbox = screen.getByLabelText(new RegExp('^registration.fields.marketing'));
    expect(checkbox.checked).toBe(false);
  });

  it('el consentimiento de privacidad arranca DESMARCADO', () => {
    renderForm();
    const checkbox = screen.getByLabelText(/registration.fields.privacy/);
    expect(checkbox.checked).toBe(false);
  });

  it('no envia si falta el consentimiento de privacidad', async () => {
    renderForm();
    fill('registration.fields.fullName', 'Daria Kasatkina');
    fill('registration.fields.email', 'daria.kasatkina@tabby.ai');
    fill('registration.fields.company', 'Tabby');
    fill('registration.fields.country', 'UAE');

    fireEvent.click(screen.getByText('registration.submit'));

    await waitFor(() => {
      expect(screen.getByText('registration.errors.privacy')).toBeInTheDocument();
    });
    expect(createRegistration).not.toHaveBeenCalled();
  });

  it('no envia si falta el email', async () => {
    renderForm();
    fill('registration.fields.fullName', 'Daria Kasatkina');
    fill('registration.fields.company', 'Tabby');
    fill('registration.fields.country', 'UAE');
    fireEvent.click(screen.getByLabelText(/registration.fields.privacy/));

    fireEvent.click(screen.getByText('registration.submit'));

    await waitFor(() => {
      expect(screen.getByText('registration.errors.email')).toBeInTheDocument();
    });
    expect(createRegistration).not.toHaveBeenCalled();
  });

  it('envia la solicitud al backend con el consentimiento de promociones', async () => {
    renderForm();
    fill('registration.fields.fullName', 'Daria Kasatkina');
    fill('registration.fields.email', 'daria.kasatkina@tabby.ai');
    fill('registration.fields.company', 'Tabby');
    fill('registration.fields.country', 'UAE');
    fireEvent.click(screen.getByLabelText(/registration.fields.privacy/));
    fireEvent.click(screen.getByLabelText(new RegExp('^registration.fields.marketing')));

    fireEvent.click(screen.getByText('registration.submit'));

    await waitFor(() => expect(createRegistration).toHaveBeenCalledTimes(1));

    const payload = createRegistration.mock.calls[0][0];
    expect(payload.fullName).toBe('Daria Kasatkina');
    expect(payload.email).toBe('daria.kasatkina@tabby.ai');
    expect(payload.company).toBe('Tabby');
    expect(payload.country).toBe('UAE');
    expect(payload.privacyConsent).toBe(true);
    expect(payload.marketingConsent).toBe(true);
    expect(payload.event).toBe('dubai-2026');
    expect(payload.source).toBe('web-registration-form');
  });

  it('manda marketingConsent false si no se marca', async () => {
    renderForm();
    fill('registration.fields.fullName', 'Daria Kasatkina');
    fill('registration.fields.email', 'daria.kasatkina@tabby.ai');
    fill('registration.fields.company', 'Tabby');
    fill('registration.fields.country', 'UAE');
    fireEvent.click(screen.getByLabelText(/registration.fields.privacy/));

    fireEvent.click(screen.getByText('registration.submit'));

    await waitFor(() => expect(createRegistration).toHaveBeenCalledTimes(1));
    const payload = createRegistration.mock.calls[0][0];
    expect(payload.marketingConsent).toBe(false);
    expect(payload.privacyConsent).toBe(true);
  });

  it('lleva un requestKey para que un doble clic no cree dos solicitudes', async () => {
    renderForm();
    fill('registration.fields.fullName', 'Daria Kasatkina');
    fill('registration.fields.email', 'daria.kasatkina@tabby.ai');
    fill('registration.fields.company', 'Tabby');
    fill('registration.fields.country', 'UAE');
    fireEvent.click(screen.getByLabelText(/registration.fields.privacy/));

    fireEvent.click(screen.getByText('registration.submit'));
    await waitFor(() => expect(createRegistration).toHaveBeenCalledTimes(1));

    const payload = createRegistration.mock.calls[0][0];
    expect(payload.requestKey).toBeTruthy();
    expect(typeof payload.requestKey).toBe('string');
  });

  it('el alta va por el cliente de la API, no por una ruta relativa del dominio web', async () => {
    const fetchSpy = vi.fn();
    global.fetch = fetchSpy;
    renderForm();
    fill('registration.fields.fullName', 'Daria Kasatkina');
    fill('registration.fields.email', 'daria.kasatkina@tabby.ai');
    fill('registration.fields.company', 'Tabby');
    fill('registration.fields.country', 'UAE');
    fireEvent.click(screen.getByLabelText(/registration.fields.privacy/));

    fireEvent.click(screen.getByText('registration.submit'));
    await waitFor(() => expect(createRegistration).toHaveBeenCalledTimes(1));

    // Si esto volviera a un fetch('/api/registro'), en produccion daria 405:
    // en dubai.xopsconference.com ese path lo sirve Vercel como la SPA.
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('muestra el error del backend sin perder lo ya escrito', async () => {
    createRegistration.mockResolvedValue({
      success: false,
      message: 'No se ha encontrado el evento.',
    });
    renderForm();
    fill('registration.fields.fullName', 'Daria Kasatkina');
    fill('registration.fields.email', 'daria.kasatkina@tabby.ai');
    fill('registration.fields.company', 'Tabby');
    fill('registration.fields.country', 'UAE');
    fireEvent.click(screen.getByLabelText(/registration.fields.privacy/));

    fireEvent.click(screen.getByText('registration.submit'));

    await waitFor(() => {
      expect(screen.getByText('No se ha encontrado el evento.')).toBeInTheDocument();
    });
    // El nombre sigue en el campo: no se pierde lo escrito.
    expect(screen.getByLabelText(new RegExp('^registration.fields.fullName')).value).toBe('Daria Kasatkina');
  });
});
