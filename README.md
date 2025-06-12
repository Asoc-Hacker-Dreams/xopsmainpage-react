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

## Badges

Add badges from somewhere like: [shields.io](https://shields.io/)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://choosealicense.com/licenses/mit/)
[GitHub Repository](https://github.com/jvrDvos/jvrDvos)
For any questions or feedback, feel free to open an issue in the repository.
