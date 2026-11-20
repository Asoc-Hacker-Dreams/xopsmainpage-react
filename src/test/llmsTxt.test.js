import { describe, it, expect } from 'vitest';
import llms from '../../public/llms.txt?raw';
import llmsFull from '../../public/llms-full.txt?raw';

// public/llms*.txt are served verbatim to AI agents and agenda aggregators, so
// their figures must match the official Dubai 2026 site. These checks pin the
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

  it('states the official programme figures: 16 talks, 18 speakers', () => {
    expect(text).toMatch(/16 talks accepted/);
    expect(text).toMatch(/18 speakers confirmed/);
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
