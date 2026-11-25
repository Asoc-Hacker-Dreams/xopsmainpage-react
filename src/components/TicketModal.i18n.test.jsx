import { describe, it, expect } from 'vitest';
import es from '../i18n/locales/es.json';
import en from '../i18n/locales/en.json';

/**
 * Descripciones de producto e i18n.
 *
 * `ticket_types.description` sólo existe en español en TriskelGate, así que
 * para cualquier otro idioma el copy se sirve desde `tierDescriptions`. Estos
 * tests protegen dos cosas:
 *
 *   1. Que las claves existan en ambos idiomas (si falta una, el comprador ve
 *      la clave cruda o un hueco).
 *   2. Que los textos NO contradigan la matriz de producto. Antes lo hacían:
 *      decían que Daily era de un día y que Summit no incluía Conference.
 */
describe('tierDescriptions', () => {
  const TIERS = ['superEarly', 'early', 'daily', 'lastMinute', 'vip', 'summit'];

  it('define los 6 tiers en ES y EN', () => {
    for (const lang of [es, en]) {
      const td = lang.ticketModal.tierDescriptions;
      for (const tier of TIERS) {
        expect(td[tier], `falta el tier ${tier}`).toBeTruthy();
        expect(td[tier].length).toBeGreaterThan(30);
      }
    }
  });

  it('define los entitlements en ES y EN', () => {
    for (const lang of [es, en]) {
      const ent = lang.ticketModal.entitlements;
      for (const key of ['confDay1', 'confDay2', 'summit', 'dinner', 'workshops']) {
        expect(ent[key], `falta el entitlement ${key}`).toBeTruthy();
      }
    }
  });

  it('"Daily Ticket" es la tarifa estándar de 2 días, no una entrada de un día', () => {
    // §14: Daily NO significa "single day". Es el precio regular del pase
    // completo. El copy anterior decía "Acceso de un día completo".
    expect(es.ticketModal.tierDescriptions.daily).toMatch(/2 días/);
    expect(es.ticketModal.tierDescriptions.daily).not.toMatch(/un día completo/i);
    expect(en.ticketModal.tierDescriptions.daily).toMatch(/2-day/);
    expect(en.ticketModal.tierDescriptions.daily).not.toMatch(/single day/i);
  });

  it('Summit incluye Conference y la speakers dinner', () => {
    // §16: Summit es el producto superior. El copy anterior afirmaba
    // "No incluye la Conferencia", que es justo lo contrario.
    const esS = es.ticketModal.tierDescriptions.summit;
    const enS = en.ticketModal.tierDescriptions.summit;
    expect(esS).toMatch(/Conference/);
    expect(esS).toMatch(/dinner/i);
    expect(esS).not.toMatch(/No incluye la Conferencia/i);
    expect(enS).toMatch(/Conference/);
    expect(enS).toMatch(/dinner/i);
    expect(enS).not.toMatch(/Does not include the Conference/i);
  });

  it('VIP incluye la cena pero NO el Summit', () => {
    // §15: VIP = Conference + dinner. Sin Summit.
    const esV = es.ticketModal.tierDescriptions.vip;
    const enV = en.ticketModal.tierDescriptions.vip;
    expect(esV).toMatch(/dinner/i);
    expect(esV).toMatch(/No incluye Summit/i);
    expect(enV).toMatch(/dinner/i);
    expect(enV).toMatch(/Does not include Summit/i);
  });

  it('ningún copy usa "Full event access" ni "Acceso completo al evento"', () => {
    // §20: prohibido en Conference y VIP — no distingue un pase de 45 € de
    // un Summit de 200 €.
    for (const lang of [es, en]) {
      for (const [tier, text] of Object.entries(lang.ticketModal.tierDescriptions)) {
        expect(text, `${tier} usa copy prohibido`).not.toMatch(/Full event access/i);
        expect(text, `${tier} usa copy prohibido`).not.toMatch(/Acceso completo al evento/i);
      }
    }
  });

  it('las 4 fases de Conference declaran las mismas exclusiones', () => {
    // Son fases de precio del MISMO producto: si una promete algo que otra
    // no, el comprador percibe productos distintos donde no los hay.
    for (const lang of [es, en]) {
      const td = lang.ticketModal.tierDescriptions;
      for (const tier of ['superEarly', 'early', 'daily', 'lastMinute']) {
        expect(td[tier], `${tier} no excluye Summit`).toMatch(/Summit/);
        expect(td[tier], `${tier} no menciona los 2 días`).toMatch(/2 días|2-day/);
      }
    }
  });

  it('no quedan claves huérfanas de ticketModal.features', () => {
    // Sustituidas por el desglose de entitlements. Si reaparecen es que
    // alguien volvió al render con texto fijo.
    expect(es.ticketModal.features).toBeUndefined();
    expect(en.ticketModal.features).toBeUndefined();
  });
});

// Una sola entrada general en Dubái (2026-11-25): tierDescriptionsDubai sólo tiene
// la clave de la entrada general; entitlementsDubai ya no tiene legacyDay.
describe('tierDescriptionsDubai / entitlementsDubai (una sola entrada)', () => {
  it('existen en ES y EN con una sola clave general', () => {
    for (const lang of [es, en]) {
      const td = lang.ticketModal.tierDescriptionsDubai;
      expect(Object.keys(td).sort()).toEqual(['general']);
      expect(td.general.length).toBeGreaterThan(30);
      const ent = lang.ticketModal.entitlementsDubai;
      expect(Object.keys(ent).sort()).toEqual(['conference', 'summit']);
    }
  });

  it('el copy general no contiene Summit, Conference como entidades ni precio regular', () => {
    for (const lang of [es, en]) {
      const text = lang.ticketModal.tierDescriptionsDubai.general;
      expect(text).not.toMatch(/Summit/i);
      expect(text).not.toMatch(/al precio regular|regular price/i);
      expect(text).toMatch(/30 de noviembre|30 November/);
    }
  });

  it('las etiquetas de entitlement no contienen día 1, día 2 ni producto inexistente', () => {
    for (const lang of [es, en]) {
      const ent = lang.ticketModal.entitlementsDubai;
      for (const [k, v] of Object.entries(ent)) {
        expect(v, k).not.toMatch(/día 1|día 2|day 1|day 2/i);
        expect(v, k).not.toMatch(/Summit|Conference/i);
      }
    }
  });
});

// El botón de reserva compone 'Reservar Entrada' + el nombre del tipo. Con el nombre
// 'Entrada General' eso daba 'Reservar Entrada Entrada General' (duplicado). La entrada
// general es la ÚNICA de Dubái, así que el nombre ya lo dice todo y no hay que repetirlo.
describe('botón de reserva con la entrada general', () => {
  it('no duplica "Entrada" en el texto del botón', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const here = path.dirname(new URL(import.meta.url).pathname);
    const src = fs.readFileSync(path.join(here, 'TicketModal.jsx'), 'utf8');
    // El caso especial debe existir y cubrir exactamente el nombre de la entrada general.
    expect(src).toContain("tt.name === 'Entrada General'");
    // Y la concatenación que producía el duplicado no debe quedar incondicional.
    const condicional = src.indexOf("tt.name === 'Entrada General'");
    const concatenacion = src.indexOf(
      "`${t('ticketModal.checkout.title')} ${tt.name}`",
    );
    expect(condicional).toBeGreaterThan(-1);
    // La concatenación sigue existiendo, pero SOLO como rama alternativa del ternario.
    expect(concatenacion).toBeGreaterThan(condicional);
    expect(src.slice(condicional, concatenacion)).toContain('?');
  });
});

// Rondas de revisión (Codex, 25-nov-2026): con una sola entrada, el copy de las CONDICIONES DE
// COMPRA y el de la PÁGINA DE LA CIUDAD no pueden seguir hablando de dos productos (Summit el
// 30-nov y Conference el 1-dic). Además el filtro de identidad tiene que admitir slugs con
// guion bajo (en JS `\w` incluye `_`, así que `\b` no separa después de un guion bajo).
describe('una sola jornada en Dubái (condiciones y copy de ciudad)', () => {
  it('las condiciones de compra de Dubái no anuncian un segundo día ni dos productos', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const here = path.dirname(new URL(import.meta.url).pathname);
    const src = fs.readFileSync(path.join(here, '..', 'legal', 'termsContent.js'), 'utf8');
    const dubai = src.split("dubai: {")[1] ?? '';
    for (const viejo of [
      'Conference on 1 December 2026',
      'Tuesday 1 December 2026',
      'Conference el 1 de diciembre',
      'martes 1 de diciembre',
      'on both days',
      'los dos días',
    ]) {
      expect(dubai, viejo).not.toContain(viejo);
    }
    // Y sí debe decir la jornada única y conservar los derechos ya adquiridos.
    expect(dubai).toContain('Monday 30 November 2026');
    expect(dubai).toContain('lunes 30 de noviembre de 2026');
    expect(dubai).toMatch(/keep the rights registered|Tickets already issued/);
    expect(dubai).toMatch(/conservan los derechos|ya emitidas/);
  });

  it('el copy propio de Dubái existe en ES y EN y Madrid conserva el suyo', () => {
    for (const lang of [es, en]) {
      const p = lang.cityEvent.program;
      expect(p.dubaiTitle, 'dubaiTitle').toBeTruthy();
      expect(p.dubaiSubtitle, 'dubaiSubtitle').toBeTruthy();
      expect(p.dubaiTrack.h3, 'dubaiTrack.h3').toBeTruthy();
      expect(p.dubaiTrack.text, 'dubaiTrack.text').toBeTruthy();
      expect(p.dubaiTrack.cta, 'dubaiTrack.cta').toBeTruthy();
      // El copy de Madrid no se toca.
      expect(p.title).toMatch(/Dos formatos|Two formats/);
      expect(p.summit.h3).toBeTruthy();
    }
  });

  it('el filtro de identidad acepta slugs con guion bajo pero no XopsPartner', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const here = path.dirname(new URL(import.meta.url).pathname);
    const src = fs.readFileSync(path.join(here, 'TicketModal.jsx'), 'utf8');
    const m = src.match(/const XOPS_IDENTITY = (\/.*?\/i);/);
    expect(m, 'no se encuentra XOPS_IDENTITY').toBeTruthy();
    const re = new RegExp(m[1].replace(/^\/|\/[a-z]*$/g, ''), 'i');
    for (const ok of ['xops_dubai_2026', 'x_ops_dubai_2026', 'xops-dubai-2026', 'X-Ops Conference']) {
      expect(re.test(ok), ok).toBe(true);
    }
    for (const no of ['XopsPartner', 'xopspartner']) {
      expect(re.test(no), no).toBe(false);
    }
  });
});

// Coherencia tarjeta <-> condiciones. La Entrada General tiene entitlements=['CONF_D1']
// (verificado en la BD): NO incluye SUMMIT (sesiones de liderazgo) ni DINNER (cena). La
// tarjeta lo muestra con una X roja, asi que las condiciones de compra NO pueden
// prometer esas sesiones para esta entrada.
describe('coherencia entre la tarjeta y las condiciones de compra', () => {
  it('las condiciones no prometen liderazgo ni cena para la Entrada General', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const here = path.dirname(new URL(import.meta.url).pathname);
    const src = fs.readFileSync(path.join(here, '..', 'legal', 'termsContent.js'), 'utf8');
    const dubai = src.split('dubai: {')[1] ?? '';
    // La frase de la Entrada General debe excluir liderazgo y cena, no incluirlos.
    const es = dubai.match(/'La Entrada General[^']*'/)?.[0] ?? '';
    const en = dubai.match(/'The General Admission[^']*'/)?.[0] ?? '';
    expect(es).toMatch(/No incluye las sesiones de liderazgo, la cena con ponentes/);
    expect(en).toMatch(/does not include the leadership sessions, the speakers dinner/);
    // Y no puede decir que las incluye.
    expect(es).not.toMatch(/Incluye todas las sesiones técnicas, las sesiones de liderazgo/);
    expect(en).not.toMatch(/It includes all technical sessions, leadership sessions/);
  });
});

// La portada y la página de ciudad no pueden seguir presentando Dubái como dos
// productos (Summit + Conference) cuando solo hay una jornada y una entrada.
describe('la portada y la página de ciudad de Dubái no muestran dos productos', () => {
  it('Dubái tiene copy propio de una sola jornada en ES y EN', () => {
    for (const lang of [es, en]) {
      expect(lang.cityEvent.hero.dubaiStatement, 'dubaiStatement').toBeTruthy();
      expect(lang.cityEvent.hero.dubaiStatement).not.toMatch(/dos experiencias|two experiences/i);
      expect(lang.cityEvent.hero.dubaiNavSummit, 'dubaiNavSummit').toBeTruthy();
      const dubai = lang.editions.dubai;
      expect(dubai.summit.dubaiLabel, 'summit.dubaiLabel').toBeTruthy();
      expect(dubai.conference.dubaiLabel, 'conference.dubaiLabel').toBeTruthy();
      // El badge no debe anunciar dos productos.
      expect(dubai.badges.format).not.toMatch(/Summit \+ Conference/);
      expect(dubai.badges.format).not.toMatch(/One day: Summit/);
    }
  });

  it('el componente CityCard sabe pintar una sola sede (singleVenue)', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const here = path.dirname(new URL(import.meta.url).pathname);
    const src = fs.readFileSync(path.join(here, 'EditionsSection.jsx'), 'utf8');
    expect(src).toMatch(/singleVenue = false/);
    expect(src).toMatch(/\{!singleVenue && \(/);
    // Y la tarjeta de Dubái lo activa.
    expect(src).toMatch(/singleVenue\s*\n/);
  });
});

// El filtro de marcadores de prueba usaba \b, que en JS no separa después de un guion
// bajo: un evento de pruebas con slug 'xops_dubai_qa' se colaba en el modal de entradas.
// Se fija aquí el comportamiento para que no vuelva a colarse.
describe('el filtro de eventos de pruebas cubre los separadores de slug', () => {
  it('detecta los marcadores separados por guion bajo, guion o espacio', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const here = path.dirname(new URL(import.meta.url).pathname);
    const src = fs.readFileSync(path.join(here, 'TicketModal.jsx'), 'utf8');
    const m = src.match(/const TEST_EVENT_MARKERS = (\/.*?\/i);/);
    expect(m, 'no se encuentra TEST_EVENT_MARKERS').toBeTruthy();
    const re = new RegExp(m[1].replace(/^\/|\/[a-z]*$/g, ''), 'i');
    for (const marcador of ['xops_dubai_qa', 'xops_dubai_test', 'xops_dubai_sandbox', 'qa', 'test-qa', 'xops-qa', 'X-Ops TEST - QA privado']) {
      expect(re.test(marcador), marcador).toBe(true);
    }
    // Y no debe lanzar falsos positivos sobre nombres legitimos.
    for (const ok of ['X-Ops Conference Dubai 2026', 'latest conference', 'opqa', 'testing lab']) {
      expect(re.test(ok), ok).toBe(false);
    }
  });
});
