import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import es from '../i18n/locales/es.json';
import en from '../i18n/locales/en.json';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const PAGE = fs.readFileSync(path.join(HERE, 'CityEventPage.jsx'), 'utf8');
const APP = fs.readFileSync(path.join(HERE, '..', 'App.jsx'), 'utf8');

/**
 * Coherencia de un SOLO dia (26-nov-2026, Antonio por audio).
 *
 * "Al ser un solo dia, tenemos que darle coherencia con respecto a lo que es
 *  el executive summit y la conferencia... hay un boton bien grande que dice
 *  executive summit... hay que darle la vuelta y que no quede solo como un
 *  summit... hay un boton que tendriamos que quitar o que ese boton
 *  directamente redirija el formulario de registro... un unico jornal,
 *  quitamos el ejecutivo, dejamos programa, y ya esta."
 *
 * Estas reglas existian en el copy pero NO tenian ningun test que las
 * sujetara: un cambio de texto podia volver a dejar "Executive Summit" y dos
 * secciones, y nada se enteraba.
 */
describe('Dubái es un solo día: un solo programa, sin Summit ejecutivo', () => {
  it('el bloque grande del hero se llama "Programa", no "Executive Summit"', () => {
    expect(es.cityEvent.experience.summitTitle).toBe('Programa');
    expect(en.cityEvent.experience.summitTitle).toBe('Programme');
    for (const loc of [es, en]) {
      expect(loc.cityEvent.experience.summitTitle).not.toMatch(/executive\s+summit/i);
    }
  });

  it('la sección de la agenda se titula "Programa", no "Programa ejecutivo"', () => {
    expect(es.cityEvent.summit.agendaTitle).toBe('Programa');
    expect(en.cityEvent.summit.agendaTitle).toBe('Programme');
    for (const loc of [es, en]) {
      expect(loc.cityEvent.summit.agendaTitle).not.toMatch(/executive/i);
    }
  });

  it('ningún CTA dice "Explorar Summit" ni "Explore Summit"', () => {
    expect(es.cityEvent.experience.viewSummit).not.toMatch(/summit/i);
    expect(en.cityEvent.experience.viewSummit).not.toMatch(/summit/i);
    expect(es.cityEvent.program.summit.cta).not.toMatch(/summit/i);
    expect(en.cityEvent.program.summit.cta).not.toMatch(/summit/i);
  });

  it('la sección #summit (el bloque del Summit ejecutivo) NO se pinta en Dubái', () => {
    // El bloque existe en el codigo, pero solo para Madrid (que esta
    // aplazado y si tiene dos formatos). En Dubái no debe renderizarse.
    expect(PAGE).toContain('className="city-summit" id="summit"');
    expect(PAGE).toMatch(/\{isMadrid && \(/);
  });

  it('en Dubái los enlaces al programa apuntan a #agenda, no a #summit', () => {
    expect(PAGE).toMatch(/href=\{isMadrid \? '#summit' : '#agenda'\}/);
    // Ningun href="#summit" sin condicion: en Dubai no habria destino.
    const hrefsSinCond = PAGE.match(/href="#summit"/g) || [];
    expect(hrefsSinCond).toHaveLength(0);
  });

  it('los CTA de entrada de Dubái van directos al formulario de registro', () => {
    // "Hay un boton que tendriamos que quitar o que ese boton directamente
    //  redirija el formulario de registro."
    expect(PAGE).toContain('to="/registro"');
    expect(PAGE).not.toContain('to="/dubai?openTickets=1"');
  });

  it('el navbar de Dubái tiene un solo programa y ningún enlace roto', () => {
    // El navbar de Dubái: un "Programa" al programa y "Ponentes". Ni "SUMMIT"
    // (apuntaba a #summit, que ya no se pinta) ni "CONFERENCE" y "AGENDA"
    // apuntando los dos a #agenda.
    expect(APP).toContain("t('nav.program')");
    const inicio = APP.indexOf("activeCity === 'dubai' ? (");
    expect(inicio).toBeGreaterThan(-1);
    // Solo el fragmento de Dubái: el de Madrid va justo despues y si lleva
    // nav.summit (correcto, Madrid tiene dos formatos).
    const ramaDubai = APP.slice(inicio, APP.indexOf(') : (', inicio));
    expect(ramaDubai).not.toContain('nav.summit');
    expect(ramaDubai).not.toContain('nav.conference');
    expect(ramaDubai).toContain('nav.program');
    expect(ramaDubai).toContain('href="#agenda"');
  });

  it('el copy de una jornada no promete dos formatos', () => {
    for (const loc of [es, en]) {
      expect(loc.cityEvent.program.dubaiTitle).toMatch(/one day|una jornada/i);
      const textoDubai = JSON.stringify(loc.cityEvent.program.dubaiTitle) +
        JSON.stringify(loc.cityEvent.program.dubaiSubtitle) +
        JSON.stringify(loc.cityEvent.program.dubaiTrack);
      expect(textoDubai).not.toMatch(/two formats|dos formatos/i);
    }
  });
});
