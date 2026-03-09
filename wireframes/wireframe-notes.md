# Wireframe Notes — Hello Homeowners

## Screen Inventory

All wireframes are in the shared Figma file, organized by page. Each screen has a desktop (1440x900px) and mobile (375x812px) frame.

### Figma Page Structure

| Page | Page ID | Contents |
|---|---|---|
| 00 — Journey Map | `0:1` | Bird's-eye flow diagram of all 9 screens with annotations |
| 00 — Transitions | `1:2` | 4 key transition-state frames |
| 01 — Landing | `1:3` | Desktop (`2:2`) + Mobile (`2:3`) |
| 02 — Big Picture | `1:4` | Desktop (`2:40`) + Mobile (`2:41`) |
| 03 — Investor Map | `1:5` | Desktop (`2:59`) + Mobile (`2:60`) |
| 04 — Timeline | `1:6` | Desktop (`2:76`) + Mobile (`2:77`) |
| 05 — Who Gets Hurt | `1:7` | Desktop (`2:90`) + Mobile (`2:91`) |
| 06 — Things You Should Know | `1:8` | Desktop Renter (`2:105`) + Desktop Owner (`2:106`) + Mobile Renter (`2:107`) + Mobile Owner (`2:108`) |
| 07 — The Other Side | `1:9` | Desktop (`2:136`) + Mobile (`2:137`) |
| 08 — Policy & Action | `1:10` | Desktop (`2:148`) + Mobile (`2:149`) |
| 09 — Closing | `1:11` | Desktop (`2:170`) + Mobile (`2:171`) |

---

## Screen-by-Screen Notes

### Screen 1: Landing
- **Layout**: Centered single-column. Full-viewport, minimal, inviting.
- **Form fields**: Income bracket (dropdown), Race/ethnicity (dropdown), Housing status (Renter/Owner toggle), Neighborhood (searchable dropdown)
- **Toggle design**: Two-segment button, active segment uses `--color-you` (#0077B6)
- **CTA**: "Show me my data" — full-width button in `--color-you`
- **Form data source**: Options populated from `data/clean/personalization-schema.json`
- **Validation**: Inline error state needed if fields empty on submit
- **Loading state**: After submit, brief loading skeleton before Screen 2 reveals
- **Empty/error state**: If neighborhood not found in dataset, show "We don't have specific data for [input]. Showing Boston-wide data instead."

### Screen 2: Big Picture
- **Layout**: Centered hero layout. Sticky demographic bar at top (appears here, persists through Screen 9).
- **Chart**: `hero-stat.js` — Animated number counter. "1 in 5" in large monospace type (72px desktop / 40px mobile).
- **Personalization**: YOU callout box below counter with neighborhood-specific rate (dashed blue border)
- **Scroll indicator**: "Scroll to explore" text at bottom
- **Source**: "MAPC Homes for Profit, 2004-2018 transaction data"
- **Empty/error state**: If no neighborhood-specific data, show metro average only.

### Screen 3: Investor Map
- **Layout**: 2-column scrollytelling. Left: narrative text + toggle + side panel. Right: sticky choropleth map.
- **Chart**: `choropleth.js` — Sequential color scale (cream-to-crimson, 7 bins). User's tract highlighted with 3px blue outline.
- **Interactions**: Hover/tap tooltips on map tracts. Investor type toggle (All / Corporate / Small LLC / Individual).
- **Side panel**: Blue-bordered YOU callout with neighborhood stats and investor type breakdown.
- **Legend**: Below map — gradient scale from "Low" to "High"
- **Empty/error state**: If user's tract lacks data, highlight nearest tract cluster and note data gap.

### Screen 4: Timeline
- **Layout**: 2-column scrollytelling. Left: scrolling text steps. Right: sticky chart.
- **Chart**: `timeline.js` — Multi-line / area chart. User's neighborhood in blue (`--color-you`), metro average in gray.
- **Annotated inflection points**: 2008 Financial Crisis, 2012-14 institutional surge, 2020-21 COVID spike.
- **Interaction**: Lines draw left-to-right as user scrolls. Hover for year-by-year values.
- **Personalization**: Callout text dynamically references user's neighborhood growth rate.
- **Empty/error state**: If neighborhood has insufficient time-series data, show metro average only with note.

### Screen 5: Who Gets Hurt
- **Layout**: 2-column scrollytelling. Left: narrative + metric toggle + YOU callout. Right: stacked chart area.
- **Charts**:
  - `demographic-bars.js` — Grouped bar chart (income x race). User's group highlighted with `--color-you`.
  - `eviction-dots.js` — Dot/strip chart overlay showing eviction rate distribution.
- **Toggle**: Switch between Eviction Rate | Price Impact | Displacement metrics.
- **Personalization**: Callout shows user's specific demographic intersection data.
- **Note**: Per narrative flag #4, eviction-ownership correlations use "associated with" language, not causal.
- **Empty/error state**: If user's demographic intersection has small sample, note margin of error.

### Screen 6: Things You Should Know
- **Layout**: Full-width with internal scrolling sections. This is the BRANCH POINT.
- **Track toggle**: Renter (warm accent #D4845A) / Owner (cool accent #5B8DB8). Default matches user's Landing input.
- **Renter track** (warm background #FDF5EF):
  - 6A: `landlord-type-donut.js` — Donut chart of landlord types in user's neighborhood
  - 6B: `eviction-by-owner.js` — Horizontal bar chart, eviction filing rates by landlord type
  - 6D: `neighborhood-value.js` — Strip/dot plot, rent affordability across neighborhoods
- **Owner track** (cool background #EFF5FA):
  - 6E: `price-income-gauge.js` — Radial gauge, price-to-income ratio
  - 6F: `cash-buyer-competition.js` — Stacked bar/area, cash vs. financed sales
  - 6G: `rent-buy-breakeven.js` — Interactive line chart with slider
  - 6H: `investor-competition.js` — Ranked bar chart, lowest investor competition neighborhoods
- **Taller frames**: Both tracks need extended height (1400px renter, 1600px owner desktop) due to chart density.
- **Empty/error state**: Per-section fallback to Boston-wide averages with annotation.

### Screen 7: The Other Side
- **Layout**: 2-column scrollytelling. Left: narrative + nuance callout (green) + YOU personalized note (blue). Right: sticky chart.
- **Chart**: `comparison.js` — Slope/dumbbell chart showing before/after metrics.
- **Nuance callout**: Green-bordered box with balanced framing text.
- **Personalization**: Blue-bordered YOU note with neighborhood-specific comparison data.
- **Interaction**: Hover for before/after values. Toggle between metrics.
- **Empty/error state**: If user's area lacks before/after data, show nearest comparable neighborhood.

### Screen 8: Policy & Action
- **Layout**: Full-width. Title + body + sort bar + 2x2 card grid + caveat callout + CTA.
- **Chart**: `policy-cards.js` — Data-driven card layout. Each card shows: status badge, policy name, description, personalized impact, relevance indicator.
- **Sort/Filter**: By relevance to user, status, category.
- **Caveat callout**: Orange-bordered warning box, always visible (not dismissible).
- **CTA section**: "Contact your state representative" primary button + links to advocacy orgs.
- **7 policy cards total** (from policy-research.md): Rent Stabilization, 2026 Ballot, Transfer Fee, Condo Conversion, Affordable Homes Act, Just Cause Eviction, Corporate Transparency.
- **Extended height**: 1200px desktop to accommodate card grid.
- **Empty/error state**: If personalization data insufficient, show "general" relevance scores.

### Screen 9: Closing
- **Layout**: Centered. Title + 3 insight cards in row + body text + action buttons + credits.
- **Three key insight cards**: Blue-bordered, each with a large number (48px) + contextual label. Dynamically selected based on user's demographics.
- **Action buttons**: "Share your results" (primary), "Take action" (primary), "Explore more" (secondary/outlined).
- **Credits**: Source citation footer.
- **No chart**: Clean typographic layout. Optional subtle number animation.
- **URL sharing**: "Share your results" generates URL with query parameters preserving all personalization state.

---

## Chart Type Reference

| Screen | Chart Placeholder | D3 Module | Priority |
|---|---|---|---|
| 2 | ANIMATED NUMBER COUNTER | `hero-stat.js` | Critical |
| 3 | CHOROPLETH MAP | `choropleth.js` | Critical |
| 4 | MULTI-LINE / AREA CHART | `timeline.js` | Critical |
| 5 | GROUPED BAR CHART | `demographic-bars.js` | Critical |
| 5 | DOT/STRIP CHART OVERLAY | `eviction-dots.js` | Critical |
| 6 (renter) | DONUT CHART | `landlord-type-donut.js` | Supporting |
| 6 (renter) | HORIZONTAL BAR CHART | `eviction-by-owner.js` | Supporting |
| 6 (renter) | STRIP/DOT PLOT | `neighborhood-value.js` | Supporting |
| 6 (owner) | RADIAL GAUGE | `price-income-gauge.js` | Supporting |
| 6 (owner) | STACKED BAR/AREA | `cash-buyer-competition.js` | Supporting |
| 6 (owner) | INTERACTIVE LINE CHART | `rent-buy-breakeven.js` | Supporting |
| 6 (owner) | RANKED BAR CHART | `investor-competition.js` | Enrichment |
| 7 | SLOPE / DUMBBELL CHART | `comparison.js` | Enrichment |
| 8 | DATA-DRIVEN CARD LAYOUT | `policy-cards.js` | Enrichment |

---

## Shared Components

### Sticky Demographic Bar
- Appears after Screen 1 form submission, persists through Screens 2-9
- Dark background (`--color-neutral-900`), 48px height desktop / 40px mobile
- Shows: [Income] | [Race] | [Status] | [Neighborhood]
- Fixed position at top of viewport

### YOU Callout Box
- Light blue background (`--color-you-light` at 30% opacity)
- 2px solid `--color-you` (#0077B6) border
- 8px border-radius
- Text in `--color-you-dark` (#023E8A)
- Used on Screens 2, 3, 4, 5, 7, 9

### Tooltip Pattern
- Dark background (`--color-neutral-800`)
- White text, 14px Inter
- 8px 12px padding, 4px radius
- 280px max-width
- Line 1: bold location/group name. Line 2: primary value. Line 3: context comparison.

---

## Transition States

Documented on Figma page "00 — Transitions" (ID: `1:2`):

1. **Landing → Big Picture** (3 frames): Form submit → Loading skeleton → Hero stat reveal. Demographic bar animates into persistent header.
2. **Investor Map → Timeline** (3 frames): Map compresses horizontally → Axis line extends → Timeline draws. Space-to-time visual bridge.
3. **Screen 6 Track Split** (description): User's demographic bar expands → "What this means for YOU" transition text → Renter or owner track loads with color theme. 300ms crossfade toggle.
4. **Policy → Closing** (description): Cards compress → "Let's bring it all together" → Three key numbers appear. Demographic bar pulses.

---

## Responsive Considerations

- **Breakpoint**: 768px (below = mobile layout)
- **Desktop**: 2-column scrollytelling layout (60% chart / 40% text) for Screens 3, 4, 5, 7
- **Mobile**: Single column — chart stacked above text. Chart height: 60vh
- **Screen 6**: Full-width on both desktop and mobile. Charts stack vertically on mobile.
- **Screen 8**: Policy cards go from 2x2 grid (desktop) to single-column stack (mobile)
- **Screen 9**: Insight cards go from 3-across (desktop) to vertical stack (mobile)
- **Touch targets**: All buttons and interactive elements minimum 44px height
- **Typography**: All sizes use responsive scale from design-system.md (e.g., H1: 48px desktop / 32px mobile)

---

## Layout Flags

### Flag 1: Screen 6 Owner Track Height
The owner track has 4 chart sections (gauge, stacked bar, interactive line, ranked bar) requiring more vertical space than the renter track (3 sections). The frame is set to 1600px vs. 1400px for renter. The viz-engineer should ensure smooth scroll pacing despite the height difference between tracks.

### Flag 2: Screen 8 Card Density
7 policy cards in a 2-column grid creates significant scroll depth on desktop (3.5 rows). On mobile, this becomes 7 stacked cards. The viz-engineer should consider a "show more" pattern or accordion on mobile to reduce initial scroll length.

### Flag 3: Mobile Map Interaction
The choropleth map on mobile (327px wide) may have census tracts too small for tap targets. The viz-engineer should implement a "nearest point" touch algorithm or allow pinch-to-zoom. Small tracts should have expanded invisible hit areas.

---

## Exports

Key screen images should be exported to `wireframes/exports/` for the pitch deck. Priority exports:
- Journey Map overview
- Landing desktop
- Investor Map desktop (showing scrollytelling layout)
- Screen 6 renter/owner tracks side by side
- Closing desktop

---

## Data Notes for Wireframe Accuracy

- Income brackets: Under $35k, $35k-$75k, $75k-$125k, $125k-$200k, $200k+
- Race categories: White, Black, Hispanic/Latino, Asian, Other/Multiracial
- Housing status: Renter, Owner/Prospective Buyer
- Boston neighborhoods: 21 (Allston through West Roxbury)
- MAPC municipalities: 50+ (extended list in personalization-schema.json)
- Placeholder values in wireframes use Dorchester / Black / Renter / $75k-$125k as example persona
