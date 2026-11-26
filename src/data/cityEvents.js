export const cityEvents = {
  madrid: {
    slug: 'madrid',
    hostname: 'madrid.xopsconference.com',
    locale: 'es-ES',
    flag: '🇪🇸',
    city: 'Madrid',
    country: 'España',
    status: 'postponed',
    dateRange: 'Aplazado · nueva fecha por confirmar',
    startDate: '2026-11-19',
    endDate: '2026-11-21',
    summit: {
      dates: 'Aplazado · nueva fecha por confirmar',
      venue: 'Sede por confirmar, Madrid',
      attendees: 'Máximo 90 asistentes',
      agendaDate: 'Fecha por confirmar',
    },
    conference: {
      dates: 'Aplazado · nueva fecha por confirmar',
      venue: 'Sede por confirmar, Madrid',
      cfpUrl: 'https://sessionize.com/x-ops-conference-2026/',
    },
    speakers: 'madrid',
  },
  dubai: {
    slug: 'dubai',
    hostname: 'dubai.xopsconference.com',
    locale: 'en-AE',
    flag: '🇦🇪',
    city: 'Dubai',
    country: 'United Arab Emirates',
    dateRange: '30 November 2026',
    startDate: '2026-11-30',
    endDate: '2026-11-30',
    summit: {
      dates: '30 November 2026',
      // La sede de Dubái esta por confirmar (DKP esta descartado; se cierra
      // con in5). La portada ya decia "Sede por confirmar": aqui se iguala
      // para que las dos paginas no se contradigan.
      venue: 'Sede por confirmar, Dubai',
      attendees: 'Up to 90 attendees',
      agendaDate: '30 Nov',
    },
    conference: {
      dates: '30 November 2026',
      venue: 'Sede por confirmar, Dubai',
      cfpUrl: 'https://sessionize.com/x-ops-conference-2026/',
    },
    speakers: null,
  },
};

export const getCityFromHostname = (hostname = '') => {
  const normalizedHostname = hostname.toLowerCase().split(':')[0];
  return Object.values(cityEvents).find((event) => event.hostname === normalizedHostname)?.slug || null;
};

export const cityUrl = (city) => `https://${cityEvents[city].hostname}`;
