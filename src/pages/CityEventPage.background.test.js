import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import es from '../i18n/locales/es.json';
import en from '../i18n/locales/en.json';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const PAGE = fs.readFileSync(path.join(HERE, 'CityEventPage.jsx'), 'utf8');
const CSS = fs.readFileSync(path.join(HERE, 'CityEventPage.css'), 'utf8');
const ASSETS = path.join(HERE, '..', 'assets');

/**
 * El fondo de Dubái (26-nov-2026, Antonio por audio):
 * "Al ser la web de Dubái debería tener un fondo también al estilo Dubái, un
 *  fondo coherente con la ciudad, para que sea llamativa. Está muy simple."
 *
 * Estos tests fijan las tres cosas que lo hacen funcionar. Las tres se
 * rompieron por separado durante la implementación y ninguna estaba atada:
 *
 *  1. La foto va DENTRO del hero. Fuera, el position:absolute la referencia
 *     al <main> y queda tapada.
 *  2. Va en un <picture> real, no en un pseudo-elemento: la sintaxis
 *     `url(x) type('image/avif')` es de image-set(), no de background-image.
 *  3. Los tres formatos se importan explicitamente: el nombre con hash del
 *     bundler no permite derivar las URLs de los otros (mismo bug que
 *    “为什么 no se veía el logo”).
 */
describe('el fondo de Dubái', () => {
  it('la foto se pinta DENTRO del hero, no en el <main>', () => {
    const iHero = PAGE.indexOf('className="city-hero"');
    const iPicture = PAGE.indexOf('{city === \'dubai\' && dubaiSkylinePicture}');
    expect(iHero).toBeGreaterThan(-1);
    expect(iPicture).toBeGreaterThan(-1);
    // La foto va despues de abrir el hero: esta dentro.
    expect(iPicture).toBeGreaterThan(iHero);
    // Y el picture se define una sola vez (no duplicado fuera).
    expect(PAGE.split('dubaiSkylinePicture}').length - 1).toBe(1);
  });

  it('la foto se sirve en un <picture> con las tres versiones', () => {
    // Un pseudo-elemento no puede servir varias versiones con type(): eso es
    // image-set(), no background-image.
    expect(PAGE).toContain('<picture className="city-hero__photo"');
    expect(PAGE).toContain('type="image/avif"');
    expect(PAGE).toContain('type="image/webp"');
    expect(PAGE).toContain('<img src={dubaiSkylineJpg}');
    // Y no se intenta montar un fondo con image-set() en CSS (eso solo
    // funciona en image-set(), no en background-image). Se ignoran los
    // comentarios, que es donde se explica el motivo.
    const cssSinComentarios = CSS.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(cssSinComentarios).not.toMatch(/type\('image\/avif'\)/);
  });

  it('los tres formatos se importan explicitamente', () => {
    expect(PAGE).toContain("import dubaiSkylineJpg from '../assets/dubai-skyline.jpg'");
    expect(PAGE).toContain("import dubaiSkylineAvif from '../assets/dubai-skyline.avif'");
    expect(PAGE).toContain("import dubaiSkylineWebp from '../assets/dubai-skyline.webp'");
  });

  it('los tres ficheros existen y no son desmesurados', () => {
    for (const f of ['dubai-skyline.jpg', 'dubai-skyline.avif', 'dubai-skyline.webp']) {
      const p = path.join(ASSETS, f);
      expect(fs.existsSync(p), `falta ${f}`).toBe(true);
      // Un fondo de hero no puede pesar medio megabyte.
      expect(fs.statSync(p).size, `${f} pesa demasiado`).toBeLessThan(350 * 1024);
    }
  });

  it('la foto lleva un velo de contraste para el texto', () => {
    // Sin el velo, el texto blanco compite con la foto.
    expect(CSS).toMatch(/\.city-page--dubai \.city-hero::after \{[^}]*linear-gradient/);
    // Y el contenido del hero queda por encima de la foto.
    expect(CSS).toMatch(/\.city-page--dubai \.city-hero__content \{[^}]*z-index:\s*1/);
  });

  it('Madrid NO lleva la foto de Dubái', () => {
    // La foto es solo de Dubái: Madrid tiene su propia pagina y esta aplazada.
    expect(PAGE).toContain("{city === 'dubai' && dubaiSkylinePicture}");
    expect(PAGE).not.toMatch(/city-page--madrid[^{]*\{[^}]*dubaiSkyline/);
  });

  it('en vertical (movil) el encuadre se ajusta para que se vea la torre', () => {
    // Con el recorte 16:9 en vertical el Burj Khalifa queda fuera y la foto
    // se ve como un cielo liso: la web sigue pareciendo "simple". Con un
    // media query el encuadre se mueve a la derecha, donde esta la torre.
    expect(CSS).toMatch(/@media \(max-width: 767px\)/);
    const iMedia = CSS.indexOf('@media (max-width: 767px)');
    expect(iMedia).toBeGreaterThan(-1);
    const bloqueMovil = CSS.slice(iMedia, iMedia + 700);
    expect(bloqueMovil).toMatch(/object-position/);
    // Y el velo se refuerza en vertical, porque el texto ocupa casi todo el ancho.
    expect(bloqueMovil).toMatch(/city-page--dubai \.city-hero::after/);
  });

  it('el copy de la pagina sigue siendo el de un solo día', () => {
    // El fondo no puede resucitar el "Executive Summit" que se quito.
    for (const loc of [es, en]) {
      expect(loc.cityEvent.experience.summitTitle).toBe(
        loc === es ? 'Programa' : 'Programme',
      );
    }
  });
});
