# Sponsor Data Contract v1.0

This document describes the data schema for sponsor information in the X-Ops Conference CMS.

## Overview

The sponsor data schema provides a standardized, reusable structure for representing sponsor information, including their tier, branding, contact information, and integration points for microsites, booking systems, and analytics.

## Schema Files

- **`schemas/sponsor.schema.json`**: Base sponsor data model v1.0
- **`schemas/sponsorMicrosite.schema.json`**: Extended schema for sponsor microsites (includes base sponsor schema)

## Sponsor Schema v1.0

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | UUID or stable slug identifier | `"acme-corp-2025"` |
| `slug` | string | URL-friendly identifier (lowercase, hyphens only) | `"acme-corp"` |
| `name` | string | Sponsor name | `"ACME Corporation"` |
| `tier` | enum | Sponsorship tier: `platinum`, `gold`, `silver`, `community` | `"platinum"` |
| `logoUrl` | string (uri) | URL to sponsor logo image | `"https://example.com/logo.png"` |
| `shortDesc` | string | Short description of the sponsor | `"Líder mundial en soluciones empresariales..."` |
| `website` | string (uri) | Sponsor website URL | `"https://www.acmecorp.com"` |
| `updatedAt` | string (date-time) | Last update timestamp (ISO 8601) | `"2025-11-04T08:00:00Z"` |
| `version` | string | Schema version (format: `X.Y`) | `"1.0"` |

### Optional Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `longDesc` | string \| null | Long description of the sponsor | `"ACME Corporation es una empresa..."` |
| `socials` | array | Social media links | See [Social Media Schema](#social-media-schema) |
| `showcase` | object | Call-to-action buttons | See [Showcase Schema](#showcase-schema) |
| `booking` | object | Booking configuration | See [Booking Schema](#booking-schema) |
| `hubspot` | object | HubSpot integration | See [HubSpot Schema](#hubspot-schema) |
| `analytics` | object | Analytics configuration | See [Analytics Schema](#analytics-schema) |

### Social Media Schema

Array of social media profiles:

```json
{
  "socials": [
    {
      "type": "x",
      "url": "https://x.com/acmecorp"
    },
    {
      "type": "linkedin",
      "url": "https://linkedin.com/company/acmecorp"
    }
  ]
}
```

**Supported types**: `x`, `twitter`, `linkedin`, `facebook`, `instagram`, `youtube`, `github`

### Showcase Schema

Call-to-action buttons for the sponsor showcase:

```json
{
  "showcase": {
    "ctaPrimary": {
      "label": "Contactar",
      "href": "/sponsors/acme-corp#lead"
    },
    "ctaSecondary": {
      "label": "Descargar dossier",
      "href": "https://www.acmecorp.com/resources/dossier.pdf"
    }
  }
}
```

### Booking Schema

Booking system configuration:

```json
{
  "booking": {
    "type": "external",
    "url": "https://calendly.com/acmecorp/xops-meeting"
  }
}
```

**Supported types**: `external`, `internal`, `disabled`

### HubSpot Schema

HubSpot form integration:

```json
{
  "hubspot": {
    "formGuid": "12345678-1234-1234-1234-123456789abc"
  }
}
```

The `formGuid` must be a valid UUID format.

### Analytics Schema

Analytics and UTM tracking configuration:

```json
{
  "analytics": {
    "source": "ga4",
    "utm_default": {
      "source": "xops",
      "medium": "sponsor",
      "campaign": "xops2025"
    }
  }
}
```

**Supported sources**: `ga4`, `gtm`, `matomo`

## Complete Example

```json
{
  "id": "acme-corp-2025",
  "slug": "acme-corp",
  "name": "ACME Corporation",
  "tier": "platinum",
  "logoUrl": "https://example.com/logos/acme-corp.png",
  "shortDesc": "Líder mundial en soluciones empresariales de DevOps y Cloud Infrastructure",
  "longDesc": "ACME Corporation es una empresa líder en el desarrollo de herramientas y plataformas de DevOps...",
  "website": "https://www.acmecorp.com",
  "socials": [
    {
      "type": "x",
      "url": "https://x.com/acmecorp"
    },
    {
      "type": "linkedin",
      "url": "https://linkedin.com/company/acmecorp"
    }
  ],
  "showcase": {
    "ctaPrimary": {
      "label": "Contactar",
      "href": "/sponsors/acme-corp#lead"
    },
    "ctaSecondary": {
      "label": "Descargar dossier",
      "href": "https://www.acmecorp.com/resources/xops-2025-dossier.pdf"
    }
  },
  "booking": {
    "type": "external",
    "url": "https://calendly.com/acmecorp/xops-meeting"
  },
  "hubspot": {
    "formGuid": "12345678-1234-1234-1234-123456789abc"
  },
  "analytics": {
    "source": "ga4",
    "utm_default": {
      "source": "xops",
      "medium": "sponsor",
      "campaign": "xops2025"
    }
  },
  "updatedAt": "2025-11-04T08:00:00Z",
  "version": "1.0"
}
```

## Validation

### Running Validation

To validate the `src/data/sponsors.json` file against the schema:

```bash
npm run validate:sponsors
```

This will:
- ✅ Validate all sponsors against the schema v1.0
- ❌ Report clear error messages for any validation failures
- 📊 Provide a summary of valid/invalid sponsors

### Validation Script Options

```bash
# Standard validation
npm run validate:sponsors

# Verbose mode (shows detailed error information)
npm run validate:sponsors -- --verbose
npm run validate:sponsors -- -v
```

### Expected Output

**Success:**
```
✅ Loaded sponsor schema
✅ Loaded sponsors data
✅ Compiled sponsor schema

📋 Validating sponsors data...

✅ Sponsor 1 (ACME Corporation) - VALID
✅ Sponsor 2 (TechSolutions Inc) - VALID

============================================================
📊 Resumen de validación:
============================================================
Total de sponsors: 2
✅ Válidos: 2
❌ Inválidos: 0
============================================================

✅ Validación EXITOSA: Todos los sponsors cumplen con el schema v1.0
```

**Failure (missing required field):**
```
❌ Sponsor 1 (Test Sponsor) - INVALID

  → Campo obligatorio faltante: id

============================================================
📊 Resumen de validación:
============================================================
Total de sponsors: 1
✅ Válidos: 0
❌ Inválidos: 1
============================================================

❌ Validación FALLIDA: La validación encontró errores.
```

## Testing

Automated tests are available in `src/test/sponsor-schema.test.js`.

Run tests with:

```bash
# Run all tests
npm test

# Run only sponsor schema tests
npm run test:run -- src/test/sponsor-schema.test.js
```

The test suite includes:
- ✅ Validation of complete sponsor objects
- ✅ Validation with optional fields
- ✅ Validation of all tier levels
- ❌ Detection of missing required fields
- ❌ Detection of invalid field formats
- ✅ Validation of the actual `sponsors.json` file

## Common Validation Errors

### Missing Required Field
```
→ Campo obligatorio faltante: id
```
**Solution**: Add the missing required field to your sponsor object.

### Invalid Tier Value
```
→ Campo "/tier": debe ser uno de [platinum, gold, silver, community]
```
**Solution**: Use one of the allowed tier values.

### Invalid URL Format
```
→ Campo "/logoUrl": formato inválido (debe ser uri)
```
**Solution**: Ensure URLs start with `http://` or `https://`.

### Invalid Slug Format
```
→ Campo "/slug": no cumple con el patrón requerido
```
**Solution**: Use only lowercase letters, numbers, and hyphens in slugs.

### Invalid Date Format
```
→ Campo "/updatedAt": formato inválido (debe ser date-time)
```
**Solution**: Use ISO 8601 format (e.g., `"2025-11-04T08:00:00Z"`).

### Invalid Version Format
```
→ Campo "/version": no cumple con el patrón requerido
```
**Solution**: Use semantic version format like `"1.0"`, not `"v1.0"`.

## Sponsor Microsite Schema

The `sponsorMicrosite.schema.json` extends the base sponsor schema with additional microsite-specific configuration. It includes all fields from the sponsor schema plus a `microsite` object for customization.

For more details, see the [sponsorMicrosite.schema.json](../schemas/sponsorMicrosite.schema.json) file.

## Version History

- **v1.0** (2025-11-04): Initial release
  - Base sponsor data model
  - JSON Schema validation
  - Validation script
  - Automated tests

## Migration Guide

When updating from older data formats:

1. Ensure all required fields are present
2. Convert URLs to full format with protocol (`https://`)
3. Format slugs to lowercase with hyphens only
4. Use ISO 8601 format for `updatedAt` timestamps
5. Set `version` to `"1.0"`
6. Run validation: `npm run validate:sponsors`

## Support

For questions or issues with the sponsor schema:
- Review the schema files in `schemas/`
- Check validation errors with `npm run validate:sponsors --verbose`
- Run tests: `npm run test:run -- src/test/sponsor-schema.test.js`
- Refer to examples in `src/data/sponsors.json`
