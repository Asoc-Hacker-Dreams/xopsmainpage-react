import { describe, expect, test } from 'vitest';
import { dubaiSummitSpeakerCompanies2026 } from './dubaiSummitSpeakerCompanies2026';
import { dubaiProgramme2026 } from './dubaiProgramme2026';
import { dubaiAcceptedSessions2026, dubaiSpeakers2026 } from './dubaiAcceptedSessions2026';

const speakerIds = new Set(dubaiProgramme2026.items
  .filter((slot) => slot.sessionId)
  .flatMap((slot) => dubaiAcceptedSessions2026[slot.sessionId].speakers));

describe('Dubai company affiliations (single-day programme)', () => {
  test('every affiliated speaker is one of the 11 speakers in the confirmed agenda', () => {
    expect(speakerIds.size).toBe(11);
    for (const company of dubaiSummitSpeakerCompanies2026) {
      for (const id of company.speakers) {
        expect(speakerIds.has(id)).toBe(true);
        expect(dubaiSpeakers2026[id]?.name).toBeTruthy();
      }
    }
  });

  test('withdrawn speakers (Peter Zaitsev, Victor Perez, Klavs Klavsen) are no longer affiliated on the page', () => {
    const names = dubaiSummitSpeakerCompanies2026.flatMap((c) => c.speakers.map((id) => dubaiSpeakers2026[id]?.name));
    expect(names).not.toContain('Peter Zaitsev');
    expect(names).not.toContain('Victor Perez');
    expect(names).not.toContain('Klavs Klavsen');
  });

  test('the same company is listed only once', () => {
    const ids = dubaiSummitSpeakerCompanies2026.map((company) => company.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('uses company homepages, not invented sponsorship URLs or personal profiles', () => {
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

  // La ponente figura como "Superuser OÜ, CBIT FZCO": la misma empresa con
  // dos denominaciones. La intencion de este test se mantiene (no publicar
  // datos inventados ni duplicar a la misma empresa), pero la forma cambia:
  // UNA sola entrada, con la marca que ella usa y su logo verificado, y la
  // entidad juridica conservada en legalEntity.
  test('keeps CBIT FZCO truthful without duplicating the company', () => {
    const hannah = [...speakerIds].find((id) => dubaiSpeakers2026[id]?.name === 'Hannah Suarez');
    expect(hannah).toBeTruthy();

    const su = dubaiSummitSpeakerCompanies2026.find((company) => company.id === 'superuser');
    expect(su).toBeDefined();
    expect(su.speakers).toContain(hannah);
    // La entidad juridica se conserva, sin inventar dominio ni logo.
    expect(su.legalEntity).toBe('CBIT FZCO');
    expect(su.url).toMatch(/^https:\/\//);
    expect(su.logo).toMatch(/^https:\/\//);

    // Y no hay una entrada aparte que duplique a la misma persona.
    const duplicados = dubaiSummitSpeakerCompanies2026.filter(
      (company) => company.speakers?.includes(hannah),
    );
    expect(duplicados).toHaveLength(1);
    expect(
      dubaiSummitSpeakerCompanies2026.find((company) => company.id === 'cbit-fzco'),
    ).toBeUndefined();
  });
});
