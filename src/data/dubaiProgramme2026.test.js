import { describe, expect, test } from 'vitest';
import { dubaiProgramme2026 } from './dubaiProgramme2026';
import { dubaiAcceptedSessions2026, dubaiSpeakers2026 } from './dubaiAcceptedSessions2026';

const minutes = (a, b) => {
  const [ah, am] = a.split(':').map(Number);
  const [bh, bm] = b.split(':').map(Number);
  return (bh * 60 + bm) - (ah * 60 + am);
};

describe('Dubai 2026 accepted sessions and speaker portraits', () => {
  const summit = dubaiProgramme2026.summit.items;
  const conference = dubaiProgramme2026.conference.items;
  const summitTalks = summit.filter((x) => x.sessionId);
  const conferenceTalks = conference.filter((x) => x.sessionId);

  test('correct dates and 16 unique accepted talks', () => {
    expect(dubaiProgramme2026.summit.date).toBe('2026-11-30');
    expect(dubaiProgramme2026.conference.date).toBe('2026-12-01');
    expect(dubaiProgramme2026.timezone).toBe('Asia/Dubai');
    expect(summitTalks).toHaveLength(8);
    expect(conferenceTalks).toHaveLength(8);
    expect(new Set([...summitTalks,...conferenceTalks].map((x) => x.sessionId)).size).toBe(16);
    expect(Object.keys(dubaiAcceptedSessions2026)).toHaveLength(16);
  });

  test.each([['Summit',summit,260],['Conference',conference,320]])(
    '%s preserves durations and has no overlapping slots',
    (_label, slots, expected) => {
      let lastEnd='00:00'; let total=0;
      for(const slot of slots) {
        expect(slot.start >= lastEnd).toBe(true);
        expect(minutes(slot.start,slot.end)).toBeGreaterThan(0);
        lastEnd=slot.end;
        if(slot.sessionId) {
          const original=dubaiAcceptedSessions2026[slot.sessionId];
          expect(original?.title).toBeTruthy();
          expect(minutes(slot.start,slot.end)).toBe(original.durationMinutes);
          total+=original.durationMinutes;
        } else {
          expect(slot.topic?.en).toBeTruthy();
          expect(slot.topic?.es).toBeTruthy();
        }
      }
      expect(total).toBe(expected);
    },
  );

  test('three Conference talks are displayed as original Summit talks, without duplicates', () => {
    for(const id of ['1319799','1318615','1339445']) {
      expect(summitTalks.filter((x) => x.sessionId===id)).toHaveLength(1);
      expect(conferenceTalks.some((x) => x.sessionId===id)).toBe(false);
      expect(dubaiAcceptedSessions2026[id].durationMinutes).toBe(30);
      expect(dubaiAcceptedSessions2026[id].sourceTrack).toBe('Conference');
    }
  });

  test('all 18 public speakers are attributed; photos are Sessionize paths when present', () => {
    const speakerIds=new Set(Object.values(dubaiAcceptedSessions2026).flatMap((x)=>x.speakers));
    expect(speakerIds.size).toBe(18);
    expect(Object.keys(dubaiSpeakers2026)).toHaveLength(18);
    for(const id of speakerIds) {
      const p=dubaiSpeakers2026[id];
      expect(p?.name).toBeTruthy();
      // sin foto oficial verificada el retrato cae a iniciales (como el resto del fallback)
      if(p.photo!==null) expect(p.photo).toMatch(/^https:\/\/cdn\.sessionize\.com\/image\//);
      expect(p.email).toBeUndefined();
    }
  });

  test('Beyond RAG (1343214) is presented by Jay Prajapat alone; Hastimal and Harsh Jangid are no longer listed', () => {
    const session=dubaiAcceptedSessions2026['1343214'];
    expect(session.speakers).toHaveLength(1);
    const jay=dubaiSpeakers2026[session.speakers[0]];
    expect(jay.name).toBe('Jay Prajapat');
    expect(jay.role).toBe('RankRabbit');
    expect(JSON.stringify(dubaiSpeakers2026)).not.toMatch(/Hastimal|Harsh/);
    expect(JSON.stringify(dubaiAcceptedSessions2026)).not.toMatch(/51a51018|88d5d1b5/);
  });

  test('no unaccepted panel/boardroom speakers are attributed', () => {
    const pending=summit.filter((x)=>['panel','roundtable'].includes(x.type));
    expect(pending).toHaveLength(3);
    for(const slot of pending) {
      expect(slot.sessionId).toBeUndefined();
      expect(slot.speakers).toBeUndefined();
    }
  });

  test('Summit includes the Daedoryx organiser presentation after closing, without moving confirmed talks', () => {
    const pres = summit.find((x) => x.type === 'presentation');
    expect(pres).toBeDefined();
    expect(pres.start).toBe('17:20');
    expect(pres.end).toBe('17:50');
    expect(pres.topic.en).toBe('Daedoryx');
    expect(pres.topic.es).toBe('Daedoryx');
    expect(pres.details.en).toContain('Antonio Juanilla');
    expect(pres.details.es).toContain('Antonio Juanilla');
    // la clausura sigue terminando a las 17:20 y el networking B2B empieza después
    const closing = summit.find((x) => x.type === 'closing');
    expect(closing.end).toBe('17:20');
    const b2b = summit.find((x) => x.type === 'networking' && /B2B/.test(x.topic.en));
    expect(b2b.start).toBe('17:50');
    expect(b2b.end).toBe('18:30');
    // ninguna charla confirmada cambia: Zaitsev sigue 16:20–17:10
    const zaitsev = summit.find((x) => x.sessionId === '1322885');
    expect(zaitsev.start).toBe('16:20');
    expect(zaitsev.end).toBe('17:10');
  });

  test('Spanish-language session is labelled and jointly presented', () => {
    const game=conferenceTalks.find((x)=>x.sessionId==='1289422');
    expect(game).toBeDefined();
    expect(dubaiAcceptedSessions2026[game.sessionId].language).toBe('Spanish');
    expect(dubaiAcceptedSessions2026[game.sessionId].speakers).toHaveLength(2);
  });

  // Guardas de retirada: la charla de Victor Isakov (ClickHouse) fue declinada por escrito el 20-nov.
  const REMOVED_SESSION_ID = '1303592';
  const REMOVED_SPEAKER_ID = 'be6a6aa1-b9f3-4c11-a22b-593cad466590';

  test('the declined talk and its speaker stay out of every public dataset', () => {
    expect(Object.keys(dubaiAcceptedSessions2026)).not.toContain(REMOVED_SESSION_ID);
    expect(Object.values(dubaiAcceptedSessions2026).some((s) => s.speakers.includes(REMOVED_SPEAKER_ID))).toBe(false);
    expect(Object.keys(dubaiSpeakers2026)).not.toContain(REMOVED_SPEAKER_ID);
    expect(JSON.stringify(dubaiAcceptedSessions2026)).not.toMatch(/Isakov|ClickHouse|One Database, Every Workload/i);
    expect(JSON.stringify(dubaiSpeakers2026)).not.toMatch(/Isakov|ClickHouse/i);
    expect(JSON.stringify(dubaiProgramme2026)).not.toMatch(/Isakov|ClickHouse|One Database, Every Workload/i);
  });

  test('no agenda slot points at the declined session or references the declined speaker', () => {
    for (const slot of [...summit, ...conference]) {
      expect(slot.sessionId).not.toBe(REMOVED_SESSION_ID);
      expect(slot.speakers ?? []).not.toContain(REMOVED_SPEAKER_ID);
    }
    expect(JSON.stringify(dubaiProgramme2026)).not.toContain(REMOVED_SESSION_ID);
    expect(JSON.stringify(dubaiProgramme2026)).not.toContain(REMOVED_SPEAKER_ID);
  });
});
