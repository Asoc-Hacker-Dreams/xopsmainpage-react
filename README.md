# X-Ops Conference Madrid - Sitio Web Oficial

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.3-green.svg)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-purple.svg)](https://getbootstrap.com/)
[![Website](https://img.shields.io/badge/Website-xopsconference.com-orange.svg)](https://xopsconference.com)

## 📋 Descripción del Proyecto

Este es el sitio web oficial de la **X-Ops Conference Madrid**, una conferencia de primer nivel diseñada para profesionales y entusiastas del mundo X-Ops. La aplicación web presenta información sobre el evento, ponentes, agenda, patrocinadores y permite la compra de entradas.

### ¿Qué es X-Ops?

X-Ops es una metodología innovadora que representa la convergencia de múltiples disciplinas operativas:

- **DevOps**: Colaboración entre equipos de desarrollo y operaciones
- **DevSecOps**: Integración de prácticas de seguridad en el proceso DevOps  
- **AIOps**: Utilización de inteligencia artificial para mejorar las operaciones de TI
- **MLOps**: Optimización del despliegue de modelos de aprendizaje automático
- **BizDevOps**: Alineación de objetivos empresariales con las operaciones de TI

### Objetivo del Evento

La X-Ops Conference reúne a expertos, líderes de la industria, desarrolladores e ingenieros para compartir conocimientos, experiencias y mejores prácticas. Los asistentes pueden:

- Aprender de expertos reconocidos en la industria
- Asistir a charlas magistrales y talleres prácticos
- Conocer las últimas herramientas y tecnologías
- Establecer conexiones valiosas en la comunidad X-Ops
- Explorar temas como automatización, CI/CD, monitoreo y arquitecturas seguras

## 🚀 Tecnologías Utilizadas

### Frontend Framework
- **React 18.3.1**: Biblioteca de JavaScript para construir interfaces de usuario
- **React DOM 18.3.1**: Renderizado de componentes React en el DOM
- **React Router DOM 6.27.0**: Enrutamiento del lado del cliente para aplicaciones React

### Build Tool & Development
- **Vite 6.3.3**: Herramienta de construcción rápida para desarrollo frontend moderno
- **@vitejs/plugin-react 4.3.3**: Plugin oficial de Vite para soporte de React con Babel Fast Refresh

### UI Framework & Styling
- **Bootstrap 5.3.3**: Framework CSS para diseño responsivo y componentes
- **React Bootstrap 2.10.5**: Componentes de Bootstrap específicos para React
- **CSS personalizado**: Estilos específicos del proyecto

### Funcionalidades Avanzadas
- **React Helmet Async 2.0.5**: Gestión dinámica del `<head>` para SEO y metadatos
- **AOS (Animate On Scroll) 2.3.4**: Biblioteca para animaciones al hacer scroll
- **React Icons 5.3.0**: Biblioteca de iconos para React

### Herramientas de Desarrollo
- **ESLint 9.13.0**: Linter para mantener la calidad del código JavaScript/React
- **Vite Plugin Sitemap 0.7.1**: Generación automática de sitemap
- **gh-pages 6.2.0**: Despliegue automatizado a GitHub Pages

### Navegación y Estructura
- **Routing dinámico**: Navegación entre páginas principales y archivo de eventos anteriores
- **Componentes modulares**: Arquitectura componentizada para mantenibilidad
- **Responsive design**: Diseño adaptativo para todos los dispositivos

## 📁 Estructura del Proyecto

```
xopsmainpage-react/
├── public/                     # Archivos estáticos públicos
│   ├── index.html             # Plantilla HTML principal
│   └── assets/                # Imágenes y recursos públicos
├── src/                       # Código fuente de la aplicación
│   ├── components/            # Componentes reutilizables
│   │   ├── Hero.jsx          # Componente de cabecera principal
│   │   ├── SpeakersSection.jsx # Sección de ponentes
│   │   ├── EventSchedule.jsx  # Programa del evento
│   │   ├── XOpsSection.jsx    # Explicación de X-Ops
│   │   ├── Themes.jsx         # Temas clave del evento
│   │   ├── Collaborators.jsx  # Patrocinadores y colaboradores
│   │   ├── Ubication.jsx      # Información de ubicación
│   │   └── AnimationWrapper.jsx # Wrapper para animaciones
│   ├── pages/                 # Páginas principales
│   │   ├── Home.jsx          # Página principal
│   │   ├── Organizer.jsx     # Página de organizadores
│   │   ├── Sponsor.jsx       # Página de patrocinadores
│   │   └── archive/          # Archivo de eventos anteriores
│   │       ├── 2023/         # Eventos del 2023
│   │       └── 2024/         # Eventos del 2024
│   ├── assets/               # Recursos de la aplicación
│   ├── styles/               # Hojas de estilo CSS
│   ├── App.jsx              # Componente principal de la aplicación
│   ├── main.jsx             # Punto de entrada de la aplicación
│   └── ScrollHandler.jsx    # Manejador de scroll para navegación
├── package.json             # Dependencias y scripts del proyecto
├── vite.config.js          # Configuración de Vite
├── eslint.config.js        # Configuración de ESLint
└── README.md               # Este archivo
```

## ⚙️ Instalación y Configuración

### Prerrequisitos

- **Node.js** (versión 16 o superior)
- **npm** (incluido con Node.js)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Asoc-Hacker-Dreams/xopsmainpage-react.git
cd xopsmainpage-react
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
# o
npm start
```

4. **Abrir en el navegador**
- La aplicación estará disponible en `http://localhost:5173`

## 🛠️ Scripts Disponibles

### Desarrollo
```bash
npm run dev        # Inicia el servidor de desarrollo con Vite
npm start          # Alias para npm run dev
```

### Construcción y Despliegue
```bash
npm run build      # Construye la aplicación para producción
npm run preview    # Previsualiza la build de producción localmente
npm run predeploy  # Script que se ejecuta antes del despliegue
```

### Calidad de Código
```bash
npm run lint       # Ejecuta ESLint para verificar la calidad del código
```

## 🌐 Despliegue

### Producción
La aplicación está desplegada en [xopsconference.com](https://xopsconference.com) utilizando GitHub Pages.

### Configuración de Build
- **Base URL**: Configurada para despliegue en el dominio principal (`/`)
- **Optimizaciones**: Vite optimiza automáticamente para producción
- **Assets**: Todos los recursos se minimizan y optimizan

### Despliegue con Docker

El proyecto incluye soporte para Docker con un `Dockerfile` multi-stage:

```bash
# Construir la imagen
docker build -t xops-conference .

# Ejecutar el contenedor
docker run -p 80:80 xops-conference
```

**Características del Dockerfile:**
- **Stage 1 (Builder)**: Construye la aplicación usando Node.js 20 Alpine
- **Stage 2 (Servidor)**: Sirve la aplicación usando Nginx Alpine
- **Optimizado**: Imagen final ligera solo con los archivos de producción

## 🎯 Funcionalidades Principales

### Navegación
- **Página principal**: Información general del evento y llamadas a la acción
- **Sección Ponentes**: Perfiles detallados de los speakers
- **Programa**: Agenda completa con horarios y descripciones
- **Patrocinadores**: Información de empresas colaboradoras
- **Organizadores**: Equipo organizador del evento
- **Archivo histórico**: Eventos de años anteriores (2023, 2024)

### Interacciones
- **Compra de entradas**: Integración con Eventbrite
- **Formulario de voluntarios**: Registro para colaborar en el evento
- **Call for Papers (CFP)**: Sistema para proponer charlas
- **Enlaces a redes sociales**: Conexión con canales oficiales

### Optimizaciones
- **SEO**: Meta tags dinámicos con React Helmet
- **Responsive**: Diseño adaptativo para móviles y escritorio
- **Performance**: Lazy loading y optimización de imágenes
- **Animaciones**: Efectos visuales suaves con AOS

## 🤝 Contribución

Para contribuir al proyecto:

1. **Fork** el repositorio
2. Crea una **rama de feature** (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un **Pull Request**

### Estándares de Código
- Seguir las reglas de ESLint configuradas
- Usar componentes funcionales con hooks
- Mantener la estructura de carpetas establecida
- Documentar componentes complejos

## 📞 Contacto y Soporte

- **Email**: [info@xopsconference.com](mailto:info@xopsconference.com)
- **Website**: [xopsconference.com](https://xopsconference.com)
- **Teléfono**: +34 744 644 873 / +34 693 814 098
- **Issues**: Para reportar problemas, abre un issue en este repositorio

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🏢 Información del Evento

- **Fecha**: 21 y 22 de Noviembre 2025
- **Ubicación**: Universidad Rey Juan Carlos campus Móstoles
- **Dirección**: Av. del Alcalde de Móstoles, s/n, 28933 Móstoles, Madrid
- **Organizado por**: Asociación Hacker Dreams

---

*Para cualquier consulta o feedback, no dudes en abrir un issue en el repositorio o contactarnos directamente.*
