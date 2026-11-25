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

const postSpy = vi.fn();

describe('RegistrationForm — formulario de solicitud de entrada', () => {
  beforeEach(() => {
    postSpy.mockReset();
    global.fetch = vi.fn(async (url, opts) => {
      postSpy(url, opts);
      return {
        ok: true,
        json: async () => ({ success: true, id: 1, message: 'ok' }),
      };
    });
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
    expect(postSpy).not.toHaveBeenCalled();
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
    expect(postSpy).not.toHaveBeenCalled();
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

    await waitFor(() => expect(postSpy).toHaveBeenCalledTimes(1));

    const [url, opts] = postSpy.mock.calls[0];
    expect(url).toBe('/api/registro');
    expect(opts.method).toBe('POST');

    const body = JSON.parse(opts.body);
    expect(body.fullName).toBe('Daria Kasatkina');
    expect(body.email).toBe('daria.kasatkina@tabby.ai');
    expect(body.company).toBe('Tabby');
    expect(body.country).toBe('UAE');
    expect(body.privacyConsent).toBe(true);
    expect(body.marketingConsent).toBe(true);
    expect(body.event).toBe('dubai-2026');
  });

  it('manda marketingConsent false si no se marca', async () => {
    renderForm();
    fill('registration.fields.fullName', 'Daria Kasatkina');
    fill('registration.fields.email', 'daria.kasatkina@tabby.ai');
    fill('registration.fields.company', 'Tabby');
    fill('registration.fields.country', 'UAE');
    fireEvent.click(screen.getByLabelText(/registration.fields.privacy/));

    fireEvent.click(screen.getByText('registration.submit'));

    await waitFor(() => expect(postSpy).toHaveBeenCalledTimes(1));
    const body = JSON.parse(postSpy.mock.calls[0][1].body);
    expect(body.marketingConsent).toBe(false);
    expect(body.privacyConsent).toBe(true);
  });

  it('muestra el error del backend sin perder lo ya escrito', async () => {
    global.fetch = vi.fn(async () => ({
      ok: false,
      json: async () => ({ success: false, message: 'No se ha encontrado el evento.' }),
    }));
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
