# Agenda Data Access Layer (DAL)

This module provides data access functionality for the conference agenda/schedule using IndexedDB for efficient client-side storage and querying.

## Overview

The Agenda DAL implements a filterable and sortable interface for managing conference schedule data with:

- **IndexedDB Integration**: Persistent client-side storage
- **Indexed Queries**: Efficient filtering by day, track, and room
- **Automatic Sorting**: Results sorted by start time in ascending order
- **Composite Indices**: Optimized for common filter combinations

## Files

- `db.js` - Core IndexedDB wrapper and database initialization
- `agendaDAL.js` - Agenda-specific data access functions
- `__tests__/agendaDAL.test.js` - Unit tests with mock data
- `__tests__/agendaDAL.integration.test.js` - Integration tests with real schedule data
- `__tests__/indexedDBMock.js` - Shared IndexedDB mock for testing

## Usage

### Initialize the Database

```javascript
import { initializeAgenda } from './dal/agendaDAL.js';
import scheduleData from './data/schedule2025.json';

// Load schedule data into IndexedDB
await initializeAgenda(scheduleData);
```

### Query the Agenda

```javascript
import { getAgenda } from './dal/agendaDAL.js';

// Get all agenda items (sorted by start time)
const allItems = await getAgenda();

// Filter by specific day
const day1Items = await getAgenda({ day: '2025-11-21' });

// Filter by track
const mainTrackItems = await getAgenda({ track: 'main' });

// Filter by room
const aulaMagnaItems = await getAgenda({ room: 'Aula magna' });

// Combine filters
const day1MainTrack = await getAgenda({ 
  day: '2025-11-21', 
  track: 'main' 
});

// All three filters
const specific = await getAgenda({
  day: '2025-11-21',
  track: 'main',
  room: 'Aula magna'
});
```

### Clear the Database

```javascript
import { clearAgenda } from './dal/agendaDAL.js';

// Remove all agenda data
await clearAgenda();
```

## API Reference

### `initializeAgenda(agendaData)`

Initializes the agenda store with schedule data.

**Parameters:**
- `agendaData` (Array): Array of agenda item objects

**Returns:** Promise<void>

**Example:**
```javascript
await initializeAgenda([
  {
    speaker: 'John Doe',
    talk: 'Conference Opening',
    timeISO: '2025-11-21T09:30',
    room: 'Aula magna',
    track: 'main'
  }
]);
```

### `getAgenda(filters)`

Retrieves agenda items with optional filtering and automatic sorting.

**Parameters:**
- `filters` (Object): Optional filter criteria
  - `day` (String): Filter by day in YYYY-MM-DD format
  - `track` (String): Filter by track name
  - `room` (String): Filter by room name

**Returns:** Promise<Array> - Filtered and sorted agenda items

**Example:**
```javascript
const items = await getAgenda({ day: '2025-11-21' });
```

### `clearAgenda()`

Clears all agenda data from the database.

**Returns:** Promise<void>

## Data Structure

Agenda items are normalized with the following computed fields:

- `day` (String): Extracted from `timeISO` in YYYY-MM-DD format
- `startTime` (String): Copy of `timeISO` for sorting
- `id` (Number): Auto-incremented primary key

Original fields from schedule data are preserved:
- `speaker` (String)
- `talk` (String)
- `description` (String)
- `timeRaw` (String)
- `timeISO` (String)
- `durationMinutes` (Number)
- `durationHuman` (String)
- `room` (String)
- `type` (String)
- `track` (String)

## IndexedDB Schema

### Object Store: `agenda`

**Key Path:** `id` (auto-increment)

**Indices:**
- `day` - For filtering by date
- `track` - For filtering by track
- `room` - For filtering by room
- `startTime` - For sorting
- `day_track` - Composite index for day+track filters
- `day_room` - Composite index for day+room filters

## Performance

The DAL is optimized for:
- Fast queries on large datasets (tested with 150+ items)
- Efficient filtering using IndexedDB indices
- Minimal memory footprint
- Sorted results without full collection scans

## Testing

Run tests with:

```bash
# All DAL tests
npm run test:run -- src/dal/__tests__/

# Unit tests only
npm run test:run -- src/dal/__tests__/agendaDAL.test.js

# Integration tests only
npm run test:run -- src/dal/__tests__/agendaDAL.integration.test.js
```

## Acceptance Criteria

✅ **AC1:** Given day=YYYY-MM-DD When getAgenda Then solo charlas del día en orden
- Implemented and tested in `agendaDAL.test.js` and `agendaDAL.integration.test.js`

✅ **AC2:** Given sin filtros When getAgenda Then agenda completa ordenada
- Implemented and tested in `agendaDAL.test.js` and `agendaDAL.integration.test.js`

## Notes

- All results are automatically sorted by `startTime` in ascending order
- Filters can be combined for precise queries
- IndexedDB provides persistent storage across browser sessions
- Mock implementation provided for testing without browser environment
