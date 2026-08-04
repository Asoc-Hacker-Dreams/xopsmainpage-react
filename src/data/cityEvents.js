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
    dateRange: '15–17 October 2026',
    startDate: '2026-10-15',
    endDate: '2026-10-17',
    summit: {
      dates: '15 and 16 October 2026',
      venue: 'Venue to be confirmed, Dubai',
      attendees: 'Limited executive capacity',
      agendaDate: '15–16 Oct',
    },
    conference: {
      dates: '17 October 2026',
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
