# Data Access Layer (DAL) Implementation

## Overview

This directory contains the Data Access Layer (DAL) implementation that abstracts data sources for the X-Ops Conference application. The DAL provides a unified interface for accessing agenda, talks, and speaker data, supporting multiple data sources through environment configuration.

## Architecture

### Components

1. **db.js** - IndexedDB database wrapper using Dexie
   - Provides persistent storage for offline access
   - Caches data locally for improved performance
   - Stores talks, speakers, and metadata

2. **dal.js** - Data Access Layer with provider abstraction
   - Implements data provider interface
   - Supports JSON (default) and CMS data sources
   - Handles data normalization and caching

### Data Providers

#### JSON Provider (Default)
- Loads data from `schedule2025.json`
- Normalizes data with unique IDs and slugs
- Caches in IndexedDB with 24-hour expiration
- Automatically syncs on first load or cache expiration

#### CMS Provider (Placeholder)
- Designed for future REST/GraphQL integration
- Activated via `VITE_DATA_SOURCE=cms` environment variable
- Requires `VITE_CMS_API_URL` configuration

## Usage

### Environment Configuration

Create a `.env` file in the project root:

```env
# Data source: 'json' (default) or 'cms'
VITE_DATA_SOURCE=json

# CMS API URL (only needed when VITE_DATA_SOURCE=cms)
# VITE_CMS_API_URL=https://your-cms-api.com/api
```

### Using the DAL Interface

```javascript
import DAL from './data/dal.js';

// Get all talks
const talks = await DAL.getAgenda();

// Get talks with filters
const mainTrackTalks = await DAL.getAgenda({ 
  day: '2025-11-21', 
  track: 'main' 
});

// Get specific talk by ID or slug
const talk = await DAL.getTalk('talk-1');
const talkBySlug = await DAL.getTalk('keynote-de-bienvenida');

// Get all speakers
const speakers = await DAL.getSpeakers();

// Get speakers with filters
const filteredSpeakers = await DAL.getSpeakers({ 
  name: 'Juan' 
});

// Get specific speaker
const speaker = await DAL.getSpeaker('speaker-1');
```

### Using React Hooks

The preferred way to use the DAL in React components is through the provided hooks:

```javascript
import { useAgenda, useTalk } from './hooks/useAgenda';
import { useSpeakers, useSpeaker } from './hooks/useSpeakers';

function AgendaComponent() {
  // Get all talks
  const { talks, loading, error, refetch } = useAgenda();

  // Get filtered talks
  const { talks: mainTalks } = useAgenda({ 
    day: '2025-11-21', 
    track: 'main' 
  });

  // Get specific talk
  const { talk } = useTalk('talk-1');

  // Get all speakers
  const { speakers } = useSpeakers();

  // Get specific speaker
  const { speaker } = useSpeaker('speaker-1');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {talks.map(talk => (
        <div key={talk.id}>{talk.talk}</div>
      ))}
    </div>
  );
}
```

## Data Models

### Talk Object
```javascript
{
  id: string,           // Unique identifier (e.g., "talk-1")
  slug: string,         // URL-friendly slug
  speaker: string,      // Speaker name(s)
  talk: string,         // Talk title
  description: string,  // Full description
  timeRaw: string,      // Raw timestamp
  timeISO: string,      // ISO 8601 timestamp
  durationMinutes: number,
  durationHuman: string,
  room: string,
  type: string,         // keynote, talk, etc.
  track: string,        // main, hyperscalers, bsides
  day: string           // YYYY-MM-DD format
}
```

### Speaker Object
```javascript
{
  id: string,           // Unique identifier (e.g., "speaker-1")
  slug: string,         // URL-friendly slug
  name: string          // Speaker name
}
```

## API Reference

### DAL Methods

#### `getAgenda(filters?): Promise<Talk[]>`
Get agenda/schedule with optional filters.

**Filters:**
- `day`: string - Filter by day (YYYY-MM-DD)
- `track`: string - Filter by track (main, hyperscalers, bsides, all)
- `type`: string - Filter by type (keynote, talk, etc.)
- `room`: string - Filter by room name

#### `getTalk(idOrSlug): Promise<Talk|null>`
Get a specific talk by ID or slug.

#### `getSpeakers(filters?): Promise<Speaker[]>`
Get speakers with optional filters.

**Filters:**
- `name`: string - Filter by name (partial match)

#### `getSpeaker(idOrSlug): Promise<Speaker|null>`
Get a specific speaker by ID or slug.

## Switching Data Sources

### From JSON to CMS

1. Update `.env` file:
   ```env
   VITE_DATA_SOURCE=cms
   VITE_CMS_API_URL=https://your-cms-api.com/api
   ```

2. Implement CMS endpoints:
   - `GET /agenda?day=...&track=...`
   - `GET /talks/:idOrSlug`
   - `GET /speakers?name=...`
   - `GET /speakers/:idOrSlug`

3. No code changes required - the UI continues working!

### From CMS back to JSON

Simply update `.env`:
```env
VITE_DATA_SOURCE=json
```

## Offline Support

The JSON provider automatically caches data in IndexedDB for offline access:
- First load downloads and caches data
- Subsequent loads use cached data
- Cache expires after 24 hours
- Manual refresh available through `refetch()` method

## Testing

Tests are provided for:
- DAL interface methods
- Data normalization and caching
- React hooks
- Error handling

Run tests:
```bash
npm test src/data/dal.test.js
npm test src/hooks/useAgenda.test.js
```

## Future Enhancements

1. **CMS Integration**: Implement full CMS provider with REST/GraphQL
2. **Background Sync**: Automatic background data synchronization
3. **Conflict Resolution**: Handle concurrent updates
4. **Favorites**: Add user favorites functionality with IndexedDB
5. **Push Notifications**: Notify users of schedule changes
6. **Optimistic Updates**: Immediate UI updates with background sync

## Notes

- All data is normalized with unique IDs and URL-friendly slugs
- Speaker names are extracted and deduplicated automatically
- Time sorting is automatic for agenda queries
- IndexedDB provides offline-first capability
- Environment variables are read at build time (Vite)
