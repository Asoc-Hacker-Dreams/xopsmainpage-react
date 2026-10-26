// Identidades comprobadas: Asociación Hacker Dreams (CIF: G56643158)
// y Odin Hermes & Danu Technology Solutions LLC (Delaware, Estados Unidos).
// Las direcciones registrales deben verificarse documentalmente antes del lanzamiento.
export const LEGAL_VERSION = '2026-10-26';
export const ORGANIZER = Object.freeze({
  name: 'Asociación Hacker Dreams',
  taxId: 'G56643158',
  country: 'España',
  registeredAddress: import.meta.env.VITE_HACKER_DREAMS_ADDRESS || '',
  associationRegistry: import.meta.env.VITE_HACKER_DREAMS_REGISTRY || '',
  contactEmail: 'info@xopsconference.com',
  privacyEmail: 'info@xopsconference.com',
});
export const PAYMENT_COLLECTOR = Object.freeze({
  name: 'Odin Hermes & Danu Technology Solutions LLC',
  jurisdiction: 'Delaware, Estados Unidos',
  registeredAddress: import.meta.env.VITE_ODIN_LEGAL_ADDRESS || '',
});
// Stripe es el proveedor técnico de pagos; el organizador y la entidad de
// recaudación NO deben describirse indistintamente como el vendedor.
// Verificar el merchant of record de cada edición antes de publicar.
