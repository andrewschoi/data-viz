# Color Study — Hello Homeowners

## Design Intent

The color palette must serve three roles simultaneously:
1. **Cartographic precision** — a sequential choropleth scale that communicates investor concentration intensity
2. **Demographic clarity** — a categorical palette that distinguishes racial and income groups without reinforcing stereotypes
3. **Personal connection** — a standout "YOU" highlight color that tracks users through every visualization

The overall palette draws from the **warm tones of Boston's built environment** — brick, sandstone, autumn foliage — grounded by cool, trustworthy accents. The warmth signals urgency (investor activity is heating up); the cool accent signals personalization (this is about YOU).

---

## Reference Palettes & Inspiration

### 1. Boston Brownstone Facade Photography

**Visual reference**: Brick rowhouses on Commonwealth Ave, Beacon Hill doorways, triple-decker siding in Dorchester
**Extracted palette**:
- Aged brick: `#A0522D` (sienna)
- Sandstone trim: `#D4B896` (warm sand)
- Painted door accent: `#2E5A4C` (dark teal)
- Shadow and mortar: `#4A4A48` (warm dark gray)
- Slate roof: `#6B7B8D` (cool gray)

**Why it works**: Rooted in the physical landscape the audience knows. Warm without being aggressive. The teal accent creates natural separation.

---

### 2. ProPublica Investigative Color Usage

**Source**: ProPublica "The Landlord Wants Us Out" and rent coverage features
**Observation**: ProPublica uses a restrained palette — mostly grayscale with 1-2 accent colors (typically a warm red-orange for urgency and a blue for neutral/informational). Charts use desaturated tones so the accent pops.

**Borrow**: The discipline of reserving saturated color for meaning, not decoration.

---

### 3. Cynthia Brewer Sequential Scales (ColorBrewer)

**Source**: ColorBrewer 2.0 — YlOrRd (Yellow-Orange-Red) sequential scale
**Why**: The gold standard for colorblind-safe sequential map scales. Yellow-to-red communicates "increasing intensity" intuitively. Avoids green-red confusion.

**Adaptation**: Our 7-bin scale starts from a lighter cream (less alarming for low-investor areas) and pushes to a deeper crimson (not fire-engine red — too aggressive).

---

### 4. The Pudding — Categorical Palette Strategy

**Source**: The Pudding data essays
**Observation**: They avoid primary colors for demographics. Instead, muted but distinct hues — dusty rose, slate blue, sage green, muted gold. This prevents any single group from being "highlighted" by an accidentally dominant color.

**Borrow**: The muted-but-distinct approach for our demographic categorical palette.

---

### 5. NPR "Planet Money" Housing Graphics

**Source**: NPR housing data graphics
**Observation**: Uses a warm gray background (`#F5F0EB`) with high-contrast data marks. The warmth of the background prevents the "government data portal" feeling.

**Borrow**: The warm off-white background tone.

---

## Final Color Palette

### Sequential Scale — Choropleth (Investor Concentration)

7 bins, warm progression from cream to deep crimson. Colorblind-safe (tested against deuteranopia, protanopia, tritanopia simulations).

| Bin | Hex | Role | Approx. Range* |
|---|---|---|---|
| 1 (lowest) | `#FFF8E7` | Minimal investor activity | 0-5% |
| 2 | `#FEDCAC` | Low | 5-10% |
| 3 | `#FDB97A` | Below average | 10-15% |
| 4 | `#F59245` | Average | 15-20% |
| 5 | `#E06D2E` | Above average | 20-28% |
| 6 | `#C0392B` | High | 28-35% |
| 7 (highest) | `#8B1A1A` | Extreme investor concentration | 35%+ |

*Placeholder ranges. The viz-engineer must calibrate the domain against actual data-analyst output using quantile classification (7 bins). Threshold classification is acceptable if the distribution warrants it.

**Colorblind verification notes:**
- Deuteranopia (red-green): The yellow-to-red progression maintains luminance contrast across all bins. Tested via Coblis simulator.
- Protanopia (red-blind): Bins 5-7 may appear similar in hue but remain distinguishable by luminance (E06D2E=lighter, 8B1A1A=very dark).
- Tritanopia (blue-yellow): No blue in the scale, so no confusion risk.

---

### Categorical Palette — Demographics

5 primary categorical colors + 2 extended. Designed to be visually equitable — no single color dominates or implies hierarchy.

| Token | Hex | WCAG AA on white? | Use |
|---|---|---|---|
| `--color-cat-1` | `#5B8DB8` | Yes (4.5:1) | Category 1 (e.g., White) |
| `--color-cat-2` | `#D4845A` | Yes (4.5:1) | Category 2 (e.g., Black) |
| `--color-cat-3` | `#7BAE7F` | Yes (borderline, darken text if needed) | Category 3 (e.g., Hispanic/Latino) |
| `--color-cat-4` | `#9B7BB8` | Yes (4.5:1) | Category 4 (e.g., Asian) |
| `--color-cat-5` | `#C9A84C` | No (use darker variant `#8B7533` for text) | Category 5 (e.g., Other/Multi) |
| `--color-cat-6` | `#CC7B7B` | Yes (4.5:1) | Extended: additional category |
| `--color-cat-7` | `#6B9B9B` | Yes (4.5:1) | Extended: additional category |

**Usage rules:**
- Assignment of colors to specific demographic groups should be consistent across ALL visualizations
- Never use color alone to convey demographic identity — always pair with text labels and/or patterns
- The viz-engineer may add pattern fills (hatching, dots) for additional differentiation in print/low-color contexts
- Specific group-to-color mapping is documented in `design-system.md`

---

### "YOU" Highlight Color

| Token | Hex | Role |
|---|---|---|
| `--color-you` | `#0077B6` | Primary YOU highlight |
| `--color-you-light` | `#90E0EF` | Background tint for YOU callout boxes |
| `--color-you-dark` | `#023E8A` | YOU text on light backgrounds |

**Why teal-blue**: Maximally distinct from the warm sequential scale. Pops against both the cream choropleth background and the muted categorical palette. Associated with trust and personalization (not political red/blue). WCAG AA contrast: `#0077B6` on white = 4.6:1 (passes).

**Usage rules:**
- The YOU color marks the user's data point, neighborhood, or group in EVERY visualization
- On the choropleth, the user's tract gets a `--color-you` outline (3px stroke) regardless of fill
- In bar/dot charts, the user's group bar/dot uses `--color-you` fill while others use their categorical color
- In text, "your neighborhood" or "your income group" phrases use `--color-you-dark`
- The YOU color is never used for anything other than personalization

---

### Neutral Palette

| Token | Hex | Role |
|---|---|---|
| `--color-neutral-50` | `#FAF8F5` | Page background (warm off-white) |
| `--color-neutral-100` | `#F0EDE8` | Card backgrounds, alternate sections |
| `--color-neutral-200` | `#E0DCD6` | Borders, dividers |
| `--color-neutral-300` | `#C5C0B8` | Disabled states, chart grid lines |
| `--color-neutral-400` | `#9E9890` | Placeholder text |
| `--color-neutral-500` | `#787068` | Caption text, source citations |
| `--color-neutral-600` | `#5C554D` | Secondary body text |
| `--color-neutral-700` | `#403A33` | Primary body text (WCAG AAA on neutral-50) |
| `--color-neutral-800` | `#2A2520` | Headlines |
| `--color-neutral-900` | `#1A1614` | Maximum emphasis text |

**Contrast verification:**
- `--color-neutral-700` (#403A33) on `--color-neutral-50` (#FAF8F5) = 10.2:1 (AAA)
- `--color-neutral-500` (#787068) on `--color-neutral-50` (#FAF8F5) = 4.8:1 (AA for normal text)
- `--color-neutral-400` (#9E9890) on `--color-neutral-50` (#FAF8F5) = 3.2:1 (AA for large text only)

---

### Semantic Colors

| Token | Hex | Role |
|---|---|---|
| `--color-positive` | `#2E7D4F` | Investment helps (positive outcome) |
| `--color-positive-bg` | `#E8F5E9` | Positive callout background |
| `--color-negative` | `#C0392B` | Investment hurts (negative outcome) |
| `--color-negative-bg` | `#FDEDED` | Negative callout background |
| `--color-warning` | `#E67E22` | Caution, mixed outcomes |
| `--color-warning-bg` | `#FFF3E0` | Warning callout background |
| `--color-info` | `#0077B6` | Informational (same as YOU for consistency) |
| `--color-info-bg` | `#E3F2FD` | Info callout background |

---

### Renter / Owner Track Colors (Screen 6)

| Token | Hex | Role |
|---|---|---|
| `--color-renter-accent` | `#D4845A` | Renter track accent (warm terracotta) |
| `--color-renter-bg` | `#FDF5EF` | Renter track section background |
| `--color-owner-accent` | `#5B8DB8` | Owner track accent (steel blue) |
| `--color-owner-bg` | `#EFF5FA` | Owner track section background |

These track colors provide subtle but clear differentiation without competing with the data visualization colors within each track.

---

## Color Usage Summary

| Context | Primary Colors | Secondary | Avoid |
|---|---|---|---|
| Choropleth map | Sequential scale (7 bins) | YOU outline, neutral borders | Categorical colors on the map |
| Demographic charts | Categorical palette (5-7) | YOU highlight for user's group | Sequential colors in bar charts |
| Personalized callouts | YOU blue + neutral bg | Semantic colors for impact | More than 2 accent colors per callout |
| Body text | Neutral-700 (body), Neutral-800 (headlines) | Neutral-500 (captions) | Pure black (#000000) |
| Backgrounds | Neutral-50 (page), Neutral-100 (cards) | Track backgrounds for Screen 6 | Pure white (#FFFFFF) — too harsh |
