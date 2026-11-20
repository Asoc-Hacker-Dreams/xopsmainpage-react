// Regression test for the STATIC JSON-LD in index.html (the shell served for
// every route on all three domains). Madrid 2026 is postponed, so the static
// block must not declare it as EventScheduled again.
//
// Per Google's Event structured-data guide, a postponed event KEEPS its
// original startDate/endDate and only flips eventStatus to EventPostponed
// (properties like startDate/location identify the event). Deleting the dates
// would drop Madrid from event rich results, so this test never requires them
// to be absent — it requires them to stay at the originally announced dates.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

const MADRID_START = '2026-11-19';
const MADRID_END = '2026-11-21';
const DUBAI_START = '2026-11-30';
const DUBAI_END = '2026-12-01';

const EVENT_SCHEDULED = 'https://schema.org/EventScheduled';
const EVENT_POSTPONED = 'https://schema.org/EventPostponed';

function readIndexHtml() {
  return readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
}

/** Raw text of every <script type="application/ld+json"> block in index.html. */
function extractJsonLdBlocks(html) {
  // Fresh regex per call: a module-level /g/ regex carries lastIndex state
  // across calls and can silently skip the first block.
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const blocks = [];
  let match;
  while ((match = re.exec(html)) !== null) {
    blocks.push(match[1]);
  }
  return blocks;
}

/** Parsed nodes, flattening top-level arrays and @graph containers. */
function flattenNodes(value) {
  if (Array.isArray(value)) return value.flatMap(flattenNodes);
  if (value && typeof value === 'object') {
    const nested = Array.isArray(value['@graph']) ? value['@graph'].flatMap(flattenNodes) : [];
    return [value, ...nested];
  }
  return [];
}

function isEvent(node) {
  const type = node && node['@type'];
  return Array.isArray(type) ? type.includes('Event') : type === 'Event';
}

/** An event is "Madrid" if its name or its location mentions Madrid. */
function isMadridEvent(node) {
  if (!isEvent(node)) return false;
  const haystack = `${node.name || ''} ${JSON.stringify(node.location || {})}`.toLowerCase();
  return haystack.includes('madrid');
}

function isDubaiEvent(node) {
  if (!isEvent(node)) return false;
  const haystack = `${node.name || ''} ${JSON.stringify(node.location || {})}`.toLowerCase();
  return haystack.includes('dubai') || haystack.includes('dubái');
}

function loadIndexHtmlJsonLd() {
  const html = readIndexHtml();
  const blocks = extractJsonLdBlocks(html);
  const failures = [];
  const parsedBlocks = [];

  blocks.forEach((raw, index) => {
    try {
      parsedBlocks.push(JSON.parse(raw));
    } catch (error) {
      failures.push(`block #${index + 1}: ${error.message}`);
    }
  });

  const nodes = parsedBlocks.flatMap(flattenNodes);
  return { html, blocks, nodes, failures };
}

describe('index.html static JSON-LD — Madrid is postponed', () => {
  it('contains at least one application/ld+json block', () => {
    const { blocks } = loadIndexHtmlJsonLd();

    // Guards against a vacuous green: a broken regex/broken page would yield
    // zero blocks and every assertion below would pass over an empty set.
    expect(blocks.length).toBeGreaterThan(0);
  });

  it('every application/ld+json block parses as valid JSON', () => {
    const { blocks, failures } = loadIndexHtmlJsonLd();

    expect(blocks.length).toBeGreaterThan(0);
    // A single malformed block kills the structured data of the whole page.
    expect(failures).toEqual([]);
  });

  it('declares Madrid with eventStatus EventPostponed', () => {
    const { nodes } = loadIndexHtmlJsonLd();
    const madridEvents = nodes.filter(isMadridEvent);

    expect(madridEvents.length).toBeGreaterThan(0);
    madridEvents.forEach((event) => {
      expect(event.eventStatus).toBe(EVENT_POSTPONED);
    });
  });

  it('never declares Madrid as EventScheduled in any block', () => {
    const { nodes } = loadIndexHtmlJsonLd();
    const madridEvents = nodes.filter(isMadridEvent);

    expect(madridEvents.length).toBeGreaterThan(0);
    const scheduled = madridEvents.filter((event) => event.eventStatus === EVENT_SCHEDULED);
    expect(scheduled).toEqual([]);
  });

  it('keeps the original Madrid dates (2026-11-19 / 2026-11-21) when present', () => {
    const { nodes } = loadIndexHtmlJsonLd();
    const madridEvents = nodes.filter(isMadridEvent);

    expect(madridEvents.length).toBeGreaterThan(0);
    // Google's guide: do NOT remove startDate/endDate on postponement. If they
    // are there, they must still be the originally announced ones — this
    // catches anyone swapping them for an invented new date.
    madridEvents.forEach((event) => {
      if (event.startDate !== undefined) {
        expect(event.startDate).toMatch(new RegExp(`^${MADRID_START}`));
      }
      if (event.endDate !== undefined) {
        expect(event.endDate).toMatch(new RegExp(`^${MADRID_END}`));
      }
    });
  });

  it('says in the Madrid description that it is postponed and the date is TBC', () => {
    const { nodes } = loadIndexHtmlJsonLd();
    const madridEvents = nodes.filter(isMadridEvent);

    expect(madridEvents.length).toBeGreaterThan(0);
    madridEvents.forEach((event) => {
      expect(event.description).toMatch(/aplaz/i);
      expect(event.description).toMatch(/por confirmar/i);
    });
  });

  it('keeps the modality and location properties of the Madrid event', () => {
    const { nodes } = loadIndexHtmlJsonLd();
    const madridEvents = nodes.filter(isMadridEvent);

    expect(madridEvents.length).toBeGreaterThan(0);
    madridEvents.forEach((event) => {
      expect(event.eventAttendanceMode).toBe('https://schema.org/OfflineEventAttendanceMode');
      expect(event.location?.address?.addressLocality).toBe('Madrid');
      expect(event.location?.address?.addressCountry).toBe('ES');
    });
  });

  it('leaves the Dubai event scheduled on 2026-11-30 / 2026-12-01', () => {
    const { nodes } = loadIndexHtmlJsonLd();
    const dubaiEvents = nodes.filter(isDubaiEvent);

    expect(dubaiEvents.length).toBeGreaterThan(0);
    const scheduled = dubaiEvents.filter((event) => event.eventStatus === EVENT_SCHEDULED);
    expect(scheduled.length).toBeGreaterThan(0);

    scheduled.forEach((event) => {
      expect(event.startDate).toMatch(new RegExp(`^${DUBAI_START}`));
      expect(event.endDate).toMatch(new RegExp(`^${DUBAI_END}`));
    });
  });
});