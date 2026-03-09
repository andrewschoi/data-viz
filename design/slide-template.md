# Slide Template — Hello Homeowners Pitch Deck

## Overview

This document specifies the visual design of the 5-minute pitch presentation. The narrative-architect references this when assembling `presentation/pitch-deck.md`. The design should extend the web project's visual identity into a presentation context while adapting for projected display (larger type, higher contrast, simpler layouts).

---

## Slide Dimensions

- **Aspect ratio**: 16:9 (1920 x 1080px)
- **Safe area**: 120px margin on all sides (content zone: 1680 x 840px)
- **Grid**: 12-column grid within the safe area, 24px gutters

---

## Master Layouts

### Layout 1: Title Slide

```
+--------------------------------------------------+
|                                                  |
|                                                  |
|         [OVERLINE: small category text]          |
|                                                  |
|         HEADLINE                                 |
|         Large, centered, DM Serif Display        |
|                                                  |
|         [Subtitle / byline]                      |
|         Inter, lighter weight                    |
|                                                  |
|                                                  |
|                  [decorative divider]             |
+--------------------------------------------------+
```

- Background: `--color-neutral-50` (`#FAF8F5`)
- Headline: `--color-neutral-800`, DM Serif Display, 72px
- Subtitle: `--color-neutral-600`, Inter 400, 28px
- Overline: `--color-you`, Inter 600, 18px, uppercase, letter-spacing 0.08em
- Use for: Opening slide, section dividers, closing slide

### Layout 2: Content + Visual (Split)

```
+--------------------------------------------------+
|  [OVERLINE]                                      |
|                                                  |
|  HEADLINE          |                             |
|  (left 5 cols)     |     [VISUAL]                |
|                    |     (right 7 cols)           |
|  Body text         |     Screenshot, chart,      |
|  - Bullet point    |     or wireframe image      |
|  - Bullet point    |                             |
|  - Bullet point    |                             |
|                    |                             |
|         [source citation, bottom-right]          |
+--------------------------------------------------+
```

- Background: `--color-neutral-50`
- Headline: `--color-neutral-800`, DM Serif Display, 48px
- Body: `--color-neutral-700`, Inter 400, 24px, line-height 1.5
- Bullets: `--color-you` bullet markers, max 4 bullets per slide
- Visual: Full-bleed within its column, 8px border-radius, subtle shadow
- Source: `--color-neutral-400`, Inter 400, 14px, bottom-right corner
- Use for: Most content slides (data findings, wireframe walkthrough, design study)

### Layout 3: Full Visual

```
+--------------------------------------------------+
|                                                  |
|         [FULL-BLEED IMAGE OR CHART]              |
|         (spans entire content zone)              |
|                                                  |
|                                                  |
|                                                  |
|                                                  |
|  [Caption / annotation bar at bottom]            |
|  Semi-transparent dark overlay for legibility    |
+--------------------------------------------------+
```

- Background: Image fills the entire slide
- Caption bar: Bottom 120px, `rgba(26, 22, 20, 0.85)` overlay
- Caption text: White, Inter 400, 22px
- Use for: Hero stat moment, map screenshots, design inspiration collages

### Layout 4: Text-Heavy (Rare)

```
+--------------------------------------------------+
|  [OVERLINE]                                      |
|                                                  |
|  HEADLINE                                        |
|  (full width)                                    |
|                                                  |
|  Body text paragraph, max 6 lines.               |
|  Keep it concise — if you need more text,        |
|  split into two slides.                          |
|                                                  |
|  [Callout box with key insight]                  |
|                                                  |
+--------------------------------------------------+
```

- Background: `--color-neutral-50`
- Headline: 48px DM Serif Display
- Body: 24px Inter, max 6 lines
- Callout: `--color-you-light` background, 4px left border `--color-you`, 22px Inter 500
- Use for: Motivation/problem statement, methodology explanation

---

## Slide Typography

Presentation type sizes are larger than web to ensure legibility when projected.

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Slide headline | DM Serif Display | 48-72px | 400 | `--color-neutral-800` |
| Slide subtitle | Inter | 28px | 400 | `--color-neutral-600` |
| Body text | Inter | 24px | 400 | `--color-neutral-700` |
| Bullet text | Inter | 22px | 400 | `--color-neutral-700` |
| Caption / source | Inter | 14-16px | 400 | `--color-neutral-400` |
| Overline / category | Inter | 18px | 600 | `--color-you` |
| Data callout number | JetBrains Mono | 64px | 700 | `--color-neutral-800` |
| Callout box text | Inter | 22px | 500 | `--color-neutral-700` |

**Rules:**
- Never go below 16px for any text on slides (illegible when projected)
- Maximum 40 words per slide (excluding headlines and captions)
- Headlines: 1 line preferred, 2 lines maximum

---

## Slide Color Usage

| Element | Color |
|---|---|
| Slide background | `--color-neutral-50` (`#FAF8F5`) — warm, not stark white |
| Primary text | `--color-neutral-800` |
| Secondary text | `--color-neutral-600` |
| Accent / emphasis | `--color-you` (`#0077B6`) — sparingly, for key terms and bullets |
| Chart colors in screenshots | Same as web (sequential, categorical, YOU palettes) |
| Positive highlight | `--color-positive` for "good outcome" data |
| Negative highlight | `--color-negative` for "bad outcome" data |

**Do not** use a dark/black slide background. The warm off-white maintains visual consistency with the web project and is legible in most presentation settings.

**Exception**: Full-visual slides (Layout 3) may have dark areas from the image itself.

---

## Visual/Text Balance Guidelines

The rubric rewards "well-constructed slides with a balance of visual and textual information."

### Guidelines

| Rule | Specification |
|---|---|
| Max text per slide | 40 words (body text, excluding headline) |
| Max bullets per slide | 4 |
| Image-to-text ratio | At least 40% of the content zone should be visual on content slides |
| Chart slides | Chart occupies >= 60% of content zone; text is a brief annotation |
| Transition slides | Title + 1 sentence maximum |
| Data stat slides | One number, large. One sentence of context. That's it. |

### Slide Count Target

For a 5-minute presentation at ~30-40 seconds per slide:
- **8-10 slides** total
- Suggested breakdown:
  1. Title slide (project name, team)
  2. Motivation / problem statement
  3. Target audience definition
  4. Key data finding #1 (with chart screenshot)
  5. Key data finding #2 (with chart screenshot)
  6. Wireframe walkthrough (2-3 screen screenshots)
  7. Design study highlights (typography, color, inspiration)
  8. Personalization demo concept
  9. Technical approach (brief)
  10. Closing / next steps

---

## Chart Screenshots in Slides

When including chart screenshots from the web project or wireframes:

- Export at 2x resolution for crisp display on high-DPI projectors
- Add a subtle border (`1px solid --color-neutral-200`) if the chart background blends with the slide background
- Include chart title and source citation in the slide, even if they're already on the chart
- Annotate key data points with callout arrows if the chart is complex
- Use Layout 2 (split) for charts with explanatory text, Layout 3 (full visual) for self-explanatory charts

---

## Wireframe Screenshots in Slides

When showing wireframe exports from Figma:

- Show the wireframe in a device frame (browser chrome or phone outline) to communicate "this is a web experience"
- Use annotations/arrows to highlight key interaction points
- If showing the full journey (all 9 screens), use a horizontal flow diagram (the journey map from Figma page "00 — Journey Map")
- Never show more than 2-3 screens per slide — let each breathe

---

## Slide Transition

- Use simple **cut** or **fade** transitions between slides (200ms)
- No slide animations (fly-in, zoom, rotate) — they undermine the professional tone
- If the presentation tool supports it, use a subtle **crossfade** (300ms) for transitions between related content
