import { describe, expect, test } from 'vitest';
import { dubaiProgramme2026, dubaiVenue } from './dubaiProgramme2026';
import { dubaiAcceptedSessions2026, dubaiSpeakers2026 } from './dubaiAcceptedSessions2026';

const minutes = (a, b) => {
  const [ah, am] = a.split(':').map(Number);
  const [bh, bm] = b.split(':').map(Number);
  return (bh * 60 + bm) - (ah * 60 + am);
};

describe('Dubai 2026 single-day programme', () => {
  const items = dubaiProgramme2026.items;
  const talks = items.filter((x) => x.sessionId);

  test('one day on 30 November 2026 at the confirmed venue, capacity 90', () => {
    expect(dubaiProgramme2026.date).toBe('2026-11-30');
    expect(dubaiProgramme2026.timezone).toBe('Asia/Dubai');
    expect(dubaiProgramme2026.venue).toBe('DKP Conference Centre, Dubai Knowledge Park (TECOM), Dubai');
    expect(dubaiVenue).toBe(dubaiProgramme2026.venue);
    expect(dubaiProgramme2026.capacity).toBe(90);
    expect(dubaiProgramme2026.summit).toBeUndefined();
    expect(dubaiProgramme2026.conference).toBeUndefined();
  });

  test('10 accepted talks, unique, all present in the session dataset', () => {
    expect(talks).toHaveLength(11);
    const ids = talks.map((x) => x.sessionId);
    expect(new Set(ids).size).toBe(11);
    expect([...ids].sort()).toEqual(Object.keys(dubaiAcceptedSessions2026).sort());
  });

  test('slots are ordered, non-overlapping and match the talk durations', () => {
    let last = '00:00';
    for (const slot of items) {
      expect(slot.start >= last).toBe(true);
      expect(minutes(slot.start, slot.end)).toBeGreaterThan(0);
      last = slot.end;
      if (slot.sessionId) {
        expect(minutes(slot.start, slot.end)).toBe(dubaiAcceptedSessions2026[slot.sessionId].durationMinutes);
      }
    }
    expect(items[0].start).toBe('09:00');
    expect(items[items.length - 1].end).toBe('17:45');
  });

  test('confirmed schedule matches xops/agenda_jornada_unica_dubai.md', () => {
    const placed = Object.fromEntries(talks.map((x) => [x.sessionId, [x.start, x.end]]));
    expect(placed).toEqual({
      '1341342': ['09:15', '09:45'], // Daria Kasatkina
      '1319799': ['09:45', '10:15'], // Valeria Bogatyreva
      '1318615': ['10:30', '11:00'], // Harmeet Singh
      '1315380': ['11:00', '11:30'], // Ashish Jaiswal
      '1339445': ['11:30', '12:00'], // Ravindra Verma
      '1321418': ['12:00', '12:30'], // Hannah Suarez
      '1343214': ['13:20', '14:10'], // Jay Prajapat
      '1345297': ['14:10', '14:40'], // Rishi Mondal
      '1317552': ['14:40', '15:10'], // Sonia Valeja
      '1289422': ['15:25', '16:15'], // David Padilla (solo)
      '1322277': ['16:45', '17:15'], // Sergei Pronin (Solanica) — confirmado por escrito el 25-nov
    });
  });

  test('Victor Perez is not attributed to the Game of Bounties talk; Klavs is not on Ashish talk', () => {
    expect(dubaiAcceptedSessions2026['1289422'].speakers).toHaveLength(1);
    expect(dubaiSpeakers2026[dubaiAcceptedSessions2026['1289422'].speakers[0]].name).toBe('David Padilla Alvarado');
    expect(dubaiAcceptedSessions2026['1315380'].speakers).toHaveLength(1);
    expect(JSON.stringify(dubaiSpeakers2026)).not.toMatch(/Victor Perez|Klavs/);
  });

  test('Antonio Juanilla Daedoryx presentation sits between the talks and B2B networking', () => {
    const pres = items.find((x) => x.type === 'presentation');
    expect(pres).toMatchObject({ start: '16:15', end: '16:45' });
    expect(pres.details.en).toContain('Antonio Juanilla');
  });

  test('declined speaker and talk stay out of every public dataset', () => {
    expect(Object.keys(dubaiAcceptedSessions2026)).not.toContain('1303592');
    expect(JSON.stringify(dubaiProgramme2026)).not.toMatch(/Isakov|ClickHouse|Hastimal|Harsh|Santhosh|Rahul/);
    expect(JSON.stringify(dubaiSpeakers2026)).not.toMatch(/Isakov|ClickHouse|Hastimal|Harsh/);
  });

  test('no two-day or Conference-day wording remains in the programme data', () => {
    expect(JSON.stringify(dubaiProgramme2026)).not.toMatch(/1 de diciembre|1 December|2026-12-01|Conference day/i);
  });
});

// REGRESION (25-nov-2026): al pasar a jornada unica se perdio la sesion de Sergey Pronin
// (Solanica) de la agenda publica. El ponente habia confirmado por escrito que habla y pidio
// que apareciese; nadie se dio cuenta de que su sesion no estaba. Este test ata la agenda a los
// ponentes que TIENEN ENTRADA EMITIDA: si un ponente con ticket no aparece en la agenda, falla.
describe('todo ponente con entrada emitida aparece en la agenda', () => {
  it('cada ponente con entrada emitida tiene su sesion en la agenda publica', () => {
    // PONENTES con entrada emitida en el evento 2 (verificado en la BD el 25-nov-2026).
    const conEntrada = [
      ['Sergei Pronin', '1322277'],
      ['Ashish Jaiswal', '1315380'],
      ['Hannah Suarez', '1321418'],
      ['Jay Prajapat', '1343214'],
      ['Rishi Mondal', '1345297'],
      ['Sonia Valeja', '1317552'],
      ['Valeria Bogatyreva', '1319799'],
      ['Harmeet Singh', '1318615'],
      ['Ravindra Verma', '1339445'],
      ['Daria Kasatkina', '1341342'],
    ];
    const enAgenda = new Set(
      dubaiProgramme2026.items.map((s) => s.sessionId).filter(Boolean),
    );
    for (const [nombre, sessionId] of conEntrada) {
      expect(enAgenda.has(sessionId), `${nombre} (${sessionId}) no esta en la agenda`).toBe(true);
      const sesion = dubaiAcceptedSessions2026[sessionId];
      expect(sesion, `no existe la sesion ${sessionId} de ${nombre}`).toBeTruthy();
      // Y el ponente tiene que estar en la sesion.
      expect(sesion.speakers.length).toBeGreaterThan(0);
      const ficha = dubaiSpeakers2026[sesion.speakers[0]];
      expect(ficha?.name, `la sesion ${sessionId} no tiene ficha de ponente`).toBeTruthy();
    }
  });

  it('la agenda encadena los slots sin huecos ni solapes', () => {
    const min = (hhmm) => {
      const [h, m] = hhmm.split(':').map(Number);
      return h * 60 + m;
    };
    let prev = null;
    for (const item of dubaiProgramme2026.items) {
      if (prev) {
        expect(min(item.start), `hueco antes de ${item.start}`).toBeGreaterThanOrEqual(min(prev.end));
      }
      prev = item;
    }
    // La jornada no pasa de la ventana de la sede (09:00-18:00).
    expect(min(dubaiProgramme2026.items[0].start)).toBeGreaterThanOrEqual(min('09:00'));
    expect(min(prev.end)).toBeLessThanOrEqual(min('18:00'));
  });
});
