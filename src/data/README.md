# IndexedDB Database with Dexie

This module implements a robust, offline-capable database for the X-Ops Conference PWA using Dexie.js, a wrapper for IndexedDB.

## Features

- ✅ Structured data persistence with IndexedDB
- ✅ Optimized indices for fast queries
- ✅ Relationship support between talks and speakers
- ✅ Favorites management
- ✅ Notification scheduling
- ✅ Versioned migrations with Dexie
- ✅ Performance optimized (< 50ms for 1000 records)
- ✅ Full TypeScript support

## Database Schema

### Tables

#### `talks`
Stores conference talk information.

**Indices:** `id`, `day`, `track`, `room`, `startTime`, `endTime`, `slug`

**Fields:**
- `id` (string, primary key)
- `day` (string) - Date in format YYYY-MM-DD
- `track` (string) - Track name (main, hyperscalers, etc.)
- `room` (string) - Room name
- `startTime` (string) - Time in format HH:MM
- `endTime` (string) - Time in format HH:MM
- `slug` (string) - URL-friendly identifier
- `speaker` (string, optional)
- `talk` (string, optional)
- `description` (string, optional)
- `timeISO` (string, optional)
- `durationMinutes` (number, optional)
- `durationHuman` (string, optional)
- `type` (string, optional)

#### `speakers`
Stores speaker information.

**Indices:** `id`, `slug`, `name`

**Fields:**
- `id` (string, primary key)
- `slug` (string) - URL-friendly identifier
- `name` (string) - Speaker full name
- `bio` (string, optional)
- `image` (string, optional)
- `company` (string, optional)
- `social` (object, optional)

#### `talkSpeakers`
Many-to-many relationship between talks and speakers.

**Compound Primary Key:** `[talkId+speakerId]`
**Indices:** `talkId`, `speakerId`

**Fields:**
- `talkId` (string)
- `speakerId` (string)

#### `favorites`
User favorite talks.

**Auto-increment:** `++id`
**Indices:** `talkId`, `addedAt`

**Fields:**
- `id` (number, auto-increment)
- `talkId` (string)
- `addedAt` (Date)

#### `notifSchedule`
Scheduled notifications for talks.

**Primary Key:** `talkId`
**Indices:** `notifyAt`

**Fields:**
- `talkId` (string)
- `notifyAt` (Date)

## Usage

### Basic Usage

```typescript
import { db } from '@/data/db';

// Get all talks for a specific day
const talks = await db.getTalksByDay('2025-11-21');

// Get talks by track
const mainTrackTalks = await db.getTalksByTrack('main');

// Get a single talk
const talk = await db.getTalkById('talk-1');

// Get speakers for a talk
const speakers = await db.getSpeakersForTalk('talk-1');
```

### Favorites Management

```typescript
import { db } from '@/data/db';

// Add a talk to favorites
await db.addFavorite('talk-1');

// Check if a talk is favorited
const isFav = await db.isFavorite('talk-1');

// Get all favorite talks
const favorites = await db.getFavorites();

// Remove from favorites
await db.removeFavorite('talk-1');
```

### Notification Scheduling

```typescript
import { db } from '@/data/db';

// Schedule a notification
const notifyAt = new Date('2025-11-21T09:00:00');
await db.scheduleNotification('talk-1', notifyAt);

// Get pending notifications
const pending = await db.getPendingNotifications();

// Remove a notification
await db.removeNotification('talk-1');
```

### Database Utilities

```typescript
import { populateDatabase, getDatabaseStats, exportData } from '@/data/dbUtils';
import scheduleData from '@/data/schedule2025.json';

// Populate database with schedule data
await populateDatabase(scheduleData);

// Get database statistics
const stats = await getDatabaseStats();
console.log(stats); // { talks: 100, speakers: 50, favorites: 5, notifications: 3 }

// Export all data
const backup = await exportData();

// Import data
import { importData } from '@/data/dbUtils';
await importData(backup);
```

## Performance

The database is optimized for performance with properly indexed fields:

- **Query Performance:** Filtering 1000 talks by day takes < 50ms (p50)
- **Bulk Operations:** Efficient bulk insert and update operations
- **Indexed Queries:** Fast lookups by day, track, room, and slug

## Migration Support

Dexie handles database versioning automatically. To add new schema changes:

```typescript
// In db.ts
constructor() {
  super('XOpsDatabase');
  
  // Version 1
  this.version(1).stores({
    talks: 'id, day, track, room, startTime, endTime, slug',
    speakers: 'id, slug, name',
    // ... other tables
  });
  
  // Version 2 (future migration)
  this.version(2).stores({
    talks: 'id, day, track, room, startTime, endTime, slug, language', // Added language
    // ... other tables
  }).upgrade(tx => {
    // Migration code here
    return tx.table('talks').toCollection().modify(talk => {
      talk.language = 'es';
    });
  });
}
```

## Testing

The database includes comprehensive tests:

```bash
# Run database tests
npm test -- src/data/db.test.ts

# Run utility tests
npm test -- src/data/dbUtils.test.ts

# Run all tests
npm test
```

### Test Coverage

- ✅ Schema validation
- ✅ CRUD operations
- ✅ Query performance (1000 records)
- ✅ Relationships
- ✅ Favorites management
- ✅ Notification scheduling
- ✅ Cache clearing and re-hydration
- ✅ Data import/export

## Browser Support

IndexedDB is supported in all modern browsers:
- Chrome/Edge 24+
- Firefox 16+
- Safari 10+
- iOS Safari 10+

For older browsers, the app will gracefully degrade to in-memory storage.

## Best Practices

1. **Always use transactions** for multiple operations:
   ```typescript
   await db.transaction('rw', [db.talks, db.speakers], async () => {
     await db.talks.add(talk);
     await db.speakers.add(speaker);
   });
   ```

2. **Use bulk operations** for better performance:
   ```typescript
   await db.talks.bulkAdd(talks);
   ```

3. **Handle errors gracefully**:
   ```typescript
   try {
     await db.addFavorite(talkId);
   } catch (error) {
     console.error('Failed to add favorite:', error);
   }
   ```

4. **Clear cache on app updates**:
   ```typescript
   // On service worker update
   await db.clearAll();
   await populateDatabase(newScheduleData);
   ```

## Integration Example

```typescript
import React, { useEffect, useState } from 'react';
import { db } from '@/data/db';
import { populateDatabase, isDatabaseEmpty } from '@/data/dbUtils';
import scheduleData from '@/data/schedule2025.json';

function SchedulePage() {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Check if database is empty
      if (await isDatabaseEmpty()) {
        // Populate with initial data
        await populateDatabase(scheduleData);
      }

      // Load talks for today
      const today = new Date().toISOString().split('T')[0];
      const todayTalks = await db.getTalksByDay(today);
      setTalks(todayTalks);
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {talks.map(talk => (
        <div key={talk.id}>
          <h3>{talk.talk}</h3>
          <p>{talk.speaker}</p>
        </div>
      ))}
    </div>
  );
}
```

## Troubleshooting

### Database not persisting
- Check browser's IndexedDB storage quota
- Verify that the app is served over HTTPS (required for persistent storage)
- Check browser console for IndexedDB errors

### Performance issues
- Ensure queries use indexed fields (day, track, room, slug)
- Use bulk operations for multiple records
- Consider pagination for large result sets

### Migration issues
- Always increment version number when changing schema
- Test migrations with existing data
- Provide upgrade functions for data transformation

## License

This database implementation is part of the X-Ops Conference PWA and follows the same license as the main project.
