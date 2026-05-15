# X-Ops Conference 2026 — Actualización de la web

**Fecha:** 2026-05-15  
**Repositorio:** `xopsmainpage-react`  
**Scope:** Actualización de contenido, fechas, estructura de archivo, agenda vacía 2026 y corrección de bugs.

---

## Contexto

El evento X-Ops Conference 2025 ya se celebró. La web necesita:
1. Archivar el evento 2025 en el menú de eventos anteriores.
2. Preparar la web para la edición 2026 (nuevas fechas, nueva ubicación del summit, sin ponentes aún).
3. Limpiar referencias obsoletas (organizadores retirados, HackBCN).
4. Corregir bugs existentes (idioma, cabecera, TriskelGate).

---

## Eventos 2026

| Evento | Día | Ubicación |
|--------|-----|-----------|
| X-Ops Summit | Jueves 19 noviembre 2026 | Madrid — Lugar por confirmar (TBD) |
| X-Ops Conference | Viernes 20 y sábado 21 noviembre 2026 | URJC Campus Móstoles, Madrid |

---

## Cambios por área

### 1. Organizers.jsx — Eliminar 4 organizadores

**Archivo:** `src/components/Organizers.jsx`

Eliminar los bloques completos de:
- Roberto Gonzalez
- Juan Vicente Herrera Ruiz de Alejo
- Oscar Cortes Bracho
- Armando Felipe Fuentes Denis

Quedan: Francisco Arencibia, Antonio Juanilla, Clara Contreras.

Actualizar el `<Helmet>` title/description para que diga "Madrid 2026" en lugar de "Madrid 2025".

---

### 2. Archivo 2025 — Añadir al menú de navegación

**Archivo:** `src/App.jsx` (NavDropdown "Eventos Anteriores")

Las páginas de archivo 2025 ya existen con datos correctos:
- `/archive/2025/Speakers2025` → `Speakers2025.jsx`
- `/archive/2025/Events2025` → `Events2025.jsx`

Solo falta añadir una sección en el dropdown, encima de la sección 2024, con el mismo patrón:

```
[divider]
X-Ops Conference Madrid 2025
  - Ponentes → /archive/2025/Speakers2025
  - Agenda → /archive/2025/Events2025
[divider]
X-Ops Conference Madrid 2024
  ...
```

Añadir clave `"xops2025"` a `es.json` y `en.json` bajo `archive`:
- ES: `"X-Ops Conference Madrid 2025"`
- EN: `"X-Ops Conference Madrid 2025"`

No modificar el contenido de los archivos de archivo 2025 — usarlos tal cual.

---

### 3. Fechas — Actualizar a 2026

#### 3a. Conferencia principal

**Archivos:** `src/i18n/locales/es.json`, `src/i18n/locales/en.json`

- ES `hero.date`: `"Fecha: 20 y 21 de noviembre 2026"`
- EN `hero.date`: `"Date: November 20-21, 2026"`
- ES `footer.copyright`: `"© 2026 - X-Ops Conference"`
- EN `footer.copyright`: `"© 2026 - X-Ops Conference"`

#### 3b. Summit

**Archivo:** `src/components/Summit/SummitHero.jsx`
- Título: `X-Ops Summit Madrid 2026`
- Fecha mostrada: `19 de noviembre 2026`
- Ubicación mostrada: `Madrid · Lugar por confirmar`
- Eliminar "paralelo a HackBCN Con" del texto descriptivo
- Eliminar la sección early bird (precios y descuentos aún no confirmados para 2026)

**Archivo:** `src/pages/Summit.jsx` (Helmet)
- title: `"X-Ops Summit Madrid 2026 | Evento Ejecutivo para Decision Makers"`
- description: sin mención a HackBCN ni Barcelona

**Archivos i18n** `es.json` y `en.json`, sección `summit`:
- Actualizar a Madrid 2026, eliminar referencias a HackBCN

---

### 4. Ubicaciones

#### Summit — `src/components/Summit/SummitLocation.jsx`
- Venue: `"Madrid — Lugar por confirmar"`  
- Dirección: `"Por anunciar próximamente"`
- Quitar instrucciones de transporte específicas de Barcelona (Metro L4, Tranvía T4)
- Quitar el mapa de Google Maps de Barcelona; reemplazar con un `<div>` placeholder que diga "Mapa disponible próximamente" (sin iframe de Google Maps hasta confirmar venue)

#### Conferencia — `src/components/Ubication.jsx`
- Sin cambios. Ya apunta a URJC Campus Móstoles (correcto).

#### Footer — `src/i18n/locales/es.json` y `en.json`
- Sin cambios. Ya dice URJC Móstoles (correcto para la conferencia).

---

### 5. Agenda 2026 — Estructura vacía

#### 5a. Summit — `src/components/Summit/ExecutiveAgenda.jsx`

Reducir de 2 días a **1 día** (jueves 19 de noviembre). Conservar los tipos de sesión (keynote, talk, panel, workshop, break) pero reemplazar los contenidos por placeholders:

- Mantener los breaks con horario: café de bienvenida, almuerzo ejecutivo, cocktail de cierre.
- Los slots de charlas: title = "Por anunciar", speaker = "TBD".
- Actualizar los botones del selector de días para mostrar solo "19 Nov".
- Actualizar título de la sección: "Programa Ejecutivo — Por confirmar".

#### 5b. Conferencia — `src/components/Events/Events.jsx` + nuevo JSON

Crear `src/data/schedule2026.json` vacío (array `[]`).

Actualizar `Events.jsx`:
- Importar `schedule2026.json` en lugar de `schedule2025.json`.
- Si el JSON está vacío, mostrar un banner de "Coming Soon":
  ```
  📢 Ponentes y agenda próximamente
  ¡El Call for Papers está abierto!  [Botón: Proponer charla →]
  ```
- Mantener la estructura de filtros (días, tracks) pero ocultarlos cuando no hay datos.

---

### 6. Eliminar referencias a HackBCN

| Archivo | Cambio |
|---------|--------|
| `SummitHero.jsx` | Eliminar "paralelo a HackBCN Con" |
| `SummitOrganizers.jsx` | Cambiar subtítulo ("...en colaboración con HackBCN" → solo "X-Ops Conferences"). Eliminar el bloque de logos HackBCN × X-Ops. |
| `Summit.jsx` (Helmet) | Quitar "HackBCN" de keywords y description |
| `es.json` `summit.description` | Quitar referencia a HackBCN |

---

### 7. Bug — Botón de idioma no muestra "ES"

**Archivo:** `src/i18n/locales/en.json`

Añadir la clave faltante bajo `language`:
```json
"switch": "ES"
```

El botón en `App.jsx` usa `{t('language.switch')}`. En `es.json` esto es `"EN"` (correcto). En `en.json` la clave no existe, por lo que siempre muestra la clave sin traducir. Con el fix, al cambiar a inglés el botón mostrará `"ES"`.

---

### 8. Bug — Alineación del header

**Archivo:** `src/styles/Custom.css`

El `.header` tiene `padding-top: 40px` con `height: 85px`, lo que desplaza el logo visualmente hacia abajo respecto a los elementos del menú (que están centrados por Bootstrap).

Fix:
```css
.header {
  padding-top: 10px;   /* reducir de 40px */
  padding-bottom: 10px;
  display: flex;
  align-items: center;
}
```

Verificar que en mobile el toggle siga alineado correctamente.

---

### 9. Bug — TriskelGate error en compra de entradas

**Archivo:** `src/pages/Tickets.jsx`

El fallo ocurre porque `VITE_TRISKELL_API_BASE_URL=http://localhost:3001` no es accesible fuera del entorno local.

Solución a corto plazo: envolver la llamada en `handlePayment` con un catch que distinga entre errores de red (servidor no disponible) y errores de negocio, y mostrar un mensaje amigable:

```
Compra de entradas temporalmente no disponible.
Escríbenos a summit@xopsconferences.com para reservar tu entrada.
```

El botón "Contactar" (tier Partner) ya funciona redirigiendo a email — usar ese mismo patrón como fallback para todos los tiers cuando TriskelGate no responde.

**Archivo `.env`**: Sin cambios por ahora (se mantiene localhost para pruebas locales).

---

## Responsiveness

Todos los cambios respetan las clases Bootstrap existentes (`d-flex`, `justify-content-center`, `Col md={x}`, etc.). No se introduce CSS nuevo excepto la corrección del header. El componente `Events` con el banner "Coming Soon" usará las mismas clases de layout que los cards actuales.

---

## Fuera de scope (ítem #13)

La integración "Conecta tu AgoraPass" se evalúa en un ciclo posterior, separado de esta actualización.

---

## Archivos afectados

| Archivo | Tipo de cambio |
|---------|---------------|
| `src/components/Organizers.jsx` | Eliminar 4 bloques + actualizar Helmet |
| `src/App.jsx` | Añadir sección 2025 en NavDropdown |
| `src/components/Summit/SummitHero.jsx` | Fechas, ciudad, eliminar HackBCN |
| `src/components/Summit/SummitLocation.jsx` | Reemplazar ubicación Barcelona por TBD Madrid |
| `src/components/Summit/ExecutiveAgenda.jsx` | Reducir a 1 día, vaciar charlas |
| `src/components/Summit/SummitOrganizers.jsx` | Quitar HackBCN logo y texto |
| `src/pages/Summit.jsx` | Actualizar Helmet |
| `src/components/Events/Events.jsx` | Usar schedule2026.json + banner coming soon |
| `src/data/schedule2026.json` | Crear — array vacío |
| `src/i18n/locales/es.json` | Fechas 2026, agregar xops2025 al archive, summit sin HackBCN |
| `src/i18n/locales/en.json` | Fechas 2026, agregar xops2025 al archive, añadir `language.switch` |
| `src/styles/Custom.css` | Fix padding-top del header |
| `src/pages/Tickets.jsx` | Error handling gracioso para TriskelGate offline |
