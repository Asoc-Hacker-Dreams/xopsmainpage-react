# Data Layer Implementation

This directory contains three complementary data persistence implementations for the X-Ops Conference PWA:

1. **Data Access Layer (DAL)** - High-level abstraction for agenda/talks data sources (JavaScript)
2. **IndexedDB with Dexie** - Low-level database implementation (TypeScript)
3. **Sponsors DAL** - Dedicated layer for sponsor data management (TypeScript)

---

## 📦 Data Access Layer (DAL) - Agenda & Talks

### Overview

The DAL provides a unified interface for accessing agenda, talks, and speaker data, supporting multiple data sources through environment configuration.

### Components

1. **db.js** - IndexedDB database wrapper using Dexie
   - Provides persistent storage for offline access
   - Caches data locally for improved performance
   - Stores talks, speakers, and metadata

2. **dal.js** - Data Access Layer with provider abstraction
   - Implements data provider interface
   - Supports JSON (default) and CMS data sources
   - Handles data normalization and caching

### Usage (JavaScript)

```javascript
import DAL from './data/dal.js';

// Get all talks
const talks = await DAL.getAgenda();

// Get talks with filters
const mainTrackTalks = await DAL.getAgenda({ day: '2025-11-21', track: 'main' });
```

---

## 🗄️ IndexedDB Database with Dexie (TypeScript)

### Overview

A comprehensive, type-safe IndexedDB implementation using Dexie.js for structured offline data persistence with advanced features.

### Features

- ✅ Structured data persistence with IndexedDB
- ✅ Optimized indices for fast queries
- ✅ Relationship support between talks and speakers
- ✅ Favorites management
- ✅ Notification scheduling
- ✅ Performance optimized (< 50ms for 1000 records)
- ✅ Full TypeScript support

### Usage (TypeScript)

```typescript
import { db } from '@/data/db';

// Get talks by day
const talks = await db.getTalksByDay('2025-11-21');

// Manage favorites
await db.addFavorite('talk-1');
const favorites = await db.getFavorites();
```

### Performance

- **Query Performance**: ~3ms p50 for 1000 talks filtered by day
- **Requirement**: < 50ms (15x faster!)

---

## 🏢 Sponsors Data Access Layer (DAL)

### Overview

The Sponsors DAL provides a unified interface for loading and managing sponsor data in the X-Ops Conference application. It implements a stale-while-revalidate caching strategy with IndexedDB for offline support.

### Features

- **Offline-First**: Data is cached in IndexedDB and available offline
- **Stale-While-Revalidate**: Returns cached data immediately while fetching fresh data in the background
- **Multiple Data Sources**: Supports both JSON files and headless CMS (configurable via environment variables)
- **TypeScript Support**: Fully typed with TypeScript interfaces
- **Performance**: Instant data loading from cache with background updates

### Usage

#### Basic Usage

```typescript
import { getSponsors, getSponsorBySlug } from '../data/dal.sponsors';

// Get all active sponsors
const sponsors = await getSponsors();

// Get a specific sponsor by slug
const sponsor = await getSponsorBySlug('aws');
```

#### React Component Example

```jsx
import React, { useState, useEffect } from 'react';
import { getSponsors } from '../data/dal.sponsors';

function SponsorsList() {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    getSponsors().then(setSponsors);
  }, []);

  return (
    <div>
      {sponsors.map(sponsor => (
        <div key={sponsor.id}>
          <img src={sponsor.logo} alt={sponsor.name} />
          <h3>{sponsor.name}</h3>
          <p>{sponsor.description}</p>
        </div>
      ))}
    </div>
  );
}
```

See `src/components/SponsorsExample.tsx` for a complete example.

### API

#### `getSponsors(): Promise<Sponsor[]>`

Returns all active sponsors sorted by their order field.

**Returns**: Promise that resolves to an array of active Sponsor objects.

**Behavior**:
1. If cached data exists, returns it immediately
2. If cache is stale (> 5 minutes old), triggers background revalidation
3. If no cache exists or fetch fails, attempts to load from the data source
4. Filters out inactive sponsors

**Example**:
```typescript
const sponsors = await getSponsors();
console.log(`Loaded ${sponsors.length} sponsors`);
```

#### `getSponsorBySlug(slug: string): Promise<Sponsor | null>`

Returns a single sponsor by its unique slug.

**Parameters**:
- `slug` (string): The URL-friendly slug of the sponsor

**Returns**: Promise that resolves to a Sponsor object or null if not found.

**Behavior**:
1. If cached data exists for the slug, returns it immediately
2. If cache is stale, triggers background revalidation
3. Returns null if sponsor is not found or inactive

**Example**:
```typescript
const aws = await getSponsorBySlug('aws');
if (aws) {
  console.log(`Found sponsor: ${aws.name}`);
}
```

### Data Model

#### Sponsor Interface

```typescript
interface Sponsor {
  id: string;              // Unique identifier
  slug: string;            // URL-friendly slug
  name: string;            // Company/organization name
  tier: SponsorTier;       // Sponsorship level
  logo: string;            // Path to logo image
  website: string;         // Sponsor website URL
  description: string;     // Brief description
  social?: {               // Optional social media links
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  order: number;           // Display order (lower = first)
  active: boolean;         // Whether sponsor is active
}

type SponsorTier = 'platinum' | 'gold' | 'silver' | 'bronze' | 'community';
```

### Configuration

#### Data Sources

The Sponsors DAL supports two data sources:

##### 1. JSON File (Default)

By default, sponsors are loaded from `/public/data/sponsors.json` (served at `/data/sponsors.json`).

##### 2. Headless CMS

To use a headless CMS, set the following environment variables:

```env
VITE_SPONSORS_SOURCE=cms
VITE_CMS_SPONSORS_ENDPOINT=https://your-cms.com/api/sponsors
VITE_CMS_API_KEY=your-api-key (optional)
```

#### Cache Configuration

The cache is considered stale after 5 minutes. This is configurable in `dal.sponsors.ts`:

```typescript
const STALE_TIME = 5 * 60 * 1000; // 5 minutes
```

### IndexedDB Structure (Sponsors)

The Sponsors DAL uses IndexedDB with the following structure:

**Database**: `xops-sponsors-db` (version 1)

**Stores**:
1. `sponsors` - Stores sponsor data
   - Primary key: `id`
   - Indexes: `slug`, `tier`, `active`

2. `metadata` - Stores cache metadata
   - Stores last fetch timestamp

### Offline Support

The Sponsors DAL is designed to work offline:

1. **First Visit**: Fetches data from the network and caches it
2. **Subsequent Visits**: Returns cached data immediately
3. **Offline**: Returns cached data even if network is unavailable
4. **Stale Cache**: Returns cached data and fetches fresh data in the background

### Testing

Tests are located in `src/data/dal.sponsors.test.ts`.

Run tests with:
```bash
npm test dal.sponsors.test.ts
```

The tests cover:
- Type definitions and interfaces
- Module exports
- Data validation and filtering
- Sorting logic
- Slug lookup

### Adding New Sponsors

#### Method 1: Update JSON File

Edit `/public/data/sponsors.json` and add your sponsor:

```json
{
  "id": "sponsor-unique-id",
  "slug": "company-name",
  "name": "Company Name",
  "tier": "gold",
  "logo": "/assets/company-logo.png",
  "website": "https://company.com",
  "description": "Brief description",
  "social": {
    "twitter": "https://twitter.com/company",
    "linkedin": "https://www.linkedin.com/company/name"
  },
  "order": 10,
  "active": true
}
```

#### Method 2: Use CMS

Configure the CMS endpoint (see Configuration section) and manage sponsors through your CMS.

### Troubleshooting

#### Sponsors not updating

The cache may be stale. Clear the browser's IndexedDB:

1. Open DevTools → Application → IndexedDB
2. Delete `xops-sponsors-db`
3. Refresh the page

#### Console errors about IndexedDB

Make sure your browser supports IndexedDB. Most modern browsers do, but some privacy modes may block it.

#### Sponsors showing offline data

This is expected behavior! The DAL uses stale-while-revalidate, so it shows cached data immediately and updates in the background.

### Performance Considerations

- **Initial Load**: ~50-100ms (depending on network)
- **Cached Load**: <10ms (instant from IndexedDB)
- **Background Revalidation**: Happens asynchronously, doesn't block UI

---

## 🔄 Which Implementation to Use?

### Use Agenda DAL (db.js + dal.js) when:
- You need a simple, high-level API for talks/agenda
- You want data source abstraction (JSON/CMS)
- You're working in JavaScript

### Use IndexedDB/Dexie (db.ts) when:
- You need advanced features (favorites, notifications)
- You want type safety with TypeScript
- You need performance-critical operations

### Use Sponsors DAL (dal.sponsors.ts) when:
- You need to work with sponsor data
- You want offline-first sponsor loading
- You need stale-while-revalidate caching

### Using Multiple Implementations Together

All implementations can coexist:
- **Agenda DAL** handles talks/agenda data fetching and caching
- **Dexie TypeScript** handles user state (favorites, notifications)
- **Sponsors DAL** handles sponsor data with its own cache

---

## 📚 Additional Documentation

- **dbUtils.ts**: Utility functions for data management
- **examples.ts**: Complete usage examples and React hooks
- **dal.sponsors.ts**: Sponsors-specific data access layer
- See individual files for detailed API documentation

## Security

- No sensitive data is stored in IndexedDB
- All external links use `rel="noopener noreferrer"`
- Input validation on all data
- Sanitize user-provided content before rendering

## License

Part of the X-Ops Conference PWA project.
