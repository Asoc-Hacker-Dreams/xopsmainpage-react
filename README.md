Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
# Xops Main Page - React + Vite

## Service Worker Configuration

### DATA_URLS
The `DATA_URLS` constant defined in `src/serviceWorker.ts` contains the list of API endpoints that the Service Worker will intercept and cache for offline functionality. This enables users to access the agenda and speakers list even when they don't have an internet connection.

Currently configured URLs:
- `/api/agenda` - Event schedule data
- `/api/ponentes` - Speakers information

## Offline Data Caching

Definimos en `public/sw.js`:

- `DATA_URLS`: array de rutas (`/api/agenda`, `/api/ponentes`) que contiene las URLs de APIs que el Service Worker interceptará y cacheará para funcionalidad offline.
- `DATA_CACHE`: nombre de la cache de datos (`data-cache-v1`) que almacena las respuestas de las APIs para acceso offline.

### ¿Qué es DATA_CACHE y DATA_URLS?

- **DATA_CACHE**: Cache específica para datos dinámicos de APIs. Se mantiene separada de la cache de recursos estáticos para permitir estrategias de invalidación independientes.
- **DATA_URLS**: Array que define qué rutas de API deben ser interceptadas y cacheadas por el Service Worker.

### Cómo versionar y purgar cache:

1. **Incrementa el nombre de la cache en el código**:
   ```js
   const DATA_CACHE = 'data-cache-v2';
   ```

2. **Al desplegar nueva versión, limpia caches antiguas en el handler activate**:
   ```js
   self.addEventListener('activate', event => {
     const validCaches = [DATA_CACHE, STATIC_CACHE];
     event.waitUntil(
       caches.keys().then(keys =>
         Promise.all(
           keys.map(key => {
             if (!validCaches.includes(key)) {
               return caches.delete(key);
             }
           })
         )
       )
     );
   });
   ```

3. **Para purga manual (e.g., en consola del navegador)**:
   ```js
   await caches.delete('data-cache-v1');
   await caches.delete('data-cache-v2');
   ```

### Estrategia de purga

- **Automática**: Al activar una nueva versión del Service Worker, se eliminan automáticamente las caches antiguas no incluidas en `validCaches`.
- **Manual**: Los desarrolladores pueden forzar la eliminación de caches específicas usando `caches.delete()` en la consola del navegador.
- **Criterios de invalidación**: Cambiar la versión del `DATA_CACHE` fuerza la regeneración de toda la cache de datos en el próximo despliegue.

## Badges

Add badges from somewhere like: [shields.io](https://shields.io/)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://choosealicense.com/licenses/mit/)
[GitHub Repository](https://github.com/jvrDvos/jvrDvos)
For any questions or feedback, feel free to open an issue in the repository.
