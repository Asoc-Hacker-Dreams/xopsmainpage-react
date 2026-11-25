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
    expect(talks).toHaveLength(10);
    const ids = talks.map((x) => x.sessionId);
    expect(new Set(ids).size).toBe(10);
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
    });
  });

  test('la ficha publica de Jay Prajapat esta actualizada (cargo, LinkedIn, bio y foto)', () => {
    const jay=dubaiSpeakers2026['a86f13c6-b7de-4362-848e-145e02aeae60'];
    expect(jay).toBeTruthy();
    expect(jay.name).toBe('Jay Prajapat');
    expect(jay.role).toBe('VP of Engineering & Technology, RankRabbitAI');
    expect(jay.linkedIn).toBe('https://www.linkedin.com/in/jayy-p/');
    expect(jay.photo).toBe('/speakers/jay-prajapat-profile.png');
    // La bio se compara COMPLETA contra la que remitio el ponente por correo el 21-nov-2026
    // (noreply@rankrabbit.ai, 06:58Z, "Speaker Biography"). Comparar solo que no este vacia
    // dejaria pasar una bio inventada o truncada.
    expect(jay.bio).toBe(
      'Jay Prajapat is a technology leader and engineer with 15 years of experience taking software products from concept to MVP and scaling them into production-ready platforms.\n\n' +
      'At RankRabbitAI, Jay leads engineering initiatives focused on building AI-powered applications and production-grade agentic AI systems. His current interests and contributions include agentic AI architectures, developing intelligent agents using Google\'s Agent Development Kit (ADK), and advancing AI evaluation practices to improve agent reliability, quality, observability, and performance. He is also engaged with the broader AI ecosystem through contributions and involvement with the Agentic AI Foundation (AAIF).\n\n' +
      'His engineering philosophy is simple: the right boundaries matter more than the right buzzwords, and a system you cannot observe is a system you cannot trust.\n\n' +
      'Jay is a Certified SAFe Practitioner, an active mentor to fellow engineers, and is based in Ahmedabad, India.'
    );
    // 'Beyond RAG' (13:20-14:10) es suya y solo suya: Hastimal y Harsh ya no figuran
    const sesion=dubaiAcceptedSessions2026['1343214'];
    expect(sesion.speakers).toHaveLength(1);
    expect(dubaiSpeakers2026[sesion.speakers[0]].name).toBe('Jay Prajapat');
    expect(JSON.stringify(dubaiSpeakers2026)).not.toMatch(/Hastimal|Harsh/);
    expect(JSON.stringify(dubaiAcceptedSessions2026)).not.toMatch(/51a51018|88d5d1b5/);
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
