# Accessibility Specification — Hello Homeowners

## Overview

This document defines accessibility requirements beyond color contrast (which is covered in `color-study.md` and `design-system.md`). All specifications must be implemented by the viz-engineer. Accessibility is not optional — it is a graded component of the project.

**Target conformance**: WCAG 2.1 Level AA.

---

## 1. Motion Sensitivity — `prefers-reduced-motion` Policy

### Policy

All animations and transitions in the project must respect the `prefers-reduced-motion: reduce` media query. The approach is **opt-out**: animations play by default, but are suppressed for users who have enabled reduced motion in their OS settings.

### Implementation

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

The viz-engineer must also check this preference in JavaScript for D3 transitions:

```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Use in D3 transitions:
selection.transition()
  .duration(prefersReducedMotion ? 0 : 300)
  .attr('opacity', 1);
```

### Animation Classification

| Animation | Essential? | Reduced-Motion Fallback |
|---|---|---|
| Hero stat number counter (Screen 2) | Yes — conveys the number | Show final number immediately |
| Choropleth bin fade-in (Screen 3) | Yes — progressive reveal | Show all bins simultaneously |
| User's tract highlight stroke (Screen 3) | Yes — identifies location | Static solid stroke |
| Map zoom to user area (Screen 3) | Yes — spatial orientation | Jump to final view, no interpolation |
| Timeline progressive draw (Screen 4) | Yes — temporal narrative | Show complete chart |
| Bar group staggered entrance (Screen 5) | Yes — sequential reveal | Show all bars immediately |
| Dot cascade entrance (Screen 5) | Yes — data reveal | Show all dots immediately |
| Track switch crossfade (Screen 6) | Yes — indicates content change | Instant swap |
| Chart enter animations (Screen 6) | Yes — data reveal | Show immediately |
| Slope/dumbbell line draw (Screen 7) | Yes — comparison reveal | Show complete |
| Card sort/filter reflow (Screen 8) | Yes — spatial reorientation | Instant reposition |
| Summary stat count-up (Screen 9) | Yes — conveys numbers | Show final numbers |
| Background gradient shift (Screen 1) | No — decorative | Static gradient |
| Form focus transitions (Screen 1) | No — decorative | Instant focus style |
| Hover scale/brightness effects | No — decorative | Instant state change |
| Card hover shadow expansion | No — decorative | Static shadow |
| Stat emphasis pulse (Screen 2) | No — decorative | No pulse |
| Policy card entrance stagger (Screen 8) | No — decorative | Show all cards immediately |

**Key rule**: "Essential" animations still need fallbacks — the fallback is just the end-state shown instantly. "Decorative" animations are fully suppressed.

---

## 2. Focus States

### Visible Focus Ring

All interactive elements must show a visible focus ring when navigated via keyboard. The focus ring must meet WCAG 2.1 AA requirements: 3:1 contrast ratio against adjacent colors.

**Focus ring specification:**

```css
:focus-visible {
  outline: 3px solid var(--color-you);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Remove default outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

**Focus ring color**: `--color-you` (`#0077B6`) provides:
- 4.6:1 contrast against `--color-neutral-50` (page background) — passes AA
- 4.3:1 contrast against white (`#FFFFFF`) — passes AA
- 3.2:1 contrast against `--color-neutral-100` (card background) — passes AA for non-text

### Element-Specific Focus Styles

| Element | Focus Style |
|---|---|
| Buttons (primary) | 3px `--color-neutral-800` outline (contrasts with blue button background) |
| Buttons (secondary) | 3px `--color-you` outline |
| Form inputs | Border changes to `--color-you`, plus `box-shadow: 0 0 0 3px var(--color-you-light)` |
| Chart regions (map tracts, bars) | 3px `--color-you` outline + tooltip appears |
| Policy cards | 3px `--color-you` outline + slight elevation increase |
| Track toggle segments | 3px `--color-you` outline around the active segment |
| Links in body text | Standard focus ring + underline persists |

### Focus Order

The focus order must follow the visual reading order (top to bottom, left to right):

1. Skip-to-content link (hidden until focused)
2. Landing form inputs (income, race, renter/owner, neighborhood)
3. Submit button
4. Each screen's interactive elements in visual order
5. Track toggle on Screen 6
6. Policy cards on Screen 8

---

## 3. Chart Alt Text Templates

Every SVG chart must have both an `aria-label` (brief) and an `aria-describedby` (detailed description in a visually hidden element). The viz-engineer populates these dynamically based on the data.

### Screen 2 — Big Picture (Hero Stat)

```
aria-label: "[Number] [unit] — [brief context]"
Example: "38% of residential purchases in Boston were made by investors in 2023"

aria-describedby text:
"This statistic shows that [number] [unit] [context]. This is [comparison to baseline].
For your demographic group ([user's group]), the figure is [personalized number]."
```

### Screen 3 — Investor Map (Choropleth)

```
aria-label: "Map of Boston metro area showing investor ownership concentration by census tract.
Darker areas indicate higher investor activity."

aria-describedby text:
"Choropleth map with [N] census tracts colored from light yellow (lowest investor
concentration, [min]%) to dark red (highest, [max]%). Your neighborhood,
[neighborhood name], has [X]% investor ownership, which is [above/below/near] the
metro average of [avg]%. The areas with highest investor concentration include
[top 3 neighborhood names]. The areas with lowest include [bottom 3]."
```

### Screen 4 — Timeline

```
aria-label: "Line chart showing investor purchase activity from [start year] to [end year]
in the Boston metro area."

aria-describedby text:
"Investor purchases [increased/decreased] from [start value] in [start year] to
[end value] in [end year]. Key inflection points: [year 1] ([event/context]),
[year 2] ([event/context]). In your neighborhood ([name]), investor activity
was [comparison to metro trend]."
```

### Screen 5 — Who Gets Hurt (Grouped Bars)

```
aria-label: "Grouped bar chart showing housing outcomes by income bracket and race
in the Boston metro area."

aria-describedby text:
"This chart shows [metric] across [N] income brackets, broken down by [N] racial
groups. The group most affected is [group] in the [bracket] income range at [value].
The least affected is [group] at [value]. Your group ([user's group]) shows [value],
which is [X]% [above/below] the overall average of [avg]."
```

### Screen 5 — Eviction Dots

```
aria-label: "Dot plot showing eviction filing rates by neighborhood and demographic group."

aria-describedby text:
"Each dot represents a neighborhood's eviction filing rate for a demographic group.
Rates range from [min] to [max] per 1,000 renters. The neighborhoods with highest
eviction rates are [top 3]. Your neighborhood ([name]) has a rate of [value],
which is [comparison]."
```

### Screen 6 — Renter Track Charts

**Landlord Type Donut:**
```
aria-label: "Donut chart showing breakdown of landlord types in [user's neighborhood]."
aria-describedby: "In [neighborhood], [X]% of rental units are owned by individual
landlords, [X]% by LLCs/corporate entities, [X]% by institutional investors, and
[X]% by other types. The [largest type] is the dominant owner type."
```

**Eviction Risk by Owner Type:**
```
aria-label: "Horizontal bar chart comparing eviction filing rates by property owner type."
aria-describedby: "Properties owned by [highest type] have an eviction filing rate of
[value], compared to [lowest type] at [value]. The overall average is [avg]."
```

**Neighborhood Value Strip:**
```
aria-label: "Strip plot showing rent affordability across Boston-area neighborhoods."
aria-describedby: "Neighborhoods ranked by rent-to-income ratio. Most affordable:
[top 3]. Least affordable: [bottom 3]. Your neighborhood ([name]) ranks [N] of [total]."
```

### Screen 6 — Owner Track Charts

**Price-Income Gauge:**
```
aria-label: "Gauge showing home price to income ratio for [user's income bracket]
in [user's neighborhood]."
aria-describedby: "The price-to-income ratio is [value], meaning the median home costs
[value] times the median annual income for your bracket. A ratio above [threshold]
is generally considered unaffordable."
```

**Cash Buyer Competition:**
```
aria-label: "Stacked bar chart showing proportion of cash versus financed home sales
over time."
aria-describedby: "Cash purchases have [increased/decreased] from [start]% in [year]
to [end]% in [year]. In your neighborhood, cash buyers account for [X]% of recent sales."
```

**Rent-Buy Breakeven:**
```
aria-label: "Interactive line chart showing the financial breakeven point between
renting and buying."
aria-describedby: "Based on current prices and rents in [neighborhood], buying becomes
financially preferable to renting after approximately [N] years, assuming [assumptions].
Adjust the slider to change assumptions."
```

### Screen 7 — The Other Side (Comparison)

```
aria-label: "Slope chart comparing neighborhood outcomes before and after significant
investor activity."
aria-describedby: "This chart shows [metric] in [N] neighborhoods, comparing the period
before investor entry ([years]) to after ([years]). [N] neighborhoods showed improvement,
[N] showed decline. Key finding: [summary]."
```

### Screen 8 — Policy Cards

```
aria-label: "Collection of [N] current Massachusetts housing policy proposals with
relevance ratings."
aria-describedby: "Policy cards sorted by relevance to your profile. Top recommendation:
[policy name] — [brief description]. This would [expected impact on user's group].
[N] policies are rated highly relevant to your situation."
```

---

## 4. Keyboard Navigation

### Global Keyboard Shortcuts

| Key | Action |
|---|---|
| Tab | Move focus to next interactive element |
| Shift+Tab | Move focus to previous interactive element |
| Enter / Space | Activate focused button, expand focused card, show tooltip on focused chart element |
| Escape | Close tooltip, close expanded card, dismiss overlay |
| Arrow keys (on chart) | Navigate between data points within a focused chart |

### Chart-Specific Keyboard Interaction

**Choropleth map (Screen 3):**
- Tab to the map container, then use arrow keys to navigate between census tracts
- Focus order: tracts sorted by investor concentration (highest first) for efficiency
- Enter/Space: shows tooltip for focused tract
- User's tract is the first tab stop within the map

**Bar charts (Screens 5, 6):**
- Tab to chart container, arrow keys move between bars (left/right for grouped, up/down for horizontal)
- Enter/Space: shows tooltip for focused bar
- User's bar is the first tab stop

**Line/area charts (Screens 4, 6):**
- Tab to chart container, left/right arrows move along the time axis
- A sonification option (stretch goal): audible tone maps to Y value as user arrows through time

**Donut chart (Screen 6):**
- Tab to chart, arrow keys rotate through segments
- Enter/Space: shows tooltip for focused segment

**Policy cards (Screen 8):**
- Tab moves between cards
- Enter: expands card to show full details
- Escape: collapses expanded card

### Skip Link

A "Skip to main content" link must be the first focusable element on the page, hidden until focused:

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 1000;
  padding: var(--space-3) var(--space-5);
  background: var(--color-you);
  color: white;
  font-family: var(--font-family-body);
  font-size: var(--font-size-body);
  text-decoration: none;
}

.skip-link:focus {
  top: 0;
}
```

---

## 5. Text Contrast Verification

All text must meet WCAG AA contrast requirements.

| Text Type | Minimum Contrast | Our Implementation | Passes? |
|---|---|---|---|
| Body text (normal, <18px bold / <24px) | 4.5:1 | `--color-neutral-700` on `--color-neutral-50` = 10.2:1 | Yes (AAA) |
| Secondary text | 4.5:1 | `--color-neutral-600` on `--color-neutral-50` = 6.4:1 | Yes (AA) |
| Caption/source text | 4.5:1 | `--color-neutral-500` on `--color-neutral-50` = 4.8:1 | Yes (AA) |
| Large headlines (>=24px or >=18.66px bold) | 3:1 | `--color-neutral-800` on `--color-neutral-50` = 13.8:1 | Yes (AAA) |
| Chart axis labels | 4.5:1 | `--color-neutral-500` on `--color-neutral-50` = 4.8:1 | Yes (AA) |
| Placeholder text | 3:1 (not required for AA, but recommended) | `--color-neutral-400` on white = 3.2:1 | Yes (large text) |
| YOU text emphasis | 4.5:1 | `--color-you-dark` (#023E8A) on `--color-neutral-50` = 9.1:1 | Yes (AAA) |
| Tooltip text | 4.5:1 | `--color-neutral-50` on `--color-neutral-800` = 13.8:1 | Yes (AAA) |
| Button text (primary) | 4.5:1 | White on `--color-you` (#0077B6) = 4.6:1 | Yes (AA) |

### Track Background Contrast

| Context | Contrast | Passes? |
|---|---|---|
| Body text on renter bg (`--color-neutral-700` on `#FDF5EF`) | ~9.5:1 | Yes (AAA) |
| Body text on owner bg (`--color-neutral-700` on `#EFF5FA`) | ~9.6:1 | Yes (AAA) |

---

## 6. Touch Targets

All interactive elements must have a minimum touch target size of **44x44px** on mobile devices (WCAG 2.1 Success Criterion 2.5.5).

### Implementation

| Element | Min Size | Notes |
|---|---|---|
| Buttons | 44px height | Enforced by `min-height` in CSS |
| Form inputs | 44px height | Enforced by `min-height` |
| Form select/dropdown | 44px height | Native select element, or custom with 44px trigger |
| Track toggle segments | 44px height | Each segment is independently tappable |
| Chart hover regions | 44x44px | Map tracts: handled by SVG path size (most are >44px). For small tracts, expand the hit area with an invisible stroke. Bars: ensure minimum bar width of 44px or group narrow bars. |
| Policy cards | 44px minimum height | Cards are much larger than 44px |
| Tooltip close button (if present) | 44x44px | Or dismiss on tap outside |

### Small Chart Elements

For scatter/dot plots where individual dots may be <44px:

- **On mobile**: Increase dot radius to 22px minimum, or implement a "nearest point" touch algorithm that selects the closest data point to the touch location
- **On desktop**: Standard sizes are acceptable since mouse precision is higher

---

## 7. Screen Reader Considerations

### Semantic HTML

- Use `<main>`, `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>` elements
- Each screen section uses `<section aria-labelledby="screen-N-title">`
- Charts are wrapped in `<figure>` with `<figcaption>`
- Form inputs have associated `<label>` elements (not placeholder-only)

### Live Regions

For dynamic content updates (personalization changes, chart data updates):

```html
<div aria-live="polite" aria-atomic="true" class="sr-only" id="data-announce">
  <!-- JS updates this when personalization changes -->
  <!-- e.g., "Data updated for your selections: income $50K-$75K, Black, Renter, Dorchester" -->
</div>
```

### SVG Accessibility

Every SVG chart element:

```html
<svg role="img" aria-label="[brief description]" aria-describedby="[desc-id]">
  <title>[Same as aria-label]</title>
  <desc id="[desc-id]">[Detailed description from templates above]</desc>
  <!-- chart content -->
</svg>
```

### Visually Hidden Text Utility

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## 8. Language & Reading Level

- All narrative text targets a **Flesch-Kincaid grade level of 8-10** (accessible to general public)
- Avoid jargon; if technical terms are necessary (e.g., "LLC," "institutional investor"), provide inline definitions
- Numbers should be formatted for readability: use commas, appropriate decimal places, and units
- Percentages and ratios should include context ("28%, or roughly 1 in 4 homes")
