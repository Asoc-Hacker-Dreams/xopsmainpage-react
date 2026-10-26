// Shared public identity and jurisdiction helpers. These are NOT payment processor credentials.
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
  jurisdiction: 'Delaware, United States',
  registeredAddress: import.meta.env.VITE_ODIN_LEGAL_ADDRESS || '',
});
// The collector, legal merchant of record, and invoice issuer may differ.
// The backend must explicitly confirm merchant of record and invoice issuer
// for each edition; no frontend value can prove either relationship.
export const editionFromHost = (hostname = '') => {
  const host = String(hostname).toLowerCase().split(':')[0];
  return host === 'dubai.xopsconference.com' ? 'dubai' :
    host === 'madrid.xopsconference.com' ? 'madrid' : null;
};
export const editionFromEvent = (event, host = '') => {
  const evidence = [event?.name, event?.slug, event?.location, event?.city]
    .filter(Boolean).join(' ').toLowerCase();
  if (/dubai|دبي|الإمارات/.test(evidence)) return 'dubai';
  if (/madrid|móstoles|mostoles/.test(evidence)) return 'madrid';
  return editionFromHost(host);
};
export const resolveLegalEdition = (pathname = '', hostname = '') => {
  if (/\/(?:dubai|ae)(?:\/|$)/i.test(pathname)) return 'dubai';
  if (/\/(?:madrid|eu)(?:\/|$)/i.test(pathname)) return 'madrid';
  return editionFromHost(hostname) || 'madrid';
};
export const requiredPublicLegalMetadata = () => ({
  registeredOffice: Boolean(ORGANIZER.registeredAddress.trim()),
  associationRegistry: Boolean(ORGANIZER.associationRegistry.trim()),
  collectionEntityAddress: Boolean(PAYMENT_COLLECTOR.registeredAddress.trim()),
});
