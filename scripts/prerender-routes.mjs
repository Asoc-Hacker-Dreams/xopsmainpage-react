// Fuente única de rutas para sitemap (vite.config.js) y prerender
// (scripts/prerender.mjs). Duplicar esta lista garantiza que diverja.
export const ROUTES = [
  '/',
  // City pages are canonical on their dedicated hostnames, but also need static /city fallback.
  '/madrid',
  '/dubai',
  '/summit',
  '/Summit',
  '/startup-pack',
  '/startup-pack-application',
  '/Sponsor',
  '/Patrocina',
  '/Organizer',
  '/Organizadores',
  '/Team',
  '/Equipo',
  '/agenda',
  '/mi-agenda',
  // Rutas de archivo para 2025
  '/archive/2025/Speakers2025',
  '/archive/2025/Events2025',
  '/archive/2025/Sponsor2025',
  // Rutas de archivo para 2024
  '/archive/2024/Speakers2024',
  '/archive/2024/Events2024',
  '/archive/2024/Sponsor2024',
  // Rutas de archivo para 2023
  '/archive/2023/Speakers2023',
  // Política y legal
  '/aviso-legal',
  '/politica-de-privacidad',
  '/politica-de-privacidad/madrid',
  '/politica-de-privacidad/dubai',
  '/politica-de-cookies',
  '/terminos-de-servicio',
  '/terminos-de-servicio/madrid',
  '/terminos-de-servicio/dubai',
  '/privacidad-patrocinadores',
  '/fotografia-y-video',
  '/voluntariado',
  '/convocatoria-ponentes',
];
