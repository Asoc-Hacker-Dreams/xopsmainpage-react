import { describe, it, expect } from 'vitest';
import llms from '../../public/llms.txt?raw';
import llmsFull from '../../public/llms-full.txt?raw';

// public/llms*.txt are served verbatim to AI agents and agenda aggregators, so
// their figures must match the official Dubai 2026 site (single day, 30 Nov 2026). These checks pin the
// verified facts and guard against the stale claims that were removed.
describe.each([
  ['llms.txt', llms],
  ['llms-full.txt', llmsFull],
])('public/%s', (_file, text) => {
  it('is not empty (a missing file would make every negative check pass)', () => {
    expect(text.length).toBeGreaterThan(500);
  });

  it('mentions both Madrid and Dubai as host cities', () => {
    expect(text).toMatch(/Madrid, Spain,? and\s+Dubai, UAE/);
  });

  it('states the single-day programme figures: 11 accepted talks on 30 November, venue to be confirmed', () => {
    expect(text).toMatch(/11 accepted talks in one day/);
    expect(text).toMatch(/30 November 2026/);
    // La sede de Dubái está por confirmar (DKP está descartado): el fichero
    // llms.txt NO debe anunciar una sede que ya no existe.
    expect(text).not.toMatch(/DKP|Dubai Knowledge Park/i);
    expect(text).toMatch(/por confirmar|to be confirmed/i);
    expect(text).not.toMatch(/1 December|1 de diciembre|Venue to be announced/i);
  });

  it('does not claim all 18 speakers are confirmed (only 10 have confirmed in writing)', () => {
    expect(text).not.toMatch(/18 speakers confirmed/);
  });

  it('states the Executive Summit cap of 90 and the verified Madrid 2025 audience', () => {
    expect(text).toMatch(/maximum of 90/);
    expect(text).toMatch(/300\+/);
  });

  it('contains no unsupported attendee figure or withdrawn speaker/sponsor', () => {
    expect(text).not.toMatch(/500\+/);
    expect(text).not.toMatch(/Isakov|ClickHouse|Muralinath/i);
    expect(text).not.toMatch(/speakers to be confirmed/i);
  });
});
