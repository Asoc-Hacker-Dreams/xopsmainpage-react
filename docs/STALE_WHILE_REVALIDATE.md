# Stale-While-Revalidate Implementation for Agenda

This document describes the implementation of the **stale-while-revalidate** pattern for the X-Ops Conference agenda feature.

## Overview

The implementation provides instant offline access to the event agenda while seamlessly fetching fresh data in the background. This follows PWA best practices for providing a fast, reliable user experience.

## Architecture

### Components

1. **IndexedDB Service** (`src/services/agendaDB.js`)
   - Manages persistent storage of agenda data
   - Stores metadata (lastSyncAt, sourceVersion, ETag)
   - Provides CRUD operations

2. **useAgenda Hook** (`src/hooks/useAgenda.js`)
   - Implements the stale-while-revalidate pattern
   - Loads data from IndexedDB instantly
   - Fetches fresh data in parallel
   - Compares and updates data intelligently

3. **Events Component** (`src/components/Events/Events.jsx`)
   - Consumes the useAgenda hook
   - Displays agenda with loading/error states
   - Shows subtle update notifications

## Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  User Opens PWA                                          │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│  Step 1: Load from IndexedDB (Instant)                  │
│  ─────────────────────────────────────                  │
│  • Read cached agenda data                              │
│  • Read metadata (lastSyncAt, etag)                     │
│  • Display data immediately (loading = false)           │
│  • Set isStale = true                                   │
└───────────────┬─────────────────────────────────────────┘
                │
                │ (In Parallel)
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│  Step 2: Revalidate in Background                       │
│  ────────────────────────────────                       │
│  • Fetch schedule.json from server                      │
│  • Include ETag header if available                     │
│  • Compare with cached version                          │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
         ┌──────┴──────┐
         │             │
         ▼             ▼
┌─────────────┐ ┌──────────────────┐
│ 304 Not     │ │ 200 OK           │
│ Modified    │ │ (Fresh Data)     │
└──────┬──────┘ └────────┬─────────┘
       │                 │
       │                 ▼
       │      ┌─────────────────────────┐
       │      │ Compare Data            │
       │      │ ───────────────         │
       │      │ • Check sourceVersion   │
       │      │ • Deep comparison       │
       │      └────────┬────────────────┘
       │               │
       │        ┌──────┴──────┐
       │        │             │
       │        ▼             ▼
       │  ┌─────────┐  ┌─────────────┐
       │  │ Same    │  │ Different   │
       │  │ Data    │  │ Data        │
       │  └────┬────┘  └─────┬───────┘
       │       │             │
       │       │             ▼
       │       │    ┌──────────────────┐
       │       │    │ Update UI        │
       │       │    │ ───────────      │
       │       │    │ • Save to IDB    │
       │       │    │ • Update state   │
       │       │    │ • Show subtle    │
       │       │    │   notification   │
       │       │    └────────┬─────────┘
       │       │             │
       └───────┴─────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Step 3: Mark as Fresh                  │
│  ─────────────────────                  │
│  • Set isStale = false                  │
│  • Update lastSyncAt                    │
└─────────────────────────────────────────┘
```

## Key Features

### 1. Instant Load
- Data loads from IndexedDB immediately on mount
- No waiting for network requests
- `loading` state is false once cache is read

### 2. Background Sync
- Network fetch happens in parallel
- Doesn't block UI rendering
- Uses ETag for conditional requests

### 3. Smart Updates
- Compares data before updating
- Only updates if data actually changed
- Preserves IDs and slugs

### 4. Offline Support
- Works completely offline with cached data
- Shows appropriate error messages
- Degrades gracefully when network fails

### 5. User Feedback
- Subtle "Actualizando horario..." when revalidating
- Warning when network fails but cache exists
- No jarring loading spinners after initial load

## API Reference

### useAgenda Hook

```javascript
const { 
  agenda,      // Array of agenda items
  loading,     // Boolean - only true when no cached data exists
  error,       // String - error message if fetch fails
  isStale,     // Boolean - true while revalidating
  lastSync     // String (ISO date) - last successful sync time
} = useAgenda(scheduleUrl);
```

**Parameters:**
- `scheduleUrl` (optional): URL to fetch schedule data. Defaults to `/data/schedule.json`

**Return Values:**
- `agenda`: Array of agenda items
- `loading`: Only `true` when there's no cached data and initial fetch is pending
- `error`: Error message if network request fails
- `isStale`: `true` while background revalidation is in progress
- `lastSync`: Timestamp of last successful data sync

### IndexedDB Service

```javascript
// Initialize database
await initDB();

// Get all agenda items
const items = await getAgendaFromDB();

// Save agenda items
await saveAgendaToDB(items);

// Get metadata
const lastSync = await getMetadata('lastSyncAt');
const etag = await getMetadata('etag');
const version = await getMetadata('sourceVersion');

// Save metadata
await saveMetadata('lastSyncAt', new Date().toISOString());
await saveMetadata('etag', 'abc123');
await saveMetadata('sourceVersion', JSON.stringify(data));

// Clear all data
await clearAgendaDB();
```

## Testing

### Test Coverage

**Unit Tests:**
- `src/services/agendaDB.test.js` - 9 tests
- `src/hooks/useAgenda.test.js` - 7 tests
- `src/components/Events/Events.test.jsx` - 10 tests

**Integration Tests:**
- `src/test/offlineScenarios.test.js` - 5 tests

**Total:** 31 tests covering:
- IndexedDB operations
- Stale-while-revalidate behavior
- Component rendering with dynamic data
- Offline scenarios
- Error handling
- Data comparison and updates

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- src/hooks/useAgenda.test.js

# Run with coverage
npm run test:coverage
```

## Performance Considerations

1. **Memoization**: `trackConfig` is memoized to prevent unnecessary re-renders
2. **Conditional Requests**: Uses ETag headers to avoid downloading unchanged data
3. **Lazy Updates**: Only updates UI when data actually changes
4. **Parallel Loading**: Network requests don't block initial render

## Browser Compatibility

- **IndexedDB**: Supported in all modern browsers
- **Fetch API**: Polyfill may be needed for older browsers
- **Async/Await**: Requires transpilation for IE11

## Security

- **Object Injection**: Properly validated with optional chaining
- **XSS Protection**: Data is sanitized before rendering
- **Content Security Policy**: Compatible with strict CSP

## Future Enhancements

1. **Background Sync API**: Use native Background Sync when available
2. **Periodic Sync**: Automatically refresh data at intervals
3. **Differential Updates**: Only fetch changed items instead of full dataset
4. **Cache Expiration**: Implement TTL for cached data
5. **Conflict Resolution**: Handle concurrent updates from multiple tabs

## Troubleshooting

### Data Not Loading
- Check IndexedDB in browser DevTools
- Verify schedule.json is accessible
- Check console for errors

### Updates Not Showing
- Clear IndexedDB manually: `await clearAgendaDB()`
- Check ETag headers are being sent correctly
- Verify data comparison logic

### Offline Not Working
- Ensure Service Worker is registered
- Check IndexedDB has data cached
- Verify fetch error handling

## References

- [MDN: IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Web.dev: Stale-While-Revalidate](https://web.dev/stale-while-revalidate/)
- [PWA Patterns: Offline First](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook)
