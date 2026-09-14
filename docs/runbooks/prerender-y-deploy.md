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

```bash
npm run deploy:prod
```

Equivale a `vercel build --prod && vercel deploy --prebuilt --prod`: construye
**en local** (donde Playwright sí funciona) y sube el resultado ya construido.

> **El `git push` a `main` NO publica el prerender.** Ver la sección siguiente.

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

## Consecuencia práctica

| Acción | Resultado |
|---|---|
| `git push` a `main` | Deploy automático **sin** prerender |
| `npm run deploy:prod` | Deploy **con** prerender |

Si alguien pushea a `main` después de un `deploy:prod`, el prerender se pierde
hasta el siguiente `deploy:prod`. Mientras eso siga así, **el último paso tras
mergear a `main` debe ser `npm run deploy:prod`**.

Para automatizarlo, lo correcto es un workflow de GitHub Actions que ejecute el
prerender (donde Playwright sí es fiable) y despliegue con `--prebuilt`.

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
