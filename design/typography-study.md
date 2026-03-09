# Typography Study — Hello Homeowners

## Design Goal

Typography for "Hello Homeowners" must balance **editorial authority** with **personal warmth**. The experience oscillates between big-number impact moments (hero stats, map callouts) and intimate, explanatory passages (personalized advice, policy breakdowns). The type system must serve both modes without feeling disjointed.

---

## Reference Analysis

### 1. ProPublica — Investigative Feature Typography

**Source**: ProPublica long-form features (e.g., "The Landlord Wants Us Out")
**URL**: https://www.propublica.org

**What to study:**
- Bold condensed headline (often GT Sectra or proprietary serif) paired with clean sans-serif body (Atlas Grotesk)
- Headlines are large (48-60px desktop) but never shout — weight and spacing do the work
- Deck/subhead sits between headline and body at a distinct weight (light or regular)
- Data callouts use the body font at larger sizes, not a special display font — this keeps them grounded

**Borrow:** The serif/sans pairing strategy. The restraint in using only 2-3 weights per font.

---

### 2. The Pudding — Data Essay Typography

**Source**: The Pudding data essays (e.g., "How Music Taste Evolved")
**URL**: https://pudding.cool

**What to study:**
- Body text is typically a humanist sans-serif (often National or similar) at 18-20px
- Section headers are the same font family, just heavier weight — no separate display font
- Inline data annotations use monospaced or tabular numerals within body text
- Generous line-height (1.6-1.7) for readability during long scroll
- Caption text is small (13-14px) but never sacrifices contrast

**Borrow:** The single-family approach for body and section heads. The generous line-height. The integration of data numbers within flowing text.

---

### 3. Bloomberg CityLab — Urban Data Journalism

**Source**: Bloomberg CityLab housing features
**URL**: https://www.bloomberg.com/citylab

**What to study:**
- Headlines in a serif with personality (often a Didone or transitional serif)
- Tight letter-spacing on headlines creates density and urgency
- Chart labels use a dedicated typeface with tabular numerals — often a monospace or the body font's tabular OpenType feature
- Stark contrast between headline scale (very large) and body scale (moderate)

**Borrow:** The use of tabular numerals for chart labels. The scale contrast between hero moments and body text.

---

### 4. The Marshall Project — Justice & Housing Coverage

**Source**: The Marshall Project features
**URL**: https://www.themarshallproject.org

**What to study:**
- Serif headlines (often a slab or bracketed serif) that feel institutional but humane
- Generous whitespace around text blocks — content breathes
- Pull quotes and callout boxes use a distinct treatment (italic, larger size, or colored bar)
- Image captions and data source citations are consistently small but never illegible

**Borrow:** The callout/pull-quote treatment for personalized "your situation" moments. The respectful, unhurried spacing.

---

### 5. NYT The Upshot — Data Visualization Typography

**Source**: The New York Times Upshot data features
**URL**: https://www.nytimes.com/section/upshot

**What to study:**
- Chart typography uses NYT Franklin (a custom humanist sans) — clean, neutral, never competes with the data
- Axis labels are light gray, small (11-12px), always secondary to the data marks
- Annotation labels within charts use the same font at slightly larger size with a background highlight
- Number formatting is meticulous: comma separators, appropriate decimal places, dollar/percent signs

**Borrow:** The hierarchy of chart label importance (annotation > data label > axis label > tick mark). The gray-scale treatment for chart infrastructure.

---

### 6. Vox Media — Explanatory Journalism

**Source**: Vox explainer features
**URL**: https://www.vox.com

**What to study:**
- Sans-serif dominance for accessibility and modernity
- Bold color accents on key terms inline (not just links — semantic highlighting)
- Step-by-step numbered sequences use the headline font at body size with color accent
- Mobile typography scales gracefully — headlines shrink but body stays >=16px

**Borrow:** The inline semantic highlighting for personalized terms. The mobile-first sizing discipline.

---

## Recommended Font Stack

### Primary: Headline / Display

**Font**: DM Serif Display (Google Fonts)
- **Why**: Warm, high-contrast serif with personality. Feels editorial without being stiff. The rounded terminals add approachability. Free, well-hinted for screen.
- **Weights used**: 400 (Regular) only — the font's design carries authority at a single weight
- **Fallback**: Georgia, "Times New Roman", serif

### Secondary: Body / UI / Data Labels

**Font**: Inter (Google Fonts)
- **Why**: Humanist sans-serif designed for screens. Excellent legibility at small sizes. Tabular numeral support via OpenType features (`font-variant-numeric: tabular-nums`). Comprehensive weight range.
- **Weights used**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

### Tertiary: Data / Numbers / Code

**Font**: JetBrains Mono (Google Fonts)
- **Why**: Monospace with excellent numeral design. Distinct zero vs O. Clean at small sizes. Used only for large hero statistics and special data callouts — not for chart axis labels (Inter with tabular nums handles those).
- **Weights used**: 400 (Regular), 700 (Bold)
- **Fallback**: "SF Mono", "Fira Code", "Courier New", monospace

---

## Type Scale

Based on a 1.25 (Major Third) modular scale, anchored at 16px body.

| Token | Desktop | Mobile | Weight | Font | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|---|---|
| `--font-size-hero` | 72px | 40px | 400 | DM Serif Display | 1.1 | -0.02em | Hero stat numbers |
| `--font-size-h1` | 48px | 32px | 400 | DM Serif Display | 1.15 | -0.01em | Screen titles |
| `--font-size-h2` | 32px | 24px | 400 | DM Serif Display | 1.25 | 0 | Section subtitles |
| `--font-size-h3` | 24px | 20px | 600 | Inter | 1.3 | 0 | Card titles, chart titles |
| `--font-size-h4` | 20px | 18px | 600 | Inter | 1.35 | 0 | Subsection heads |
| `--font-size-body` | 18px | 16px | 400 | Inter | 1.6 | 0 | Body text |
| `--font-size-body-sm` | 16px | 14px | 400 | Inter | 1.5 | 0 | Secondary body, form labels |
| `--font-size-caption` | 14px | 12px | 400 | Inter | 1.4 | 0.01em | Chart captions, source citations |
| `--font-size-label` | 12px | 11px | 500 | Inter | 1.3 | 0.02em | Axis labels, data labels |
| `--font-size-overline` | 12px | 11px | 600 | Inter | 1.2 | 0.08em | Screen number indicators, category labels (uppercase) |

### Responsive Behavior

- Breakpoint: 768px (below = mobile scale, above = desktop scale)
- Body text never goes below 14px on any viewport
- Hero stat uses `clamp(40px, 8vw, 72px)` for fluid scaling
- H1 uses `clamp(32px, 5vw, 48px)`
- Line-height increases slightly on mobile for touch readability

### OpenType Features

```css
/* Enable tabular numerals for data alignment */
.chart-label, .data-value, .stat-number {
  font-variant-numeric: tabular-nums;
}

/* Enable oldstyle numerals for running body text */
.body-text {
  font-variant-numeric: oldstyle-nums;
}
```

---

## Typography Rules

1. **Never use more than 2 font families on a single screen** (DM Serif Display + Inter). JetBrains Mono is reserved for hero stats only.
2. **Headlines are always DM Serif Display**. Never bold it — the font only has one weight and its contrast already commands attention.
3. **Chart text is always Inter** with tabular numerals enabled. No serif text inside visualizations.
4. **Minimum body text size is 16px on mobile, 18px on desktop.**
5. **Uppercase text is only used for overline/category labels** (`--font-size-overline`), never for headlines or body.
6. **Color on text**: Body text uses `--color-neutral-900`. Secondary text uses `--color-neutral-600`. Caption/source text uses `--color-neutral-500`. Never use colored body text except for the "YOU" highlight.
7. **Personalized callouts** (e.g., "In your neighborhood...") use Inter SemiBold at body size with the `--color-you` highlight color.
