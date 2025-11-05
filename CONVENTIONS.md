# X-Ops Conference Data Contract v1.0

## Overview

This document defines the standard data model for X-Ops Conference talks, speakers, and their relationships. All data follows JSON Schema validation and strict naming conventions.

## Data Model

### Directory Structure

```
/schemas/               # JSON Schema definitions
  ├── talk.schema.json
  └── speaker.schema.json
/data/                  # Normalized data files
  ├── schedule.json     # Combined schedule data
  ├── talks.json        # All talks
  └── speakers.json     # All speakers
/scripts/               # Data management scripts
  ├── normalize-data.js
  └── validate-data.js
```

## Naming Conventions

### General Rules
- **Field names**: Use `camelCase` for all field names
- **IDs**: Immutable, alphanumeric with underscores/hyphens (e.g., `talk_1`, `speaker_id`)
- **Slugs**: URL-friendly, lowercase with hyphens (e.g., `kubernetes-platform-engineering`)
- **Dates**: ISO 8601 format (`YYYY-MM-DD`)
- **Timestamps**: ISO 8601 format with timezone (`YYYY-MM-DDTHH:mm:ss+TZ`)

### ID Conventions
- **Immutability**: IDs must never change once assigned
- **Uniqueness**: IDs must be unique within their entity type
- **Format**: Alphanumeric characters, underscores, and hyphens only
- **Pattern**: `^[a-zA-Z0-9_-]+$`

### Slug Conventions
- **URL-safe**: Only lowercase letters, numbers, and hyphens
- **Readability**: Should be human-readable and descriptive
- **Pattern**: `^[a-z0-9-]+$`

## Schema Definitions

### Talk Schema

Location: `/schemas/talk.schema.json`

#### Required Fields

| Field | Type | Description | Format/Pattern |
|-------|------|-------------|----------------|
| `id` | string | Unique immutable identifier | `^[a-zA-Z0-9_-]+$` |
| `slug` | string | URL-friendly slug | `^[a-z0-9-]+$` |
| `title` | string | Talk title | min length: 1 |
| `abstract` | string | Talk description/abstract | - |
| `track` | string | Conference track | min length: 1 |
| `room` | string | Room/venue name | min length: 1 |
| `day` | string | Date of talk | `YYYY-MM-DD` |
| `startTime` | string | Start time | ISO 8601 date-time |
| `endTime` | string | End time | ISO 8601 date-time |
| `speakerIds` | array | Array of speaker IDs | min items: 1 |
| `updatedAt` | string | Last update timestamp | ISO 8601 date-time |
| `version` | string | Schema version | "1.0" |

#### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Session type (keynote, talk, workshop) |
| `duration` | integer | Duration in minutes |

#### Example

```json
{
  "id": "talk_1",
  "slug": "keynote-bienvenida-xops-2025",
  "title": "Keynote de Bienvenida - X-Ops Conference Madrid 2025",
  "abstract": "Juan Vicente Herrera da la bienvenida oficial...",
  "track": "main",
  "room": "Aula magna",
  "day": "2025-11-21",
  "startTime": "2025-11-21T09:30:00+01:00",
  "endTime": "2025-11-21T10:00:00+01:00",
  "speakerIds": ["Juan_Vicente_Herrera_Ruiz_de_Alejo"],
  "type": "keynote",
  "duration": 30,
  "updatedAt": "2025-11-04T10:00:00Z",
  "version": "1.0"
}
```

### Speaker Schema

Location: `/schemas/speaker.schema.json`

#### Required Fields

| Field | Type | Description | Format/Pattern |
|-------|------|-------------|----------------|
| `id` | string | Unique immutable identifier | `^[a-zA-Z0-9_-]+$` |
| `slug` | string | URL-friendly slug | `^[a-z0-9-]+$` |
| `name` | string | Full name | min length: 1 |
| `bio` | string | Biography/description | - |
| `photoUrl` | string | Photo URL | URI format |
| `socials` | array | Social media links | - |
| `updatedAt` | string | Last update timestamp | ISO 8601 date-time |
| `version` | string | Schema version | "1.0" |

#### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `company` | string | Company/organization |
| `title` | string | Job title |

#### Social Media Object

```json
{
  "platform": "string",  // e.g., "twitter", "linkedin", "github"
  "url": "string"        // Full URL to profile
}
```

#### Example

```json
{
  "id": "Juan_Vicente_Herrera_Ruiz_de_Alejo",
  "slug": "juan-vicente-herrera-ruiz-de-alejo",
  "name": "Juan Vicente Herrera Ruiz de Alejo",
  "bio": "Cloud Architect at Red Hat and co-organizer of Madrid DevOps",
  "photoUrl": "https://xopsconference.com/images/speakers/juan-vicente-herrera.jpg",
  "socials": [
    {
      "platform": "twitter",
      "url": "https://twitter.com/juanvherrera"
    },
    {
      "platform": "linkedin",
      "url": "https://linkedin.com/in/juanvherrera"
    }
  ],
  "company": "Red Hat",
  "title": "Cloud Architect",
  "updatedAt": "2025-11-04T10:00:00Z",
  "version": "1.0"
}
```

## Relationships

### Talk-Speaker Relationship

Talks reference speakers through the `speakerIds` array:

```json
{
  "id": "talk_1",
  "speakerIds": ["speaker_1", "speaker_2"],
  ...
}
```

- A talk can have **one or more speakers** (minimum: 1)
- Speakers are referenced by their immutable IDs
- The relationship is one-to-many (talk to speakers)

## Data Validation

### Running Validation

```bash
# Validate all data
npm run validate:data

# Normalize existing data
npm run normalize:data
```

### Validation Rules

1. **Schema Compliance**: All data must pass JSON Schema validation
2. **Required Fields**: All required fields must be present
3. **Format Validation**: Date/time fields must be in ISO 8601 format
4. **ID Immutability**: IDs must not change between updates
5. **Reference Integrity**: Speaker IDs in talks must reference existing speakers

### Error Handling

Validation errors include:
- Field path (e.g., `/startTime`)
- Error message (e.g., "must match format 'date-time'")
- Additional parameters explaining the error

Example error output:
```
❌ Talk 5 (Example Talk): Validation failed
   - /startTime: must match format "date-time"
     Params: {"format":"date-time"}
```

## Date and Time Standards

### ISO 8601 Format

All timestamps follow ISO 8601 standard:

```
YYYY-MM-DDTHH:mm:ss+TZ
```

Examples:
- `2025-11-21T09:30:00+01:00` (Madrid time, UTC+1)
- `2025-11-21T14:20:00Z` (UTC)

### Date-only Format

Day field uses simplified format:

```
YYYY-MM-DD
```

Example: `2025-11-21`

## Versioning

### Schema Version

Current version: **1.0**

- Included in every data object via `version` field
- Allows for backward compatibility tracking
- Must be updated when schema changes

### Data Updates

The `updatedAt` field tracks when data was last modified:

- Format: ISO 8601 timestamp
- Updated on any data change
- Used for cache invalidation and synchronization

## Best Practices

### 1. Data Integrity

- ✅ Always validate data before committing
- ✅ Keep IDs immutable
- ✅ Use consistent date/time formats
- ✅ Maintain referential integrity

### 2. Updating Data

```bash
# 1. Modify source data in src/data/schedule2025.json
# 2. Run normalization
npm run normalize:data

# 3. Validate the output
npm run validate:data

# 4. Commit if validation passes
```

### 3. Adding New Fields

When adding optional fields:
1. Update the appropriate schema file
2. Add field description to this document
3. Update validation tests
4. Regenerate and validate data

### 4. Breaking Changes

When making breaking changes:
1. Increment schema version
2. Update all data objects
3. Update documentation
4. Provide migration scripts if needed

## Common Validation Errors

### Missing Required Field

```
❌ Talk 1: Validation failed
   - /: must have required property 'startTime'
```

**Solution**: Add the missing field to the data object.

### Invalid Format

```
❌ Speaker 3: Validation failed
   - /photoUrl: must match format "uri"
```

**Solution**: Ensure the URL is properly formatted.

### Invalid Pattern

```
❌ Talk 2: Validation failed
   - /day: must match pattern "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
```

**Solution**: Use YYYY-MM-DD format for dates.

### Empty Required Array

```
❌ Talk 5: Validation failed
   - /speakerIds: must NOT have fewer than 1 items
```

**Solution**: Add at least one speaker ID to the array.

## Tools and Scripts

### normalize-data.js

Converts `src/data/schedule2025.json` to normalized format:
- Extracts unique speakers
- Creates proper IDs and slugs
- Calculates end times
- Generates `data/schedule.json`, `data/talks.json`, and `data/speakers.json`

### validate-data.js

Validates data against JSON schemas:
- Checks all required fields
- Validates formats and patterns
- Provides detailed error messages
- Returns exit code 0 on success, 1 on failure

## CI/CD Integration

Include validation in your CI pipeline:

```yaml
- name: Validate Data
  run: npm run validate:data
```

This ensures all committed data follows the schema.

## Support

For questions or issues:
1. Check this documentation
2. Review schema files in `/schemas`
3. Run validation with `npm run validate:data`
4. Open an issue with validation error details

---

**Last Updated**: 2025-11-04  
**Schema Version**: 1.0  
**Document Version**: 1.0
