# X-Ops Conference 2026 Web Update — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Actualizar la web de X-Ops Conference para la edición 2026: archivar el 2025, limpiar organizadores y referencias a HackBCN, actualizar fechas/ubicaciones, preparar agenda vacía 2026, y corregir bugs de idioma, cabecera y TriskelGate.

**Architecture:** Todos los cambios son aislados — archivos React individuales, JSON de i18n y un archivo CSS. No se añaden nuevas rutas ni dependencias. Se crea `schedule2026.json` (array vacío) para reemplazar `schedule2025.json` en el componente Events.

**Tech Stack:** React, React Bootstrap, react-i18next, Vite, Vitest + React Testing Library

**Spec:** `docs/superpowers/specs/2026-05-15-xops-conference-2026-update-design.md`

---

## File Map

| Archivo | Acción | Tarea |
|---------|--------|-------|
| `src/i18n/locales/en.json` | Modificar | 1, 3 |
| `src/styles/Custom.css` | Modificar | 2 |
| `src/i18n/locales/es.json` | Modificar | 3 |
| `src/components/Organizers.jsx` | Modificar | 4 |
| `src/App.jsx` | Modificar | 5 |
| `src/pages/Summit.jsx` | Modificar | 6 |
| `src/components/Summit/SummitHero.jsx` | Modificar | 7 |
| `src/components/Summit/SummitLocation.jsx` | Modificar | 8 |
| `src/components/Summit/ExecutiveAgenda.jsx` | Modificar | 9 |
| `src/components/Summit/SummitOrganizers.jsx` | Modificar | 10 |
| `src/data/schedule2026.json` | Crear | 11 |
| `src/components/Events/Events.jsx` | Modificar | 11 |
| `src/components/Events/Events.test.jsx` | Crear | 11 |
| `src/pages/Tickets.jsx` | Modificar | 12 |
| `src/pages/Tickets.test.jsx` | Crear | 12 |

---

## Task 1: Fix language switcher — `en.json` missing `language.switch`

**Files:**
- Modify: `src/i18n/locales/en.json`

**Problem:** The button in `App.jsx` renders `{t('language.switch')}`. In `es.json` this is `"EN"` (correct). In `en.json` the key does not exist, so the button always shows the literal key string when in English mode instead of `"ES"`.

- [ ] **Step 1: Open `src/i18n/locales/en.json` and locate the `language` section**

Current content in `en.json`:
```json
"language": {
  "changeLanguage": "Change language",
  "spanish": "Spanish",
  "english": "English"
}
```

- [ ] **Step 2: Add the `switch` and `label` keys**

Replace the `language` block with:
```json
"language": {
  "switch": "ES",
  "label": "Language",
  "changeLanguage": "Change language",
  "spanish": "Spanish",
  "english": "English"
}
```

- [ ] **Step 3: Verify in browser**

```bash
cd /Users/specter/Repos/HSM/xopsmainpage-react && npm run dev
```

Abrir la web, verificar que el botón muestra `EN` en español. Hacer clic: la página cambia a inglés y el botón debe mostrar `ES`. Hacer clic de nuevo: vuelve a español, botón muestra `EN`.

- [ ] **Step 4: Commit**

```bash
git add src/i18n/locales/en.json
git commit -m "fix: language toggle now shows ES when site is in English"
```

---

## Task 2: Fix header alignment — logo más bajo que los links del menú

**Files:**
- Modify: `src/styles/Custom.css`

**Problem:** `.header` tiene `padding-top: 40px` con `height: 85px`. Esto empuja el contenedor hacia abajo, desalineando el logo respecto a los items del nav que Bootstrap centra por defecto.

- [ ] **Step 1: Abrir `src/styles/Custom.css` y localizar el bloque `.header` (aprox. líneas 15-23)**

Bloque actual:
```css
.header{
    margin-inline: 0rem;
    background: black !important;
    margin: 5;
    padding-top: 40px;
    padding-left: 40px;
    padding-right: 40px;
    height: 85px;
}
```

- [ ] **Step 2: Corregir el padding y alineación vertical**

Reemplazar el bloque completo con:
```css
.header{
    margin-inline: 0rem;
    background: black !important;
    margin: 0;
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 40px;
    padding-right: 40px;
    height: 85px;
    display: flex;
    align-items: center;
}
```

- [ ] **Step 3: Verificar en browser a distintos tamaños**

```bash
npm run dev
```

- Desktop (>992px): logo y links del menú deben estar a la misma altura.
- Mobile (<=768px): el botón hamburguesa debe seguir visible y correctamente alineado con el logo.

- [ ] **Step 4: Commit**

```bash
git add src/styles/Custom.css
git commit -m "fix: align navbar logo and menu items to same vertical center"
```

---

## Task 3: Actualizar fechas 2026 y keys de archivo en i18n

**Files:**
- Modify: `src/i18n/locales/es.json`
- Modify: `src/i18n/locales/en.json`

- [ ] **Step 1: Actualizar los siguientes bloques en `es.json`**

```json
"hero": {
  "title": "¡ÚNETE A LA REVOLUCIÓN X-OPS!",
  "description": "El mundo de las IT está cambiando. Únete a nosotros en la X-Ops Conference, donde descubrirás cómo la tecnología y las personas adecuadas están impulsando el cambio.",
  "date": "Fecha: 20 y 21 de noviembre 2026",
  "buyTicket": "Compra tu entrada",
  "viewAgenda": "Ver agenda",
  "cfp": "CFP",
  "installApp": "📱 Instalar App"
},
"footer": {
  "address": "Dirección",
  "addressLine1": "Universidad Rey Juan Carlos campus Móstoles",
  "addressLine2": "Av. del Alcalde de Móstoles, s/n, 28933 Móstoles, Madrid",
  "contacts": "Contactos",
  "links": "Enlaces",
  "privacyPolicy": "Política de Privacidad",
  "cookieSettings": "🍪 Gestión de Cookies",
  "copyright": "© 2026 - X-Ops Conference"
},
"archive": {
  "xops2025": "X-Ops Conference Madrid 2025",
  "xops2024": "X-Ops Conference Madrid 2024",
  "speakers": "Ponentes",
  "agenda": "Agenda",
  "sponsorCollab": "Patrocinio y Colaboradores",
  "aldea2023": "Aldea DevSecOps 2023"
},
"summit": {
  "title": "X-Ops Summit Madrid 2026",
  "subtitle": "Evento Ejecutivo para Decision Makers",
  "description": "El evento exclusivo para CTOs, CISOs y líderes tecnológicos. 18-19 noviembre 2026, Madrid. Networking de alto nivel y contenido estratégico."
}
```

Note sobre `sponsorCollab`: se elimina el `<br/>` HTML embebido en el string — el texto pasa a ser plano (`"Patrocinio y Colaboradores"`), evitando el uso de HTML en cadenas de traducción.

- [ ] **Step 2: Actualizar los siguientes bloques en `en.json`**

```json
"hero": {
  "title": "JOIN THE X-OPS REVOLUTION!",
  "description": "The world of IT is changing. Join us at X-Ops Conference, where you will discover how the right technology and people are driving change.",
  "date": "Date: November 20-21, 2026",
  "buyTicket": "Buy ticket",
  "viewAgenda": "View agenda",
  "cfp": "CFP",
  "installApp": "📱 Install App"
},
"footer": {
  "address": "Address",
  "addressLine1": "Rey Juan Carlos University Móstoles campus",
  "addressLine2": "Av. del Alcalde de Móstoles, s/n, 28933 Móstoles, Madrid",
  "contacts": "Contacts",
  "links": "Links",
  "privacyPolicy": "Privacy Policy",
  "cookieSettings": "🍪 Cookie Settings",
  "copyright": "© 2026 - X-Ops Conference"
},
"archive": {
  "pastEvents": "Past Events",
  "xops2025": "X-Ops Conference Madrid 2025",
  "xops2024": "X-Ops Conference Madrid 2024",
  "speakers": "Speakers",
  "agenda": "Agenda",
  "sponsorCollab": "Sponsorship and Collaborators",
  "aldea2023": "Aldea DevSecOps 2023"
},
"summit": {
  "title": "X-Ops Summit Madrid 2026",
  "subtitle": "Executive Event for Decision Makers",
  "description": "The exclusive event for CTOs, CISOs and tech leaders. November 18-19, 2026, Madrid. High-level networking and strategic content.",
  "about": "About the Summit",
  "highlights": "Highlights"
}
```

- [ ] **Step 3: Actualizar `App.jsx` — `sponsorCollab` ya no necesita `dangerouslySetInnerHTML`**

En `src/App.jsx`, localizar la línea del NavDropdown.Item de sponsorCollab (busca `sponsorCollab`):

```jsx
<NavDropdown.Item as={Link} to="/archive/2024/Sponsor2024">
  <span dangerouslySetInnerHTML={{ __html: t('archive.sponsorCollab') }} />
</NavDropdown.Item>
```

Reemplazarla con:
```jsx
<NavDropdown.Item as={Link} to="/archive/2024/Sponsor2024">
  {t('archive.sponsorCollab')}
</NavDropdown.Item>
```

- [ ] **Step 4: Verificar en browser**

```bash
npm run dev
```

- La sección hero debe mostrar "Fecha: 20 y 21 de noviembre 2026" (ES) y "Date: November 20-21, 2026" (EN).
- El footer copyright debe decir "© 2026 - X-Ops Conference".
- Al abrir el dropdown de eventos anteriores, el texto "Patrocinio y Colaboradores" debe verse en una sola línea correctamente.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/locales/es.json src/i18n/locales/en.json src/App.jsx
git commit -m "feat: update dates to 2026, add archive 2025 i18n keys, remove HTML from i18n strings"
```

---

## Task 4: Eliminar 4 organizadores de `Organizers.jsx`

**Files:**
- Modify: `src/components/Organizers.jsx`

Eliminar los bloques de: Roberto Gonzalez, Juan Vicente Herrera Ruiz de Alejo, Oscar Cortes Bracho y Armando Felipe Fuentes Denis. Quedan: Francisco Arencibia, Antonio Juanilla, Clara Contreras.

- [ ] **Step 1: Eliminar los 4 imports de imagen del inicio del archivo**

Eliminar estas líneas:
```js
import robertoG from "../assets/organizers/robertoG.jpeg";
import juanV from "../assets/organizers/juanV.jpg";
import oscarC from "../assets/organizers/oscarC.png";
import armandoF from "../assets/organizers/AmandoF.jpg"
```

Mantener solo:
```js
import franciscoA from "../assets/organizers/franciscoA.jpg";
import juanillaA from "../assets/organizers/juanillaA.jpg";
import claraC from "../assets/organizers/claraC.jpg"
```

- [ ] **Step 2: Actualizar el `<Helmet>` — cambiar 2025 por 2026**

Reemplazar el bloque Helmet completo:
```jsx
<Helmet>
  <title>Organizadores | X-Ops Conference Madrid 2026 | DevOps, DevSecOps, AIOps, MLOps</title>
  <meta name="description" content="Conoce a los organizadores de la X-Ops Conference Madrid 2026, expertos en DevOps, DevSecOps, AIOps y MLOps, comprometidos con la innovación en la tecnología y la ciberseguridad."/>
  <meta name="keywords" content="X-Ops, DevOps, DevSecOps, AIOps, MLOps, Organizadores, Conferencia, Madrid, Ciberseguridad, Tecnologías"/>
  <meta property="og:title" content="Conoce a los Organizadores de X-Ops Conference Madrid 2026 | DevOps, DevSecOps, AIOps, MLOps"/>
  <meta property="og:description" content="Descubre a los organizadores de la X-Ops Conference Madrid 2026, líderes en la tecnología y la ciberseguridad."/>
  <meta property="og:url" content="https://xopsconference.com/Organizer#organizr"/>
  <meta name="twitter:card" content="summary_large_image" />
</Helmet>
```

- [ ] **Step 3: Eliminar los 4 bloques `<div className="speaker1 ...">` de Roberto, Juan Vicente, Oscar y Armando**

En la sección `<div className="speaker-cards margin-top">`, eliminar los cuatro bloques correspondientes a esos organizadores. El resultado es que quedan solo 3 bloques: Francisco Arencibia, Antonio Juanilla y Clara Contreras — con su orden original (Francisco primero, Antonio segundo, Clara tercero).

- [ ] **Step 4: Verificar en browser**

```bash
npm run dev
```

Navegar a `/Organizer`. Deben aparecer solo 3 organizadores: Francisco Arencibia, Antonio Juanilla y Clara Contreras.

- [ ] **Step 5: Commit**

```bash
git add src/components/Organizers.jsx
git commit -m "feat: remove Oscar, Armando, Juan Vicente and Roberto from organizers page"
```

---

## Task 5: Añadir X-Ops 2025 al menú de eventos anteriores

**Files:**
- Modify: `src/App.jsx`

Las rutas `/archive/2025/Speakers2025` y `/archive/2025/Events2025` ya están registradas en el router. Solo falta exponerlas en el dropdown de navegación.

- [ ] **Step 1: Localizar el NavDropdown en `src/App.jsx`**

Buscar el comentario `{/* Menú EVENTOS ANTERIORES */}`. Dentro del NavDropdown, el primer elemento que aparece es el título de X-Ops 2024 (`{t('archive.xops2024')}`).

- [ ] **Step 2: Insertar la sección 2025 ANTES de la sección 2024**

Añadir lo siguiente justo antes de `<div className="submenu-title">{t('archive.xops2024')}</div>`:

```jsx
{/* X-Ops 2025 */}
<div className="submenu-title">{t('archive.xops2025')}</div>
<NavDropdown.Item as={Link} to="/archive/2025/Speakers2025">{t('archive.speakers')}</NavDropdown.Item>
<NavDropdown.Item as={Link} to="/archive/2025/Events2025">{t('archive.agenda')}</NavDropdown.Item>

<NavDropdown.Divider />
```

- [ ] **Step 3: Verificar en browser**

```bash
npm run dev
```

- Abrir el dropdown "EVENTOS ANTERIORES" → debe mostrar 3 secciones: 2025 arriba, luego 2024, luego 2023.
- Clic en "Ponentes" de 2025 → carga `/archive/2025/Speakers2025`.
- Clic en "Agenda" de 2025 → carga `/archive/2025/Events2025`.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add X-Ops 2025 to previous events dropdown navigation"
```

---

## Task 6: Actualizar metadata del Helmet en `Summit.jsx`

**Files:**
- Modify: `src/pages/Summit.jsx`

- [ ] **Step 1: Reemplazar el bloque `<Helmet>` completo**

```jsx
<Helmet>
  <title>X-Ops Summit Madrid 2026 | Evento Ejecutivo para Decision Makers</title>
  <meta name="description" content="El evento exclusivo para CTOs, CISOs y líderes tecnológicos. 18-19 noviembre 2026, Madrid. Networking de alto nivel y contenido estratégico." />
  <meta name="keywords" content="X-Ops Summit, DevOps, SecOps, CTO, CISO, Madrid, Decision Makers, Executive Event" />
  <meta property="og:title" content="X-Ops Summit Madrid 2026" />
  <meta property="og:description" content="El evento exclusivo para líderes tecnológicos. Networking de alto nivel y contenido estratégico." />
  <meta property="og:type" content="event" />
  <meta property="og:url" content="https://xopsconferences.com/summit" />
</Helmet>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Summit.jsx
git commit -m "feat: update Summit page Helmet metadata to Madrid 2026"
```

---

## Task 7: Actualizar `SummitHero.jsx` — fechas, ciudad, quitar HackBCN y early bird

**Files:**
- Modify: `src/components/Summit/SummitHero.jsx`

- [ ] **Step 1: Reemplazar el archivo completo**

```jsx
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const SummitHero = () => {
  return (
    <section className="summit-hero">
      <div className="summit-hero-overlay"></div>
      <Container className="summit-hero-content">
        <Row className="justify-content-center text-center">
          <Col lg={10}>
            <div className="summit-badge">
              <span className="badge-text">EVENTO EJECUTIVO</span>
            </div>

            <h1 className="summit-title">
              X-Ops Summit
              <span className="summit-title-accent">Madrid 2026</span>
            </h1>

            <p className="summit-subtitle">
              El evento exclusivo para <strong>líderes tecnológicos</strong>
            </p>

            <div className="summit-details">
              <div className="summit-detail-item">
                <span className="summit-detail-icon">📅</span>
                <span>18 y 19 de noviembre 2026</span>
              </div>
              <div className="summit-detail-item">
                <span className="summit-detail-icon">📍</span>
                <span>Madrid · Lugar por confirmar</span>
              </div>
              <div className="summit-detail-item">
                <span className="summit-detail-icon">🎯</span>
                <span>Máximo 50 asistentes</span>
              </div>
            </div>

            <p className="summit-description">
              Un programa ejecutivo diseñado para CTOs, CISOs y Decision Makers
              que buscan networking de alto nivel y contenido estratégico.
            </p>

            <div className="summit-cta">
              <Button className="summit-btn-primary" href="#tickets">
                Reservar entrada VIP
              </Button>
              <Button className="summit-btn-secondary" href="#agenda">
                Ver programa
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      <div className="summit-scroll-indicator">
        <span>Descubre más</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </section>
  );
};

export default SummitHero;
```

- [ ] **Step 2: Verificar en browser**

```bash
npm run dev
```

Navegar a `/summit`. Verificar:
- Título: "X-Ops Summit Madrid 2026"
- Fecha: "18 y 19 de noviembre 2026"
- Ubicación: "Madrid · Lugar por confirmar"
- Sin mención a HackBCN ni Early Bird

- [ ] **Step 3: Commit**

```bash
git add src/components/Summit/SummitHero.jsx
git commit -m "feat: update SummitHero to Madrid Nov 18-19 2026, remove HackBCN and early bird"
```

---

## Task 8: Actualizar `SummitLocation.jsx` — TBD Madrid, sin mapa de Barcelona

**Files:**
- Modify: `src/components/Summit/SummitLocation.jsx`

- [ ] **Step 1: Reemplazar el archivo completo**

```jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BsGeoAlt } from 'react-icons/bs';

const SummitLocation = () => {
  return (
    <section className="summit-location" id="ubicacion">
      <Container>
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h2 className="summit-section-title">Ubicación</h2>
            <p className="summit-section-subtitle">
              Un espacio premium para un evento premium
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={8} className="text-center">
            <div className="location-info">
              <h3 className="location-venue">Madrid, España</h3>
              <p className="location-address">
                <BsGeoAlt className="location-icon" />
                Lugar por confirmar — próximamente
              </p>
              <div
                className="location-map"
                style={{
                  background: '#1a1a2e',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  padding: '60px 20px',
                  marginTop: '2rem',
                  color: '#888',
                }}
              >
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📍</p>
                <p style={{ margin: 0 }}>Mapa disponible próximamente</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  La ubicación exacta será anunciada en los próximos meses
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default SummitLocation;
```

- [ ] **Step 2: Verificar en browser**

Navegar a `/summit`, sección Ubicación. Debe mostrar "Madrid, España" con placeholder. Sin referencias a Barcelona, Cinesa Diagonal Mar ni instrucciones de metro/tranvía.

- [ ] **Step 3: Commit**

```bash
git add src/components/Summit/SummitLocation.jsx
git commit -m "feat: update summit location to TBD Madrid, remove Barcelona venue details"
```

---

## Task 9: Actualizar `ExecutiveAgenda.jsx` — 2 días (18-19 Nov), charlas TBD

**Files:**
- Modify: `src/components/Summit/ExecutiveAgenda.jsx`

- [ ] **Step 1: Reemplazar el archivo completo**

```jsx
import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const agendaData = {
  day1: {
    date: '18 Nov',
    title: 'Día 1 — Estrategia y Transformación',
    sessions: [
      { time: '09:00-09:30', title: 'Acreditación & Welcome Coffee', type: 'break' },
      { time: '09:30-10:30', title: 'Keynote de apertura', speaker: 'Por anunciar', type: 'keynote' },
      { time: '10:30-11:15', title: 'Sesión estratégica', speaker: 'Por anunciar', type: 'talk' },
      { time: '11:15-11:45', title: 'Networking Break', type: 'break' },
      { time: '11:45-12:30', title: 'Sesión estratégica', speaker: 'Por anunciar', type: 'talk' },
      { time: '12:30-13:15', title: 'Panel ejecutivo', speakers: 'Por anunciar', type: 'panel' },
      { time: '13:15-14:30', title: 'Almuerzo Ejecutivo', type: 'break' },
      { time: '14:30-15:15', title: 'Workshop ejecutivo', speaker: 'Por anunciar', type: 'workshop' },
      { time: '15:15-16:00', title: 'Caso de éxito', speaker: 'Por anunciar', type: 'talk' },
      { time: '16:00-16:30', title: 'Coffee & Networking', type: 'break' },
      { time: '16:30-17:30', title: 'Roundtable: Desafíos 2026-2027', type: 'roundtable' },
    ],
  },
  day2: {
    date: '19 Nov',
    title: 'Día 2 — Implementación y Futuro',
    sessions: [
      { time: '09:00-09:30', title: 'Morning Coffee', type: 'break' },
      { time: '09:30-10:30', title: 'Keynote', speaker: 'Por anunciar', type: 'keynote' },
      { time: '10:30-11:15', title: 'Sesión estratégica', speaker: 'Por anunciar', type: 'talk' },
      { time: '11:15-11:45', title: 'Networking Break', type: 'break' },
      { time: '11:45-12:30', title: 'Sesión estratégica', speaker: 'Por anunciar', type: 'talk' },
      { time: '12:30-13:15', title: 'Panel ejecutivo', speakers: 'Por anunciar', type: 'panel' },
      { time: '13:15-14:30', title: 'Almuerzo Ejecutivo', type: 'break' },
      { time: '14:30-15:15', title: 'Workshop ejecutivo', speaker: 'Por anunciar', type: 'workshop' },
      { time: '15:15-16:00', title: 'Sesión de cierre', speaker: 'Por anunciar', type: 'talk' },
      { time: '16:00-17:00', title: 'Closing & Networking Cocktail', type: 'break' },
    ],
  },
};

const ExecutiveAgenda = () => {
  const [activeDay, setActiveDay] = useState('day1');

  const renderSession = (session, index) => {
    const typeClass = {
      keynote: 'session-keynote',
      talk: 'session-talk',
      panel: 'session-panel',
      workshop: 'session-workshop',
      roundtable: 'session-roundtable',
      break: 'session-break',
    }[session.type] || 'session-talk';

    return (
      <div key={index} className={`agenda-item ${typeClass}`}>
        <div className="agenda-time">{session.time}</div>
        <div className="agenda-content">
          <h4 className="agenda-title">{session.title}</h4>
          {session.speaker && <span className="agenda-speaker">{session.speaker}</span>}
          {session.speakers && <span className="agenda-speaker">{session.speakers}</span>}
        </div>
      </div>
    );
  };

  return (
    <section className="summit-agenda" id="agenda">
      <Container>
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h2 className="summit-section-title">Programa Ejecutivo</h2>
            <p className="summit-section-subtitle">
              Dos días de contenido estratégico de alto impacto — programa por confirmar
            </p>
          </Col>
        </Row>

        <div className="agenda-day-selector">
          <Button
            className={`day-btn ${activeDay === 'day1' ? 'active' : ''}`}
            onClick={() => setActiveDay('day1')}
          >
            <span className="day-date">18 Nov</span>
            <span className="day-title">Día 1</span>
          </Button>
          <Button
            className={`day-btn ${activeDay === 'day2' ? 'active' : ''}`}
            onClick={() => setActiveDay('day2')}
          >
            <span className="day-date">19 Nov</span>
            <span className="day-title">Día 2</span>
          </Button>
        </div>

        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="agenda-day-header">
              <h3>{agendaData[activeDay].title}</h3>
            </div>
            <div className="agenda-timeline">
              {agendaData[activeDay].sessions.map(renderSession)}
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center mt-4">
          <Col lg={8} className="text-center">
            <p className="agenda-disclaimer">
              * Programa sujeto a cambios. Los speakers serán anunciados próximamente.
            </p>
            <Button className="summit-btn-outline" href="#tickets">
              Reservar mi plaza
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ExecutiveAgenda;
```

- [ ] **Step 2: Verificar en browser**

Navegar a `/summit`, sección agenda. Los botones dicen "18 Nov / Día 1" y "19 Nov / Día 2". Las sesiones muestran "Por anunciar" en los speakers.

- [ ] **Step 3: Commit**

```bash
git add src/components/Summit/ExecutiveAgenda.jsx
git commit -m "feat: update summit agenda to Nov 18-19 2026 with TBD sessions"
```

---

## Task 10: Eliminar HackBCN de `SummitOrganizers.jsx`

**Files:**
- Modify: `src/components/Summit/SummitOrganizers.jsx`

- [ ] **Step 1: Reemplazar el archivo completo**

```jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const organizers = [
  {
    name: 'Pau Cañadillas',
    role: 'Co-fundador',
    bio: 'Técnico en Administración de Sistemas Informáticos en Red. Perfil de ciberseguridad.',
  },
  {
    name: 'Antonio Juanilla',
    role: 'Co-fundador',
    bio: 'DevSecOps (SecDevOps) professional',
  },
  {
    name: 'Marc Mora',
    role: 'Co-fundador',
    bio: 'Cybersecurity Auditor, Trainer & Tech Evangelist',
  },
];

const SummitOrganizers = () => {
  return (
    <section className="summit-organizers" id="organizadores">
      <Container>
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h2 className="summit-section-title">Organizadores</h2>
            <p className="summit-section-subtitle">
              X-Ops Summit es organizado por el equipo de X-Ops Conferences
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          {organizers.map((org, index) => (
            <Col md={4} key={index} className="mb-4">
              <div className="organizer-card">
                <div className="organizer-avatar">
                  {org.name.charAt(0)}
                </div>
                <h4 className="organizer-name">{org.name}</h4>
                <p className="organizer-role">{org.role}</p>
                <p className="organizer-bio">{org.bio}</p>
              </div>
            </Col>
          ))}
        </Row>

        <Row className="justify-content-center mt-4">
          <Col lg={8} className="text-center">
            <div className="organizers-logos">
              <div className="organizer-logo">
                <strong>X-Ops</strong>
                <span>CONFERENCES</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default SummitOrganizers;
```

- [ ] **Step 2: Verificar en browser**

Navegar a `/summit`, sección organizadores. El subtítulo no menciona HackBCN. Solo aparece el logo "X-OPS CONFERENCES", sin el "×" ni "HackBCN".

- [ ] **Step 3: Commit**

```bash
git add src/components/Summit/SummitOrganizers.jsx
git commit -m "feat: remove HackBCN references from SummitOrganizers"
```

---

## Task 11: TDD — Agenda 2026 vacía con banner "Coming Soon"

**Files:**
- Create: `src/data/schedule2026.json`
- Create: `src/components/Events/Events.test.jsx`
- Modify: `src/components/Events/Events.jsx`

### 11a — Escribir el test primero (debe FALLAR)

- [ ] **Step 1: Crear `src/components/Events/Events.test.jsx`**

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../data/schedule2026.json', () => ({ default: [] }));

vi.mock('../AnimationWrapper', () => ({
  default: ({ children }) => <div data-testid="animation-wrapper">{children}</div>,
}));

vi.mock('react-bootstrap', () => ({
  Container: ({ children }) => <div>{children}</div>,
  Row: ({ children, ...props }) => <div>{children}</div>,
  Col: ({ children, ...props }) => <div>{children}</div>,
  Modal: ({ children, show }) => (show ? <div role="dialog">{children}</div> : null),
}));

import Events from './Events';

describe('Events component', () => {
  it('shows coming-soon banner when schedule is empty', () => {
    render(<Events />);
    expect(screen.getByText(/Ponentes y agenda próximamente/i)).toBeInTheDocument();
  });

  it('shows CFP call to action when schedule is empty', () => {
    render(<Events />);
    expect(screen.getByText(/Call for Papers/i)).toBeInTheDocument();
  });

  it('does not show day-filter buttons when schedule is empty', () => {
    render(<Events />);
    expect(screen.queryByText(/viernes/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sábado/i)).not.toBeInTheDocument();
  });

  it('renders the events section with correct id', () => {
    render(<Events />);
    expect(document.querySelector('#events')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar el test — debe FALLAR**

```bash
cd /Users/specter/Repos/HSM/xopsmainpage-react && npm run test:run -- src/components/Events/Events.test.jsx
```

Resultado esperado: FAIL — `Events.jsx` aún importa `schedule2025.json` con datos reales y no tiene lógica de banner.

### 11b — Crear el JSON vacío e implementar el banner

- [ ] **Step 3: Crear `src/data/schedule2026.json`**

```json
[]
```

- [ ] **Step 4: Modificar `src/components/Events/Events.jsx` — cambiar import**

Localizar la línea:
```js
import scheduleData from '../../data/schedule2025.json';
```

Reemplazarla con:
```js
import scheduleData from '../../data/schedule2026.json';
```

- [ ] **Step 5: Añadir el bloque "coming soon" en `Events.jsx`**

Justo antes del `return` principal del componente (después de `handleCloseModal`), añadir:

```jsx
  if (scheduleData.length === 0) {
    return (
      <section id="events" className="event-schedule-section">
        <AnimationWrapper animation="fade-up" duration={1500}>
          <Container>
            <h2 className="text-center margin-top">Agenda 2026</h2>
            <div className="text-center py-5">
              <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📢</p>
              <h3>Ponentes y agenda próximamente</h3>
              <p className="lead mt-3">¡El Call for Papers está abierto!</p>
              <a
                href="https://sessionize.com/xops-conference-2026/"
                className="button menu-btn mt-3"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block' }}
              >
                Proponer charla →
              </a>
            </div>
          </Container>
        </AnimationWrapper>
      </section>
    );
  }
```

- [ ] **Step 6: Ejecutar los tests — deben PASAR**

```bash
npm run test:run -- src/components/Events/Events.test.jsx
```

Resultado esperado:
```
✓ Events component > shows coming-soon banner when schedule is empty
✓ Events component > shows CFP call to action when schedule is empty
✓ Events component > does not show day-filter buttons when schedule is empty
✓ Events component > renders the events section with correct id
```

- [ ] **Step 7: Verificar en browser**

```bash
npm run dev
```

La sección de agenda en la home muestra el banner "📢 Ponentes y agenda próximamente" con el enlace "Proponer charla →". No hay filtros de días ni tracks.

- [ ] **Step 8: Commit**

```bash
git add src/data/schedule2026.json src/components/Events/Events.jsx src/components/Events/Events.test.jsx
git commit -m "feat: empty 2026 schedule with coming-soon banner and CFP link"
```

---

## Task 12: TDD — TriskelGate: mensaje amigable cuando el servicio no responde

**Files:**
- Create: `src/pages/Tickets.test.jsx`
- Modify: `src/pages/Tickets.jsx`

### 12a — Escribir el test primero (debe FALLAR)

- [ ] **Step 1: Crear `src/pages/Tickets.test.jsx`**

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../adapters/triskelgate/client', () => ({
  triskelGateClient: {
    listTicketTypes: vi.fn(),
    createCheckout: vi.fn(),
  },
}));

vi.mock('react-bootstrap', () => ({
  Container: ({ children }) => <div>{children}</div>,
  Row: ({ children, ...p }) => <div>{children}</div>,
  Col: ({ children, ...p }) => <div>{children}</div>,
  Card: ({ children, className }) => <div className={className}>{children}</div>,
  Button: ({ children, onClick, disabled, href, className }) =>
    href
      ? <a href={href} className={className}>{children}</a>
      : <button onClick={onClick} disabled={disabled} className={className}>{children}</button>,
  Spinner: () => <span>Cargando...</span>,
  Alert: ({ children, variant, onClose, dismissible }) => (
    <div role="alert" data-variant={variant}>
      {children}
      {dismissible && <button onClick={onClose}>cerrar</button>}
    </div>
  ),
}));

vi.mock('react-icons/bs', () => ({
  BsCheckCircleFill: () => <span>check</span>,
  BsStar: () => <span>star</span>,
  BsBriefcase: () => <span>brief</span>,
  BsArrowLeft: () => <span>back</span>,
}));

vi.mock('../components/SEO', () => ({ default: () => null }));

import { triskelGateClient } from '../adapters/triskelgate/client';
import Tickets from './Tickets';

const renderTickets = () => render(<BrowserRouter><Tickets /></BrowserRouter>);

describe('Tickets page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.prompt = vi.fn()
      .mockReturnValueOnce('Test User')
      .mockReturnValueOnce('test@example.com');
  });

  it('renders the three ticket tiers', () => {
    renderTickets();
    expect(screen.getByText('EXECUTIVE')).toBeInTheDocument();
    expect(screen.getByText('VIP PASS')).toBeInTheDocument();
    expect(screen.getByText('PARTNER')).toBeInTheDocument();
  });

  it('shows friendly message when TriskelGate is unreachable', async () => {
    triskelGateClient.listTicketTypes.mockRejectedValue(
      new TypeError('Failed to fetch'),
    );

    renderTickets();
    fireEvent.click(screen.getByText('Comprar Ahora'));

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/no está disponible/i);
      expect(alert).toHaveTextContent(/summit@xopsconferences\.com/i);
    });
  });

  it('shows technical error message for non-network failures', async () => {
    triskelGateClient.listTicketTypes.mockRejectedValue(
      new Error('No existe ticket activo "General" en evento 1'),
    );

    renderTickets();
    fireEvent.click(screen.getByText('Comprar Ahora'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/No existe ticket activo/i);
    });
  });
});
```

- [ ] **Step 2: Ejecutar el test — debe FALLAR**

```bash
npm run test:run -- src/pages/Tickets.test.jsx
```

Resultado esperado: FAIL — el catch actual llama `setError(err.message)` sin distinguir errores de red, por lo que el test "friendly message" falla.

### 12b — Implementar el fix

- [ ] **Step 3: Modificar el bloque `catch` en `handlePayment` dentro de `src/pages/Tickets.jsx`**

Localizar el bloque catch (busca `setError(err.message)`):

```js
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
    } finally {
      setLoading(null);
    }
```

Reemplazarlo con:

```js
    } catch (err) {
      console.error('Payment error:', err);
      const isNetworkError =
        err.name === 'TypeError' ||
        (typeof err.message === 'string' && (
          err.message.includes('Failed to fetch') ||
          err.message.includes('NetworkError') ||
          err.message.includes('fetch')
        ));
      setError(
        isNetworkError
          ? 'El sistema de entradas no está disponible en este momento. Escríbenos a summit@xopsconferences.com para reservar tu entrada.'
          : err.message,
      );
    } finally {
      setLoading(null);
    }
```

- [ ] **Step 4: Ejecutar los tests — deben PASAR**

```bash
npm run test:run -- src/pages/Tickets.test.jsx
```

Resultado esperado:
```
✓ Tickets page > renders the three ticket tiers
✓ Tickets page > shows friendly message when TriskelGate is unreachable
✓ Tickets page > shows technical error message for non-network failures
```

- [ ] **Step 5: Ejecutar suite completa — sin regresiones**

```bash
npm run test:run
```

Resultado esperado: todos los tests pasan (número de tests igual o mayor que antes).

- [ ] **Step 6: Verificar en browser**

```bash
npm run dev
```

Navegar a `/tickets`. Sin TriskelGate corriendo en `localhost:3001`, intentar comprar una entrada: debe aparecer el mensaje "El sistema de entradas no está disponible en este momento. Escríbenos a summit@xopsconferences.com..." en lugar del error técnico anterior.

- [ ] **Step 7: Commit final**

```bash
git add src/pages/Tickets.jsx src/pages/Tickets.test.jsx
git commit -m "fix: show friendly contact message when TriskelGate is unreachable"
```

---

## Self-Review

| Req. del spec | Tarea |
|---|---|
| 1. Eliminar Oscar, Armando, Juan Vicente, Roberto | Task 4 |
| 2. Archivar 2025 en eventos anteriores | Task 5 |
| 3. Alineación del header | Task 2 |
| 4. Summit 18-19 noviembre 2026 Madrid | Tasks 6, 7, 8, 9 |
| 5. Conferencia 20-21 noviembre 2026 | Task 3 |
| 6. Ubicación Summit TBD Madrid, conferencia URJC (sin cambio) | Task 8 |
| 7. Agenda Summit estructurada vacía | Task 9 |
| 7. Agenda conferencia estructurada vacía | Task 11 |
| 8. Agendas separadas pero visibles juntas (sin cambio estructural) | — |
| 9. Quitar referencias HackBCN (Hero, Organizers, Helmet) | Tasks 7, 10, 6 |
| 10. Botón idioma muestra ES/EN correctamente | Task 1 |
| 11. Responsiveness preservada | Todas las tareas usan clases Bootstrap existentes |
| 12. TriskelGate error handling amigable | Task 12 |
| 13. AgoraPass | Fuera de scope |
