# Prerender y despliegue a producción

## Resumen

La web es una SPA de Vite: el HTML servido lleva `<div id="root"></div>` vacío
y todo el contenido lo pinta React en el navegador. Los crawlers de IA
(Claude, ChatGPT, Gemini) y cualquier bot que no ejecute JavaScript veían
**cero contenido**.

La solución es un **prerender estático**: tras `vite build`, se renderizan las
rutas con un navegador real y se guarda el HTML resultante. Un crawler recibe
entonces entre 5.500 y 14.200 caracteres de texto real por ruta.

## Cómo desplegar a producción

**Haz merge a `main`.** El workflow `.github/workflows/deploy-production.yml`
prerenderiza, despliega y verifica producción automáticamente. No hay pasos
manuales.

El auto-deploy de Vercel para `main` está **desactivado** en `vercel.json`
(`git.deploymentEnabled.main = false`) porque su build no puede prerenderizar
y pisaba el despliegue bueno. El workflow es la única vía a producción.

El workflow falla y **no publica** si alguna ruta no se prerenderizó, y falla
**después** de publicar si alguna ruta no responde 200 o si la home sirve
menos de 1.000 caracteres sin JS. En ese caso avisa de que hay que revertir.

### Despliegue manual (respaldo)

Si GitHub Actions no está disponible:

```bash
npm run deploy:prod
```

Equivale a `vercel build --prod && vercel deploy --prebuilt --prod`: construye
**en local** (donde Playwright sí funciona) y sube el resultado ya construido.

Tras desplegar, verifica que el alias apunta al deploy nuevo:

```bash
vercel ls | head -5
curl -s https://www.xopsconference.com/summit | grep -o '<title>[^<]*</title>'
```

El título debe ser el de `/summit`, no el de la home. Si es el de la home, el
alias se quedó en un deploy anterior (pasa después de un `vercel rollback`):

```bash
vercel promote <url-del-deploy-nuevo> --yes
```

## Por qué el build de Vercel no puede prerenderizar

El prerender usa Playwright. En el contenedor de build de Vercel, Chromium
arranca y muere al instante:

```
chrome-headless-shell: error while loading shared libraries:
libnspr4.so: cannot open shared object file: No such file or directory
```

`playwright install --with-deps` instalaría esas librerías, pero usa `apt-get`
y necesita root, que no está disponible. Alternativas descartadas:

- **jsdom**: no ejecuta `<script type="module">`, y Vite genera solo ESM.
  Verificado: el `root` queda con 0 hijos.
- **@sparticuz/chromium**: 70 MB, desproporcionado para un build.

Por eso `build:vercel` deja el prerender como *best-effort*: si Chromium no
arranca, **el build no falla** y se publica la SPA sin prerender. Así un push
nunca tumba el sitio, pero tampoco publica el prerender.

Por eso el auto-deploy de `main` está desactivado y el despliegue lo hace
GitHub Actions, donde Playwright sí funciona.

### Histórico: por qué se desactivó el auto-deploy

Antes de existir el workflow, un push a `main` lanzaba un deploy automático que
publicaba **sin** prerender y pisaba el despliegue bueno en menos de un minuto
(detectado porque el contenido sin JS volvía a 0 chars). Ocurrió dos veces.
`git.deploymentEnabled.main = false` lo elimina de raíz.

Comprobación rápida si se sospecha que producción está sin prerender:

```bash
curl -s "https://www.xopsconference.com/summit" | grep -o '<title>[^<]*</title>'
```

Si devuelve el título de la home en vez del de `/summit`, está sin prerender.

## Secretos de GitHub Actions

| Secret | Valor | Sensible |
|---|---|---|
| `VERCEL_ORG_ID` | `team_nz5iDr7HebgxPE1IaCMz7YiN` | No |
| `VERCEL_PROJECT_ID` | `prj_cnKqFKpNChFdqm9JJobNbkQ8jfEI` | No |
| `VERCEL_TOKEN` | Token de acceso de Vercel | **Sí** |

El token se crea en <https://vercel.com/account/tokens> con alcance al equipo
`hsm-projects` y se guarda con:

```bash
gh secret set VERCEL_TOKEN --repo Asoc-Hacker-Dreams/xopsmainpage-react
```

Usa un token **dedicado** al CI, no el de tu sesión local de la CLI: así se
puede revocar sin afectar a tu equipo y el alcance queda acotado.

## Rutas

`scripts/prerender-routes.mjs` es la **fuente única** de rutas, consumida por
el sitemap (`vite.config.js`) y por el prerender. Estaban duplicadas y habrían
divergido.

Solo se prerenderizan las 23 rutas de contenido estable. Las 21 restantes
(`/tickets`, `/wallet`, `/sophia`, `/checkout/*`…) son dinámicas y caen al
fallback SPA.

## El routing es frágil: no tocar sin verificar

`vercel.json` debe dejar que el filesystem gane antes del fallback SPA:

```json
{
  "buildCommand": "npm run build:vercel",
  "rewrites": [{ "source": "/:path*", "destination": "/index.html" }]
}
```

Vercel aplica `handle: filesystem` **antes** de los `rewrites`, así que
`/summit` sirve `/summit/index.html` y `/tickets` cae a `/index.html`.

Dos configuraciones que **rompieron producción** y no deben repetirse:

1. `"rewrites": [{"source": "/(.*)", "destination": "/"}]` — devuelve la home
   para toda ruta y anula el prerender por ruta.
2. `"cleanUrls": true` — genera reglas 308 que interceptan antes del
   filesystem y dejaron `/tickets`, `/wallet`, `/sophia` y `/checkout/cancel`
   en **404**, tumbando el flujo de compra.

Verifica **siempre** antes de desplegar a producción, incluyendo rutas
prerenderizadas y dinámicas:

```bash
for r in / /summit /agenda /tickets /wallet /sophia /checkout/cancel; do
  printf "%-20s " "$r"
  curl -s -o /dev/null -w "%{http_code}\n" "https://www.xopsconference.com$r"
done
```

Las rutas dinámicas (`/tickets` sobre todo) son las que fallan primero.

## Otros dos fallos que ya se corrigieron

1. **`public/index.html` era un fichero muerto.** Vite usa el `index.html` de
   la raíz como entry point. Todo el SEO escrito allí (OG, Twitter cards,
   JSON-LD) nunca llegó a producción. Se consolidó en el de la raíz y se borró
   el duplicado. **No recrear `public/index.html`.**

2. **`vite-plugin-sitemap` sobrescribía `public/robots.txt`** en cada build
   (`generateRobotsTxt: true` por defecto), reduciéndolo de 544 B a 71 B y
   borrando el bloque de AI crawlers. Ahora `generateRobotsTxt: false`.

## Nota: `pnpm-lock.yaml` local

Si `vercel build` falla con `Command "pnpm install" exited with 1`, es que hay
un `pnpm-lock.yaml` en el directorio (está en `.gitignore`, pero puede existir
en local). El repo usa npm; bórralo o muévelo.
