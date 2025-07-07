// Definir URLs dinámicas a cachear para uso offline:
const DATA_URLS = [
  '/api/agenda',
  '/api/ponentes'
];

// Definir nombre de la cache de datos
const DATA_CACHE = 'data-cache-v1';

// Exportar DATA_URLS y DATA_CACHE para uso en el scope del SW
export { DATA_URLS, DATA_CACHE };