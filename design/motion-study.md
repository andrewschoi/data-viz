# Motion Study — Hello Homeowners

## Design Philosophy

Motion in "Hello Homeowners" serves **comprehension, not spectacle**. Every animation should either:
1. **Reveal information progressively** (scroll-triggered chart builds)
2. **Orient the user spatially** (transitions between views, map zooms)
3. **Reinforce personalization** (highlight animations when "your" data appears)

Decorative motion is acceptable only if it is subtle and enhances the editorial tone (e.g., a gentle parallax on section backgrounds). All motion must have a `prefers-reduced-motion` fallback.

---

## Reference Projects

### 1. The Pudding — "Film Dialogue" Scrollytelling

**URL**: https://pudding.cool/2017/03/film-dialogue/
**Technique**: Sticky chart with scroll-triggered data transitions. The visualization stays fixed while narrative text scrolls past. Data marks animate smoothly between states (bars grow, points reposition).

**What to borrow:**
- Sticky chart container pattern (chart stays in viewport, text scrolls alongside)
- Data transitions use eased interpolation (not instant swaps)
- New data points enter with a staggered fade-in (50ms delay per element)

**Classification**: Essential (conveys data changes tied to narrative progression)

---

### 2. NYT "How the Virus Got Out" — Map Animation

**URL**: https://www.nytimes.com/interactive/2020/03/22/world/coronavirus-spread.html
**Technique**: Animated dot map with temporal progression. Dots appear in sequence as the timeline advances, creating a spreading pattern.

**What to borrow:**
- Temporal animation for our Timeline screen (Screen 4) — line/area chart draws progressively as user scrolls
- The "spreading" metaphor works for investor activity expanding across neighborhoods over time
- Pace: approximately 2-3 years of data per scroll step

**Classification**: Essential (temporal progression is the data story)

---

### 3. Bloomberg — "What's Really Warming the World" — Stacked Reveal

**URL**: https://www.bloomberg.com/graphics/2015-whats-warming-the-world/
**Technique**: Sequential chart layering. Each scroll step adds a new data series to the same chart, building toward a cumulative picture. Previous series fade to lower opacity as the new one highlights.

**What to borrow:**
- The additive reveal pattern for Screen 5 (Who Gets Hurt) — income groups appear one at a time, then racial breakdowns layer in
- Opacity transitions for de-emphasizing context data (previous layers fade to 30% opacity)

**Classification**: Essential (progressive complexity reveal)

---

### 4. Airbnb Design — Microinteraction Principles

**Source**: Airbnb motion design guidelines
**Technique**: Functional microinteractions — hover states expand with a slight scale (1.02x), tooltips ease in from the direction of the trigger, buttons depress with a 1px translate.

**What to borrow:**
- Tooltip entrance: fade + translate 4px from trigger direction, 200ms ease-out
- Hover on chart elements: subtle brightness increase + slight scale (not color change alone)
- Form input focus: border color transition 150ms + subtle box-shadow expansion

**Classification**: Decorative (enhances feel, does not convey data)

---

### 5. Scrollama Library — Intersection Observer Patterns

**Source**: https://github.com/russellsamora/scrollama
**Technique**: Scroll position triggers callbacks at configurable thresholds. Used in most modern scrollytelling.

**What to borrow:**
- Enter threshold: 0.5 (trigger when 50% of the step is visible)
- Exit animations are faster than entrance (reduces "sluggish scroll" feel)
- Direction-aware triggers (scroll up should reverse/undo, not replay)
- Progress-based animations for continuous effects (parallax, opacity fade with scroll position)

**Classification**: Infrastructure (determines when animations fire)

---

### 6. Observable / D3 — Enter-Update-Exit Pattern

**Source**: D3.js transition documentation and Observable notebooks
**Technique**: The canonical enter-update-exit pattern for data joins. New data marks enter with animation, existing marks transition to new positions/sizes, removed marks exit with animation.

**What to borrow:**
- Enter: elements fade in (opacity 0 to 1) + grow from zero (scale or height)
- Update: elements interpolate position/size smoothly
- Exit: elements fade out + shrink, then are removed from DOM
- Stagger: sequential elements get a delay offset (index * 30ms) for "cascade" entrance

**Classification**: Essential (core data visualization technique)

---

### 7. Stripe.com — Ambient Background Motion

**Source**: Stripe homepage gradient animation
**Technique**: Slow-moving gradient background that creates a sense of life without distracting from content.

**What to borrow:**
- For the Landing screen (Screen 1): a very subtle, slow gradient shift on the hero background (6-8 second cycle)
- Must be the first thing disabled in `prefers-reduced-motion` — purely decorative

**Classification**: Decorative (ambient feel, no data function)

---

## Animation Token Definitions

These tokens become CSS custom properties and are used by the viz-engineer for all D3 transitions.

| Token | Value | Use |
|---|---|---|
| `--transition-duration-enter` | 300ms | New elements appearing |
| `--transition-duration-update` | 500ms | Elements changing position/size/color |
| `--transition-duration-exit` | 200ms | Elements leaving |
| `--transition-duration-micro` | 150ms | Hover states, focus, tooltips |
| `--transition-duration-hero` | 800ms | Hero stat counter animation |
| `--transition-easing` | cubic-bezier(0.4, 0, 0.2, 1) | Default easing (Material Design standard) |
| `--transition-easing-enter` | cubic-bezier(0.0, 0, 0.2, 1) | Deceleration (entering elements) |
| `--transition-easing-exit` | cubic-bezier(0.4, 0, 1, 1) | Acceleration (exiting elements) |
| `--transition-stagger-delay` | 30ms | Per-element stagger for sequential entrance |
| `--transition-scroll-offset` | 0.5 | Intersection Observer threshold |

---

## Animation Inventory by Screen

| Screen | Animation | Type | Essential? | Reduced-Motion Fallback |
|---|---|---|---|---|
| 1 — Landing | Subtle background gradient shift | Ambient | No | Static gradient |
| 1 — Landing | Form input focus transitions | Micro | No | Instant focus style |
| 2 — Big Picture | Number counter (animated count-up) | Data reveal | Yes | Show final number immediately |
| 2 — Big Picture | Stat emphasis pulse (scale 1.0 to 1.05 to 1.0) | Decorative | No | No pulse |
| 3 — Investor Map | Choropleth fade-in (bins appear sequentially by value) | Data reveal | Yes | Show all bins immediately |
| 3 — Investor Map | User's tract highlight stroke animation (dash offset) | Personalization | Yes | Static stroke, no animation |
| 3 — Investor Map | Zoom to user's neighborhood on scroll step | Spatial orient | Yes | Jump to view (no interpolation) |
| 4 — Timeline | Line/area progressive draw (clipPath reveal) | Data reveal | Yes | Show complete chart |
| 4 — Timeline | Year marker highlights as scroll progresses | Temporal | Yes | Show all markers |
| 5 — Who Gets Hurt | Bar groups enter with staggered grow-up | Data reveal | Yes | Show all bars immediately |
| 5 — Who Gets Hurt | User's group bar highlighted (color transition) | Personalization | Yes | Static highlight color |
| 5 — Who Gets Hurt | Dot/strip chart elements cascade in | Data reveal | Yes | Show all dots |
| 6 — Things You Should Know | Track switch (renter/owner) crossfade | Layout | Yes | Instant swap |
| 6 — Things You Should Know | Individual chart enter animations | Data reveal | Yes | Show immediately |
| 7 — The Other Side | Slope/dumbbell lines draw | Data reveal | Yes | Show complete |
| 8 — Policy & Action | Card entrance stagger | Layout | No | Show all cards |
| 8 — Policy & Action | Card sort/filter reflow | Layout | Yes | Instant reposition |
| 9 — Closing | Summary stat count-up | Data reveal | Yes | Show final numbers |

---

## Easing Guidelines

- **Entering**: Use deceleration curve (`--transition-easing-enter`). Elements should feel like they are arriving and settling.
- **Updating**: Use standard ease (`--transition-easing`). Smooth, unremarkable position changes.
- **Exiting**: Use acceleration curve (`--transition-easing-exit`). Elements should feel like they are leaving quickly and getting out of the way.
- **Hover/micro**: Use standard ease at the micro duration (150ms). Should feel instant but not jarring.

## Scroll-Triggered Animation Rules

1. **One animation per scroll step.** Never trigger multiple competing animations simultaneously.
2. **Animations must complete before the next scroll step fires.** If a user scrolls fast, animations should resolve to their end state (no half-animated states).
3. **Scroll up = reverse.** If the user scrolls back, charts should undo their last animation step, not replay forward.
4. **No animation should take longer than 800ms** (the hero duration). Long animations frustrate fast scrollers.
5. **Stagger cap**: Maximum stagger delay is 1 second total (e.g., 30 elements * 30ms = 900ms). If there are more elements, reduce the per-element delay.
