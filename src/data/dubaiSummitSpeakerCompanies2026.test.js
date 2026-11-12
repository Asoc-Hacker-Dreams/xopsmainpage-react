import { describe, expect, test } from 'vitest';
import { dubaiSummitSpeakerCompanies2026 } from './dubaiSummitSpeakerCompanies2026';
import { dubaiProgramme2026 } from './dubaiProgramme2026';
import { dubaiAcceptedSessions2026, dubaiSpeakers2026 } from './dubaiAcceptedSessions2026';

const ids = (list) => new Set(list);
const speakerIds = [...new Set(dubaiProgramme2026.summit.items
  .filter((slot) => slot.sessionId)
  .flatMap((slot) => dubaiAcceptedSessions2026[slot.sessionId].speakers))];

describe('Dubai Summit company affiliations', () => {
  test('all ten accepted Summit speakers are represented', () => {
    expect(dubaiSummitSpeakerCompanies2026).toHaveLength(9);
    expect(speakerIds).toHaveLength(10);
    const mapped = ids(dubaiSummitSpeakerCompanies2026.flatMap((company) => company.speakers));
    expect(mapped.size).toBe(10);
    for (const id of speakerIds) {
      expect(mapped.has(id)).toBe(true);
      expect(dubaiSpeakers2026[id]?.name).toBeTruthy();
    }
  });

  test('the same company is listed only once even when two speakers share an employer', () => {
    expect(ids(dubaiSummitSpeakerCompanies2026.map((company) => company.id)).size).toBe(9);
    for (const id of ['percona', 'obmondo']) {
      const companies = dubaiSummitSpeakerCompanies2026.filter((company) => company.id === id);
      expect(companies).toHaveLength(1);
      expect(companies[0].speakers).toHaveLength(2);
    }
  });

  test('uses company homepages, not invented sponsorship URLs or personal profiles', () => {
    expect(dubaiSummitSpeakerCompanies2026.filter((company) => company.url)).toHaveLength(8);
    expect(dubaiSummitSpeakerCompanies2026.filter((company) => company.logo)).toHaveLength(8);
    for (const company of dubaiSummitSpeakerCompanies2026) {
      expect(company.name).toBeTruthy();
      expect(company.speakers.length).toBeGreaterThanOrEqual(1);
      if (company.url) {
        expect(company.url).toMatch(/^https:\/\//);
        expect(company.url).not.toContain('sessionize');
        expect(company.url).not.toContain('utm_');
      } else {
        expect(company.logo).toBeNull();
      }
      if (company.logo) expect(company.logo).toMatch(/^https:\/\//);
      expect(company.sponsor).toBeUndefined();
      expect(company.collaborator).toBeUndefined();
    }
  });

  test('keeps CBIT FZCO truthful when no official domain/logo was independently verified', () => {
    const cbit = dubaiSummitSpeakerCompanies2026.find((company) => company.id === 'cbit-fzco');
    expect(cbit).toBeDefined();
    expect(cbit.url).toBeNull();
    expect(cbit.logo).toBeNull();
    const hannah = speakerIds.find((id) => dubaiSpeakers2026[id]?.name === 'Hannah Suarez');
    expect(cbit.speakers).toContain(hannah);
  });
});
