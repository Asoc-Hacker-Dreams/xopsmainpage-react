# Data Layer Implementation

This directory contains two complementary data persistence implementations for the X-Ops Conference PWA:

1. **Data Access Layer (DAL)** - High-level abstraction for data sources (JavaScript)
2. **IndexedDB with Dexie** - Low-level database implementation (TypeScript)

---

## 📦 Data Access Layer (DAL)

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

## 🔄 Which Implementation to Use?

### Use DAL (db.js + dal.js) when:
- You need a simple, high-level API
- You want data source abstraction (JSON/CMS)
- You're working in JavaScript

### Use IndexedDB/Dexie (db.ts) when:
- You need advanced features (favorites, notifications)
- You want type safety with TypeScript
- You need performance-critical operations

### Using Both Together

Both implementations can coexist:
- **DAL** handles data fetching and caching
- **Dexie TypeScript** handles user state (favorites, notifications)

---

## 📚 Additional Documentation

- **dbUtils.ts**: Utility functions for data management
- **examples.ts**: Complete usage examples and React hooks
- See individual files for detailed API documentation

## License

Part of the X-Ops Conference PWA project.
