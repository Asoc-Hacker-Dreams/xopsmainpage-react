export const cityEvents = {
  madrid: {
    slug: 'madrid',
    hostname: 'madrid.xopsconference.com',
    locale: 'es-ES',
    flag: '🇪🇸',
    city: 'Madrid',
    country: 'España',
    dateRange: '19–21 noviembre 2026',
    startDate: '2026-11-19',
    endDate: '2026-11-21',
    summit: {
      dates: '19 de noviembre de 2026',
      venue: 'Fundación Juan XXIII Roncalli, Madrid',
      attendees: 'Máximo 90 asistentes',
      agendaDate: '19 Nov',
    },
    conference: {
      dates: '20 y 21 de noviembre de 2026',
      venue: 'Universidad Rey Juan Carlos, Campus de Móstoles',
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
    dateRange: '30 November – 3 December 2026',
    startDate: '2026-11-30',
    endDate: '2026-12-03',
    summit: {
      dates: '30 November and 1 December 2026',
      venue: 'Venue to be confirmed, Dubai',
      attendees: 'Limited executive capacity',
      agendaDate: '30 Nov – 1 Dec',
    },
    conference: {
      dates: '2 and 3 December 2026',
      venue: 'Venue to be confirmed, Dubai',
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
