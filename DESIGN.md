---
name: XOps Conference
description: International tech conference and executive summit — Dubai & Spain
colors:
  navy-deep: "#0A0F2E"
  navy-surface: "#111840"
  navy-card: "#0D1238"
  navy-dark-ink: "#1a1a2e"
  cyan-primary: "#00BCD4"
  cyan-bright: "#26C6DA"
  gold-signal: "#FFD600"
  amber-warm: "#f59e0b"
  amber-muted: "#fbbf24"
  blue-anchor: "#1A237E"
  slate-muted: "#B0BEC5"
  slate-dim: "#94a3b8"
  slate-faint: "#64748b"
  white-text: "#f8fafc"
  white-pure: "#ffffff"
  green-success: "#69F0AE"
  green-alt: "#00E676"
  red-error: "#ef4444"
typography:
  display:
    fontFamily: "Raleway, 'Segoe UI', Arial, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 3.5rem)"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Raleway, 'Segoe UI', Arial, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "Lato, 'Segoe UI', Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "Lato, 'Segoe UI', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Poppins, 'Segoe UI', Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    letterSpacing: "0.04em"
rounded:
  sm: "4px"
  md: "12px"
  lg: "20px"
  xl: "28px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  xxl: "80px"
components:
  button-primary:
    backgroundColor: "{colors.cyan-primary}"
    textColor: "{colors.navy-deep}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "{colors.cyan-bright}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.cyan-primary}"
    rounded: "{rounded.pill}"
    padding: "12px 28px"
  button-gold:
    backgroundColor: "{colors.gold-signal}"
    textColor: "{colors.navy-deep}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  card-summit:
    backgroundColor: "{colors.navy-card}"
    rounded: "{rounded.xl}"
    padding: "24px"
  badge:
    backgroundColor: "{colors.navy-surface}"
    textColor: "{colors.cyan-primary}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
---

# Design System: XOps Conference

## 1. Overview

**Creative North Star: "The Stage"**

XOps Conference is a theatre where every scroll is an act. The dark navy void is the stage before the lights come up — deep, expectant, charged. Cyan cuts through it like a spotlight. Gold lands like an ovation. The experience should feel like arriving at a venue where something important is about to happen: not a website, but a lobby.

The system operates in two registers at once: the **Summit** (founders, CEOs, CTOs — exclusive, global, high-stakes) and the **Conference** (developers, engineers, hackers — technical, peer-to-peer, hands-on). Both share the same dark stage; the Summit gets the gold, the Conference gets the cyan. Neither feels like the other's afterthought.

This system explicitly rejects: generic tech event design (Bootstrap defaults, gradient-text hero), enterprise conference wallpaper (full-width stock photos + sans-serif grid), and anything that could pass for "another React conference".

**Key Characteristics:**
- Deep navy field, not black — tinted blue-violet, never neutral
- Two accent temperatures: cool cyan for technical, warm gold for executive
- High-contrast typography using Raleway for display, Lato for body
- Motion used sparingly and purposefully; respects `prefers-reduced-motion`
- Cards use subtle surface elevation, not border-left stripes

## 2. Colors: The Stage Palette

Deep navy base with two signal accents — cyan for technical precision, gold for executive weight.

### Primary
- **Stage Navy** (`#0A0F2E`): The ground. Page backgrounds, hero sections. Never pure black.
- **Curtain Cyan** (`#00BCD4`): Main interactive accent. CTA buttons, links, active states, Conference track.
- **Spotlight Gold** (`#FFD600`): Executive accent. Summit track CTAs, high-value highlights. Used at ≤15% of any screen.

### Secondary
- **Elevated Navy** (`#111840`): Cards, nav backgrounds, content surfaces lifted off the stage.
- **Deep Card** (`#0D1238`): Deeper card surfaces, footers, secondary sections.
- **Warm Amber** (`#f59e0b`): Softer gold for speaker tags, date pills, warm callouts.

### Neutral
- **Steel Mist** (`#B0BEC5`): Secondary text, captions, speaker metadata.
- **Slate Dim** (`#94a3b8`): Tertiary text, dividers, disabled states.
- **Stage White** (`#f8fafc`): Primary text on dark backgrounds. Never pure `#ffffff` in body copy.

### Named Rules
**The Two Temperatures Rule.** Cyan and gold never appear adjacent as equals — one leads, one supports. On a Summit page section, gold leads. On a Conference page section, cyan leads. Mixed sections default to cyan.

**The Stage Is Never Black.** Page backgrounds use `#0A0F2E` or `#111840`. Raw `#000000` is reserved for the footer only.

## 3. Typography

**Display Font:** Raleway (900, 700 weights)
**Body Font:** Lato (400, 700 weights)
**Label Font:** Poppins (600 weight, navigation and UI labels)

**Character:** Raleway's geometric caps give stage-scale authority to headlines; Lato's humanist warmth keeps body copy readable in long-form agenda and speaker sections. Poppins handles the small UI layer — nav, tags, chips — with clean precision.

### Hierarchy
- **Display** (900, `clamp(2.5rem, 6vw, 3.5rem)`, lh 1.2): Section heroes, event names, city callouts. Letter-spacing −0.02em for cinematic density.
- **Headline** (700, `2rem`, lh 1.3): Section titles, speaker names, track headers.
- **Title** (700, `1.25rem`, lh 1.4): Card titles, agenda item headers, workshop names.
- **Body** (400, `1rem`, lh 1.7): Speaker bios, agenda descriptions, sponsor copy. Max line-length 68ch.
- **Label** (Poppins 600, `0.875rem`, ls 0.04em): Navigation links, badge text, CTA micro-copy. All-caps where used as category tags.

### Named Rules
**No gradient text.** Emphasis is weight and size, not rainbow fills. Speaker names use `#f8fafc`; section titles use `#00BCD4` or `#FFD600` as a single solid colour maximum.

## 4. Elevation

The system uses **tonal layering**, not drop shadows. Depth is expressed through background value steps:

1. `#0A0F2E` — base stage (page root)
2. `#111840` — primary surfaces (nav, footer, section dividers)
3. `#0D1238` / `#16213e` — cards, modals, content panels
4. `rgba(0,0,0,0.3)` overlay for `--card-shadow` on interactive cards

No spread shadows except for CTAs, where a subtle `0 8px 24px rgba(0,188,212,0.3)` glow reinforces the cyan accent on hover.

## 5. Components

**Buttons:**
- Primary: `#00BCD4` fill, `#0A0F2E` text, pill radius. Hover: `#26C6DA`. Glow `0 8px 24px rgba(0,188,212,0.25)` on hover.
- Gold CTA (Summit): `#FFD600` fill, `#0A0F2E` text, pill radius.
- Outline: transparent fill, `#00BCD4` 1px border and text, pill radius.
- All buttons: Poppins 600, 0.04em letter-spacing, no all-caps.

**Cards:**
- Background `#0D1238` or `#16213e`. Border `1px solid #2a3a5a`. Radius `20px`–`28px`.
- Hover: border lifts to `rgba(0,188,212,0.35)`, subtle `translateY(-2px)` transform.
- No `border-left` accent stripes. No nested cards.

**Badges / Tags:**
- Pill shape (999px). `#111840` bg + `#00BCD4` text for tech tags. `#111840` + `#FFD600` for summit/VIP tags.
- Font: Poppins 600, 0.75rem, 0.04em spacing.

**Navigation:**
- Background `#0f0f1a` or `#1a1a2e` (sticky). Text `#ffffff`. Active: `#00BCD4`.
- No underlines; active state uses cyan color only.

## 6. Do's and Don'ts

**Do:**
- Use `#0A0F2E` or `#111840` for every background surface — the stage is always on.
- Lead with the city (Dubai / Spain) as a visual anchor in hero sections.
- Let Raleway 900 own the display hierarchy; don't compete with a second heavy face.
- Respect `prefers-reduced-motion`: all entrance animations behind a media query.
- Use cyan for Conference track callouts, gold for Summit track callouts — consistently.

**Don't:**
- Use `background-clip: text` + gradient for any heading — ever.
- Stack two cards inside each other (nested cards).
- Use `border-left` as a colored accent on any list item or callout.
- Use raw `#000000` as a surface (footer only, and even then with restraint).
- Add glassmorphism blur effects as decoration — use tonal surfaces instead.
- Place cyan and gold at equal visual weight in the same component.
