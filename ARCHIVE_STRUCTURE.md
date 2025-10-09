# Archive Structure - Annual Conference Organization

## Overview
The X-Ops Conference is held annually. Each year's speakers and agenda are archived separately to maintain historical records and allow easy access to past event information.

## Directory Structure

```
src/pages/archive/
├── 2023/
│   └── Speakers2023.jsx
├── 2024/
│   ├── Speakers2024.jsx
│   ├── Madrid22.jsx (Friday schedule)
│   ├── Madrid23.jsx (Saturday schedule)
│   └── Sponsor2024.jsx
└── 2025/
    ├── Speakers2025.jsx
    ├── Events2025.jsx (date toggle component)
    ├── Madrid22.jsx (Friday schedule - JSON driven)
    └── Madrid23.jsx (Saturday schedule - JSON driven)
```

## 2025 Implementation

### Components Created

1. **Speakers2025.jsx** (`src/pages/archive/2025/Speakers2025.jsx`)
   - Contains all 22 speakers for 2025 conference
   - Uses placeholder images (xops.png) for new speakers
   - Maintains consistent format with previous years
   - Includes SEO metadata

2. **Events2025.jsx** (`src/pages/archive/2025/Events2025.jsx`)
   - Parent component with date toggle buttons
   - Switches between Friday and Saturday schedules
   - User-friendly interface for navigating between days

3. **Madrid22.jsx** (`src/pages/archive/2025/Madrid22.jsx`)
   - Friday, November 21, 2025 schedule
   - **Dynamically imports** `schedule2025.json`
   - Filters events for 2025-11-21
   - Auto-sorts events chronologically
   - Displays speaker, talk title, time, and duration from JSON

4. **Madrid23.jsx** (`src/pages/archive/2025/Madrid23.jsx`)
   - Saturday, November 22, 2025 schedule
   - **Dynamically imports** `schedule2025.json`
   - Filters events for 2025-11-22
   - Auto-sorts events chronologically
   - Displays speaker, talk title, time, and duration from JSON

## Current Year Components (Unchanged)

The main website components remain unchanged:
- `src/components/SpeakersSection.jsx` - Current year speakers display
- `src/components/Events/Events.jsx` - Current year events (commented out)
- `src/components/Events/Madrid22.jsx` - Current year Friday (commented out)
- `src/components/Events/Madrid23.jsx` - Current year Saturday (commented out)

## Routing

Routes added to `src/App.jsx`:
```javascript
{/* 2025 */}
<Route path="/archive/2025/Speakers2025" element={<Speakers2025 />} />
<Route path="/archive/2025/Events2025" element={<Events2025 />} />
```

## Navigation

Updated navbar dropdown menu to include 2025:
- X-Ops Conference Madrid 2025
  - Ponentes → `/archive/2025/Speakers2025`
  - Agenda → `/archive/2025/Events2025`

## Data Source

The 2025 schedule uses `src/data/schedule2025.json` as the single source of truth:
- Contains all speakers and their talks
- Includes timing information (ISO format)
- Includes duration for each talk
- Used by both Madrid22 and Madrid23 components

## Key Features

1. **Separation of Concerns**: Each year's content is isolated in its own archive folder
2. **Dynamic Data**: 2025 agenda uses JSON data source for easy updates
3. **Consistent Structure**: Follows the same pattern as previous years
4. **Maintainability**: Update schedule by editing JSON, no code changes needed
5. **Historical Record**: All past years remain accessible and unchanged

## Future Years

To add a new year (e.g., 2026):
1. Create `src/pages/archive/2026/` directory
2. Create `Speakers2026.jsx`, `Events2026.jsx`, `Madrid22.jsx`, `Madrid23.jsx`
3. Create `src/data/schedule2026.json` with event data
4. Add imports and routes to `src/App.jsx`
5. Update navbar dropdown menu

## Benefits

- **Clean Organization**: Each year is self-contained
- **Easy Navigation**: Users can browse past events
- **Data-Driven**: JSON-based schedules are easy to update
- **Scalable**: Simple to add new years following the same pattern
- **SEO Friendly**: Each year has its own pages with proper metadata
