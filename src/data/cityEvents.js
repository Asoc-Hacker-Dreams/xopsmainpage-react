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
      // Sede confirmada por Antonio (27-nov-2026): in5 Tech, Dubai Internet
      // City, dentro del distrito de innovacion de TECOM. La Conference Hall
      // es de 1.720 sq ft, aforo 100, con AV fijo (2 proyectores, 4 HDMI y
      // microfonos de mano, solapa y atril) y parking gratuito. Catering en las
      // cafeterias del propio edificio.
      // DKP esta descartado: VenueWise lo rechazo para el 30-nov (25-nov).
      venue: 'in5 Tech, Dubai Internet City',
      attendees: 'Up to 90 attendees',
      agendaDate: '30 Nov',
    },
    conference: {
      dates: '30 November 2026',
      venue: 'in5 Tech, Dubai Internet City',
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
