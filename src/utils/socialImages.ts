// Social Share Image Configuration

export interface SocialImage {
  url: string;
  width: number;
  height: number;
  alt: string;
  type?: string;
}

const BASE_URL = 'https://xopsconference.com/assets';

export const socialImages = {
  home: {
    url: `${BASE_URL}/og-home.jpg`,
    width: 1200,
    height: 630,
    alt: 'X-Ops Conference Madrid 2026 - Únete a la revolución tecnológica',
  },

  agenda: {
    url: `${BASE_URL}/og-agenda.jpg`,
    width: 1200,
    height: 630,
    alt: 'Agenda X-Ops Conference 2026 - Descubre todas las charlas',
  },

  speakers: {
    url: `${BASE_URL}/og-speakers.jpg`,
    width: 1200,
    height: 630,
    alt: 'Speakers X-Ops Conference 2026 - Expertos internacionales',
  },

  speaker: {
    url: `${BASE_URL}/og-speaker-template.jpg`,
    width: 1200,
    height: 630,
    alt: 'Ponente en X-Ops Conference 2026',
  },

  tickets: {
    url: `${BASE_URL}/og-tickets.jpg`,
    width: 1200,
    height: 630,
    alt: 'Compra tu entrada para X-Ops Conference 2026',
  },

  sponsors: {
    url: `${BASE_URL}/og-sponsors.jpg`,
    width: 1200,
    height: 630,
    alt: 'Patrocinadores X-Ops Conference 2026',
  },

  cfp: {
    url: `${BASE_URL}/og-cfp.jpg`,
    width: 1200,
    height: 630,
    alt: 'Call for Papers - Envía tu propuesta a X-Ops Conference 2026',
  },

  networking: {
    url: `${BASE_URL}/og-networking.jpg`,
    width: 1200,
    height: 630,
    alt: 'Networking en X-Ops Conference 2026 - Conecta con profesionales',
  },

  default: {
    url: `${BASE_URL}/og-default.jpg`,
    width: 1200,
    height: 630,
    alt: 'X-Ops Conference - DevOps, DevSecOps, AIOps, MLOps en Madrid',
  },
};

export function generateDynamicOGImage(options: {
  title: string;
  subtitle?: string;
  speaker?: string;
  date?: string;
  type: 'speaker' | 'talk' | 'session' | 'general';
}): SocialImage {
  const baseImage = options.type === 'speaker' 
    ? socialImages.speaker 
    : socialImages.default;

  return {
    ...baseImage,
    alt: options.title,
  };
}

export function getOGImageForPath(path: string): SocialImage {
  if (path.includes('/agenda') || path.includes('/mi-agenda')) {
    return socialImages.agenda;
  }
  if (path.includes('/speaker/')) {
    return socialImages.speaker;
  }
  if (path.includes('/speakers') || path.includes('/ponentes')) {
    return socialImages.speakers;
  }
  if (path.includes('/tickets') || path.includes('/summit')) {
    return socialImages.tickets;
  }
  if (path.includes('/sponsor') || path.includes('/patrocinio')) {
    return socialImages.sponsors;
  }
  if (path.includes('/cfp')) {
    return socialImages.cfp;
  }
  if (path.includes('/networking')) {
    return socialImages.networking;
  }
  if (path === '/' || path === '') {
    return socialImages.home;
  }
  return socialImages.default;
}

export const twitterImageSizes = {
  large: { width: 1200, height: 628 },
  small: { width: 300, height: 157 },
};

export const whatsAppImageSize = { width: 1200, height: 630 };

export default socialImages;
