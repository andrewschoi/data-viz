# Design System — Hello Homeowners

## Overview

This document is the canonical design system reference for the "Hello Homeowners" interactive data visualization. All agents (wireframe-designer, viz-engineer) must follow these specifications. The single source of truth for CSS token values is `src/css/variables.css` — this document explains the rationale, usage rules, and component patterns.

**Dark mode is out of scope.** This project targets light mode only. No agent should spend effort on dark mode variants. If dark mode is desired in the future, the token architecture supports it, but no dark values are defined.

---

## Color Tokens

All colors are defined as CSS custom properties in `src/css/variables.css`.

### Sequential Scale (Choropleth — Investor Concentration)

7 bins, warm cream-to-crimson. Colorblind-safe (deuteranopia, protanopia, tritanopia tested).

| Token | Hex | Bin |
|---|---|---|
| `--color-seq-1` | `#FFF8E7` | Lowest (minimal investor activity) |
| `--color-seq-2` | `#FEDCAC` | Low |
| `--color-seq-3` | `#FDB97A` | Below average |
| `--color-seq-4` | `#F59245` | Average |
| `--color-seq-5` | `#E06D2E` | Above average |
| `--color-seq-6` | `#C0392B` | High |
| `--color-seq-7` | `#8B1A1A` | Highest (extreme concentration) |

**Classification**: Quantile (7 bins). The viz-engineer calibrates the domain against actual data output. Threshold classification is acceptable if data distribution warrants it.

**Usage**: Choropleth map fill only. Never use sequential colors for categorical data.

### Categorical Palette (Demographics)

| Token | Hex | Contrast on White |
|---|---|---|
| `--color-cat-1` | `#5B8DB8` | 4.5:1 (AA) |
| `--color-cat-2` | `#D4845A` | 4.5:1 (AA) |
| `--color-cat-3` | `#7BAE7F` | Borderline — darken for text use |
| `--color-cat-4` | `#9B7BB8` | 4.5:1 (AA) |
| `--color-cat-5` | `#C9A84C` | Use `#8B7533` for text |
| `--color-cat-6` | `#CC7B7B` | 4.5:1 (AA) |
| `--color-cat-7` | `#6B9B9B` | 4.5:1 (AA) |

**Group-to-color mapping** (consistent across all visualizations):
| Group | Token |
|---|---|
| White | `--color-cat-1` |
| Black | `--color-cat-2` |
| Hispanic/Latino | `--color-cat-3` |
| Asian | `--color-cat-4` |
| Other/Multiracial | `--color-cat-5` |
| (Extended) | `--color-cat-6`, `--color-cat-7` |

Income brackets use the same categorical palette with pattern fill overlays for differentiation from race categories.

### "YOU" Highlight

| Token | Hex | Use |
|---|---|---|
| `--color-you` | `#0077B6` | Primary highlight for user's data |
| `--color-you-light` | `#90E0EF` | Callout box background tint |
| `--color-you-dark` | `#023E8A` | Text emphasis for personalized phrases |

**Rules:**
- The YOU color is ONLY for personalization. Never use it for decorative purposes.
- On choropleth: user's tract gets a 3px `--color-you` stroke outline, regardless of fill.
- In bar/dot charts: user's group uses `--color-you` fill; all other groups use their categorical color.
- In text: "your neighborhood" or "your income group" uses `--color-you-dark`.

### Neutral Palette

| Token | Hex | Role |
|---|---|---|
| `--color-neutral-50` | `#FAF8F5` | Page background |
| `--color-neutral-100` | `#F0EDE8` | Card/section backgrounds |
| `--color-neutral-200` | `#E0DCD6` | Borders, dividers |
| `--color-neutral-300` | `#C5C0B8` | Chart grid lines, disabled |
| `--color-neutral-400` | `#9E9890` | Placeholder text |
| `--color-neutral-500` | `#787068` | Captions, source text |
| `--color-neutral-600` | `#5C554D` | Secondary body text |
| `--color-neutral-700` | `#403A33` | Primary body text |
| `--color-neutral-800` | `#2A2520` | Headlines |
| `--color-neutral-900` | `#1A1614` | Maximum emphasis |

### Semantic Colors

| Token | Hex | Role |
|---|---|---|
| `--color-positive` | `#2E7D4F` | Good outcomes |
| `--color-positive-bg` | `#E8F5E9` | Positive callout bg |
| `--color-negative` | `#C0392B` | Bad outcomes |
| `--color-negative-bg` | `#FDEDED` | Negative callout bg |
| `--color-warning` | `#E67E22` | Mixed / caution |
| `--color-warning-bg` | `#FFF3E0` | Warning callout bg |
| `--color-info` | `#0077B6` | Informational |
| `--color-info-bg` | `#E3F2FD` | Info callout bg |

---

## Typography

### Font Stack

| Role | Font | Weights | Fallback |
|---|---|---|---|
| Headlines | DM Serif Display | 400 | Georgia, "Times New Roman", serif |
| Body / UI / Labels | Inter | 400, 500, 600, 700 | -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif |
| Hero Numbers | JetBrains Mono | 400, 700 | "SF Mono", "Fira Code", "Courier New", monospace |

**Google Fonts import** (placed in `<head>` or CSS `@import`):
```
https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap
```

### Type Scale

| Token | Desktop | Mobile | Weight | Font | Line Height | Letter Spacing |
|---|---|---|---|---|---|---|
| `--font-size-hero` | 72px | 40px | 400 | JetBrains Mono | 1.1 | -0.02em |
| `--font-size-h1` | 48px | 32px | 400 | DM Serif Display | 1.15 | -0.01em |
| `--font-size-h2` | 32px | 24px | 400 | DM Serif Display | 1.25 | 0 |
| `--font-size-h3` | 24px | 20px | 600 | Inter | 1.3 | 0 |
| `--font-size-h4` | 20px | 18px | 600 | Inter | 1.35 | 0 |
| `--font-size-body` | 18px | 16px | 400 | Inter | 1.6 | 0 |
| `--font-size-body-sm` | 16px | 14px | 400 | Inter | 1.5 | 0 |
| `--font-size-caption` | 14px | 12px | 400 | Inter | 1.4 | 0.01em |
| `--font-size-label` | 12px | 11px | 500 | Inter | 1.3 | 0.02em |
| `--font-size-overline` | 12px | 11px | 600 | Inter | 1.2 | 0.08em |

**Responsive breakpoint**: 768px. Below = mobile values, above = desktop values.

**Fluid scaling for hero elements:**
```css
.hero-stat { font-size: clamp(40px, 8vw, 72px); }
.screen-title { font-size: clamp(32px, 5vw, 48px); }
```

### Typography Rules

1. Maximum 2 font families per screen (DM Serif Display + Inter). JetBrains Mono reserved for hero stats only.
2. Never bold DM Serif Display — it has one weight and its design already commands attention.
3. All chart text uses Inter with `font-variant-numeric: tabular-nums`.
4. Minimum body text: 16px mobile, 18px desktop.
5. Uppercase only for `--font-size-overline` (category labels). Never for headlines or body.
6. Body text color: `--color-neutral-700`. Secondary: `--color-neutral-600`. Captions: `--color-neutral-500`.

---

## Spacing System

8px base grid. All spacing uses multiples of 8px.

| Token | Value | Use |
|---|---|---|
| `--space-1` | 4px | Tight internal padding (icon gaps, inline spacing) |
| `--space-2` | 8px | Default internal padding |
| `--space-3` | 12px | Small gaps (between label and chart) |
| `--space-4` | 16px | Component internal padding |
| `--space-5` | 24px | Card padding, small section gaps |
| `--space-6` | 32px | Between related content blocks |
| `--space-7` | 48px | Between sections within a screen |
| `--space-8` | 64px | Between screens (scroll sections) |
| `--space-9` | 96px | Major section dividers |
| `--space-10` | 128px | Screen top/bottom padding |

### Layout Widths

| Token | Value | Use |
|---|---|---|
| `--width-content` | 720px | Body text column (max-width) |
| `--width-chart` | 960px | Chart/visualization area |
| `--width-full` | 1200px | Full-width content area |
| `--width-sidebar` | 300px | Sidebar/annotation column (sticky chart layout) |

### Content Grid

- **Scrollytelling layout**: 2-column — sticky chart (60% width) + scrolling text (40% width)
- **Mobile**: Single column — chart above, text below (chart height: 60vh)
- **Breakpoints**: 768px (tablet/mobile switch), 1024px (narrow desktop), 1200px (full desktop)

---

## Component Patterns

### Cards

Used for: policy cards (Screen 8), personalized advice items (Screen 6), demographic breakdowns.

```
Background:   --color-neutral-100
Border:       1px solid --color-neutral-200
Border-radius: 8px
Padding:      --space-5 (24px)
Shadow:       0 1px 3px rgba(0,0,0,0.08)
Hover shadow: 0 4px 12px rgba(0,0,0,0.12)
Transition:   box-shadow --transition-duration-micro --transition-easing
```

**Card with accent**: Left border 4px solid accent color (semantic or YOU color).

### Tooltips

Used for: chart hover information across all visualizations.

```
Background:   --color-neutral-800
Text color:   --color-neutral-50
Font:         Inter, --font-size-caption (14px)
Padding:      --space-2 --space-3 (8px 12px)
Border-radius: 4px
Shadow:       0 2px 8px rgba(0,0,0,0.2)
Max-width:    280px
Arrow:        6px CSS triangle pointing toward trigger element
Entrance:     fade + translate-y 4px, --transition-duration-micro
```

**Tooltip content structure:**
- Line 1: Location/group name (bold)
- Line 2: Primary value (e.g., "Investor ownership: 28%")
- Line 3: Context (e.g., "Metro average: 15%")

### Annotations (In-Chart Labels)

Used for: direct chart annotations that explain a data point without requiring hover.

```
Font:         Inter, --font-size-caption, --color-neutral-700
Background:   --color-neutral-50 with 90% opacity
Padding:      --space-1 --space-2 (4px 8px)
Border-radius: 2px
Leader line:  1px --color-neutral-400
```

### Callout Boxes

Used for: personalized insights ("In your neighborhood, investor ownership is 2x the metro average").

```
Background:   --color-you-light (for YOU callouts) or semantic bg colors
Border-left:  4px solid --color-you (or semantic color)
Border-radius: 0 8px 8px 0
Padding:      --space-4 --space-5 (16px 24px)
Font:         Inter, --font-size-body, weight 400
Highlight:    Key phrase in --color-you-dark, weight 600
```

### Buttons

Used for: form submission (Landing), track toggle (Screen 6), policy action links (Screen 8).

**Primary button:**
```
Background:    --color-you
Text:          white (#FFFFFF)
Font:          Inter, --font-size-body-sm, weight 600
Padding:       --space-3 --space-5 (12px 24px)
Border-radius: 6px
Min-height:    44px (touch target)
Hover:         darken background 10%
Focus:         --focus-ring (see Accessibility)
Active:        translateY(1px)
Transition:    all --transition-duration-micro --transition-easing
```

**Secondary button:**
```
Background:    transparent
Border:        2px solid --color-you
Text:          --color-you
Hover:         background --color-you-light
```

**Track toggle (Screen 6):**
```
Two-segment toggle: Renter | Owner
Active segment:    --color-renter-accent or --color-owner-accent (depending on selection)
Inactive segment:  --color-neutral-100, text --color-neutral-600
Transition:        background-color --transition-duration-micro
```

### Form Inputs (Landing Screen)

```
Background:    white (#FFFFFF)
Border:        2px solid --color-neutral-300
Border-radius: 6px
Padding:       --space-3 --space-4 (12px 16px)
Font:          Inter, --font-size-body
Min-height:    44px
Focus:         border-color --color-you, box-shadow 0 0 0 3px --color-you-light
Label:         Inter, --font-size-body-sm, weight 500, --color-neutral-700
Helper text:   Inter, --font-size-caption, --color-neutral-500
```

### Section Dividers

Screens are separated by generous whitespace (`--space-10`), not by horizontal rules. If a visual separator is needed:

```
Width:         60px
Height:        3px
Color:         --color-neutral-300
Margin:        --space-8 auto
Border-radius: 2px
```

---

## Chart Styling Defaults

These defaults apply to ALL D3 visualizations. The viz-engineer must not hardcode values — use CSS custom properties.

### Axes

```
Axis line:     1px solid --color-neutral-300
Tick marks:    4px length, 1px --color-neutral-300
Tick labels:   Inter, --font-size-label (12px), --color-neutral-500
Axis title:    Inter, --font-size-caption (14px), weight 500, --color-neutral-600
Grid lines:    1px dashed --color-neutral-200 (horizontal only by default)
```

### Data Marks

```
Bar charts:    border-radius 2px on top corners
Dot/scatter:   5px radius default, 8px for highlighted/YOU
Line charts:   2px stroke width, 3px for highlighted series
Area charts:   fill-opacity 0.3, stroke-opacity 1
```

### Chart Container

```
Background:    --color-neutral-50 (or transparent if on a card)
Padding:       --space-5 (24px) on all sides
Title:         Inter, --font-size-h3 (24px), weight 600, --color-neutral-800
Subtitle:      Inter, --font-size-body-sm (16px), weight 400, --color-neutral-600
Source:        Inter, --font-size-caption (14px), weight 400, --color-neutral-400
               Format: "Source: [Name], [Year]"
```

### Legend

```
Position:      Top-left of chart area (not below, to avoid scroll issues)
Swatch:        12x12px rounded rect (2px radius)
Label:         Inter, --font-size-label (12px), --color-neutral-600
Spacing:       --space-3 (12px) between items
```

---

## Animation / Transition Tokens

| Token | Value | Use |
|---|---|---|
| `--transition-duration-enter` | 300ms | New elements appearing |
| `--transition-duration-update` | 500ms | Position/size/color changes |
| `--transition-duration-exit` | 200ms | Elements leaving |
| `--transition-duration-micro` | 150ms | Hover, focus, tooltips |
| `--transition-duration-hero` | 800ms | Hero stat counter |
| `--transition-easing` | cubic-bezier(0.4, 0, 0.2, 1) | Default (Material standard) |
| `--transition-easing-enter` | cubic-bezier(0.0, 0, 0.2, 1) | Deceleration (entering) |
| `--transition-easing-exit` | cubic-bezier(0.4, 0, 1, 1) | Acceleration (exiting) |
| `--transition-stagger-delay` | 30ms | Per-element cascade delay |

### Animation Rules

1. All scroll-triggered animations have `prefers-reduced-motion` fallbacks (see `design/accessibility.md`).
2. Maximum animation duration: 800ms (hero stat). Typical: 300ms.
3. Stagger cap: 1000ms total. Reduce per-element delay for large datasets.
4. Scroll up reverses the last animation step.
5. Animations resolve to end state if user scrolls quickly.

---

## Track Variants (Screen 6 — Things You Should Know)

Screen 6 splits into **Renter** and **Owner** tracks with distinct visual treatments.

### Renter Track

| Property | Value |
|---|---|
| Section background | `--color-renter-bg` (`#FDF5EF`) |
| Accent color | `--color-renter-accent` (`#D4845A`) |
| Toggle active state | `--color-renter-accent` background, white text |
| Card left border | 4px solid `--color-renter-accent` |
| Icon set | Home/apartment silhouette, key, shield (tenant rights) |

**Renter track charts**: landlord type donut, eviction risk bars, neighborhood value strip plot.

### Owner Track

| Property | Value |
|---|---|
| Section background | `--color-owner-bg` (`#EFF5FA`) |
| Accent color | `--color-owner-accent` (`#5B8DB8`) |
| Toggle active state | `--color-owner-accent` background, white text |
| Card left border | 4px solid `--color-owner-accent` |
| Icon set | House silhouette, dollar sign, chart-up (equity) |

**Owner track charts**: price-income gauge, cash buyer competition, rent-buy breakeven, investor competition bars.

### Toggle Behavior

- Default track matches user's input on the Landing screen (renter = renter track, owner = owner track)
- User can switch tracks via the toggle to see the other perspective
- Track switch uses a 300ms crossfade (`--transition-duration-enter`)
- Charts within the new track animate in (staggered entrance)
- `prefers-reduced-motion`: instant swap, no crossfade

---

## Design Token Governance

- `src/css/variables.css` is the single source of truth for all token values.
- The viz-engineer's `styles.css` must `@import` variables.css.
- No hardcoded color, font-size, spacing, or animation values anywhere in the codebase.
- If a new token is needed, add it to `variables.css` and document it here.
- Token naming convention: `--{category}-{name}` (e.g., `--color-you`, `--space-4`, `--font-size-h1`).
