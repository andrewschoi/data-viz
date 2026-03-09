# Visualization Specifications — Hello Homeowners

All chart modules live in `src/js/charts/`. Each follows the API: `create(container, data, options)`, `update(data, options)`, `highlight(demographic)`.

## Architecture

```
src/
├── index.html          # 9 semantic screen sections with narrative copy
├── css/
│   ├── variables.css   # Design tokens (imported, not modified)
│   └── styles.css      # Global styles, layout, components, responsive
├── js/
│   ├── main.js         # Entry: scroll controller, personalization, lazy-load
│   ├── charts/         # 14 chart modules
│   └── utils/          # Shared utilities (scroll, tooltip, scales, personalize)
```

## Utility Modules

| Module | Purpose |
|---|---|
| `personalize.js` | Form capture, global state, URL params, state broadcasting |
| `scroll.js` | IntersectionObserver for scrollytelling steps and section lazy-loading |
| `tooltip.js` | Singleton tooltip element with show/hide/format helpers |
| `scales.js` | CSS variable reader, color scales, formatting, reduced motion check |

## Chart Modules

### Priority 1: Critical (Screens 2-5)

| Module | Screen | Chart Type | Data File | Key Features |
|---|---|---|---|---|
| `hero-stat.js` | 2 — Big Picture | Animated counter | `hero-stats.json` | Animated reveal, secondary stats, personalized callout |
| `choropleth.js` | 3 — Investor Map | Horizontal bar chart | `neighborhood-investor-rates.json` | Sorted bars with sequential color scale, user neighborhood highlight, tooltips |
| `timeline.js` | 4 — Timeline | Multi-line chart | `timeline-corp-ownership.json` | All neighborhoods faded, user's line highlighted, inflection annotations, hover crosshair |
| `demographic-bars.js` | 5 — Who Gets Hurt | Grouped bar chart | `demographic-bars.json` | Income and race groups, staggered entrance, category separation |
| `eviction-dots.js` | 5 — Who Gets Hurt | Dot/strip chart | `eviction-by-tract.json` | Jittered dots, median line, outlier capping at 95th percentile |

### Priority 2: Supporting (Screen 6)

| Module | Screen | Track | Chart Type | Data File |
|---|---|---|---|---|
| `landlord-type-donut.js` | 6A | Renter | Donut chart | `landlord-type-donut.json` |
| `eviction-by-owner.js` | 6B | Renter | Stacked horizontal bar | `eviction-by-owner-type.json` |
| `neighborhood-value.js` | 6D | Renter | Strip/dot plot | `neighborhood-value.json` |
| `price-income-gauge.js` | 6E | Owner | Horizontal bar | `price-income-gauge.json` |
| `cash-buyer-competition.js` | 6F | Owner | Area + line chart | `cash-buyer-competition.json` |
| `rent-buy-breakeven.js` | 6G | Owner | Interactive line chart | `rent-buy-breakeven.json` |
| `investor-competition.js` | 6H | Owner | Ranked bar chart | `investor-competition.json` |

### Priority 3: Enrichment (Screens 7-8)

| Module | Screen | Chart Type | Data File |
|---|---|---|---|
| `comparison.js` | 7 — The Other Side | Dumbbell/slope chart | `comparison-neighborhood-change.json` |
| `policy-cards.js` | 8 — Policy & Action | Data-driven cards | `policy-cards.json` |

## Technical Notes

### Data Loading
- All data loaded via `fetch()` from `../../data/clean/` (relative to `src/`)
- Data is cached in memory after first load
- Charts are lazy-loaded when their section enters the viewport (200px margin)

### Personalization
- State stored in `personalize.js` module
- Broadcast to all charts via `subscribe()` callback
- Persisted in URL query parameters: `?income=75k_125k&race=black&status=renter&neighborhood=Dorchester`
- Form populated from `personalization-schema.json`

### Accessibility
- All SVGs have `role="img"`, `aria-label`, and `aria-describedby`
- Interactive chart elements have `tabindex="0"` and keyboard handlers
- `prefers-reduced-motion` checked via `getDuration()` utility
- Skip-to-content link
- `aria-live` region for dynamic announcements
- Focus-visible styles from `variables.css`

### Responsive
- Scrollytelling: 2-column desktop (60/40 split), single-column mobile
- Breakpoint: 768px
- SVGs use `viewBox` for scaling
- Touch targets: 44px minimum via CSS custom property

### Narrative Flags Respected
1. Corporate ownership vs purchasing distinction: choropleth shows ownership rates with clear labeling
2. Eviction data window: sources cite 2020-2022 as reliable period
3. Cash sale proxy: labeled as "no mortgage recorded" not "cash purchases"
4. Corp-eviction correlation: uses "associated with" language, not causal
5. Investor categories: uses explicit categories (institutional, large, medium, small)

## How to Run

```bash
cd /Users/andrewchoi/Desktop/nuri/src
python3 -m http.server 8000
# Open http://localhost:8000
```

Or from project root:
```bash
cd /Users/andrewchoi/Desktop/nuri
python3 -m http.server 8000
# Open http://localhost:8000/src/
```
