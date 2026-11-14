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

  test('correct dates and 19 unique accepted talks', () => {
    expect(dubaiProgramme2026.summit.date).toBe('2026-11-30');
    expect(dubaiProgramme2026.conference.date).toBe('2026-12-01');
    expect(dubaiProgramme2026.timezone).toBe('Asia/Dubai');
    expect(summitTalks).toHaveLength(9);
    expect(conferenceTalks).toHaveLength(10);
    expect(new Set([...summitTalks,...conferenceTalks].map((x) => x.sessionId)).size).toBe(19);
    expect(Object.keys(dubaiAcceptedSessions2026)).toHaveLength(19);
  });

  test.each([['Summit',summit,290],['Conference',conference,400]])(
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

  test('four Conference talks are displayed as original Summit talks, without duplicates', () => {
    for(const id of ['1319799','1340359','1318615','1339445']) {
      expect(summitTalks.filter((x) => x.sessionId===id)).toHaveLength(1);
      expect(conferenceTalks.some((x) => x.sessionId===id)).toBe(false);
      expect(dubaiAcceptedSessions2026[id].durationMinutes).toBe(30);
      expect(dubaiAcceptedSessions2026[id].sourceTrack).toBe('Conference');
    }
  });

  test('all 22 public speakers have a verified Sessionize photo path', () => {
    const speakerIds=new Set(Object.values(dubaiAcceptedSessions2026).flatMap((x)=>x.speakers));
    expect(speakerIds.size).toBe(22);
    expect(Object.keys(dubaiSpeakers2026)).toHaveLength(22);
    for(const id of speakerIds) {
      const p=dubaiSpeakers2026[id];
      expect(p?.name).toBeTruthy();
      expect(p?.photo).toMatch(/^https:\/\/cdn\.sessionize\.com\/image\//);
      expect(p.email).toBeUndefined();
    }
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
});
