# Story Arc: Hello Homeowners

> Full 9-screen narrative structure for the "Hello Homeowners" personalized scrollytelling experience.

---

## Narrative Genre

**Martini glass**: The experience begins author-driven (Screens 1-5 guide the user through a structured story) then transitions to reader-driven exploration (Screens 6-8 allow the user to explore personalized advice, comparisons, and policy at their own pace). Screen 9 returns to author-driven for a crisp closing.

```
Author-driven (guided)     Reader-driven (explore)     Author-driven (close)
┌─────────────────────┐    ┌──────────────────────┐    ┌──────────────┐
│ 1. Landing          │    │ 6. Things You Should │    │ 9. Closing   │
│ 2. Big Picture      │    │    Know (tabbed)      │    │              │
│ 3. Investor Map     │ →  │ 7. The Other Side    │ →  │              │
│ 4. Timeline         │    │ 8. Policy & Action   │    │              │
│ 5. Who Gets Hurt    │    │    (sortable cards)   │    │              │
└─────────────────────┘    └──────────────────────┘    └──────────────┘
```

---

## Audience Definition

### Primary Audience
Boston-area residents — renters and homeowners — across income levels and racial backgrounds who are affected by investor activity in the housing market. They may sense that something is wrong (rising rents, cash-offer bidding wars, unfamiliar LLC landlords) but lack the data to understand the systemic picture.

**What they know**: Their own housing situation. Anecdotal awareness that housing is expensive.
**What they need to learn**: The scale and patterns of investor activity, how it specifically affects people like them, and what they can do about it.

### Secondary Audiences
- **Policymakers and staff**: Need data to support or evaluate housing legislation.
- **Journalists**: Looking for data-driven angles on housing stories.
- **Advocacy groups**: Need accessible tools to educate and mobilize communities.
- **Students and researchers**: Interested in housing economics and data visualization methodology.

### Potential Skepticism to Address
- "Investors create housing supply and improve properties" → addressed in Screen 7 (The Other Side)
- "Rent control doesn't work" → addressed honestly in Screen 8 with evidence from both sides
- "This is just anti-capitalism" → addressed through balanced framing and data-first approach
- "My neighborhood is fine" → addressed through personalization (show them their actual data)

---

## Beat-by-Beat Breakdown

### Screen 1: Landing

**Narrative beat**: Welcome and personalization intake. Set the tone: warm, direct, personal. This is not an academic report — it is a conversation.

**Headline**: "Hello, Homeowner." (or "Hello, Renter.")
**Subhead**: "Let's look at what's happening in your housing market."

**Content**:
- Brief 2-sentence hook: "Over the past two decades, investors have bought 1 in 5 homes sold in Greater Boston. How does that affect you? It depends on who you are and where you live."
- Personalization form:
  - Income bracket (dropdown: Under $35K / $35K-$75K / $75K-$125K / $125K-$200K / Over $200K)
  - Race/ethnicity (dropdown: Asian / Black / Hispanic/Latino / White / Other/Multiracial)
  - Housing status (toggle: Renter / Owner or Buyer)
  - Neighborhood or ZIP code (searchable dropdown populated from personalization-schema.json)
- CTA button: "Show me my data"

**Interaction**: Form inputs. All fields required. Selections persist via URL query parameters for sharing.

**Transition to Screen 2**: After form submission, smooth scroll with the user's selections animating into a personalized header bar that persists through the experience. The bar shows: "[Income] | [Race] | [Status] | [Neighborhood]"

**Static vs. interactive**: Interactive (form input)
**Scroll trigger**: None (user-initiated via button click)
**Annotations**: Helper text under each form field explaining why this information matters (e.g., "We ask about race because investor activity impacts racial groups differently — we'll show you how.")

---

### Screen 2: Big Picture

**Narrative beat**: The hook. A single striking statistic that grounds the scale of the problem. Emotional response: "I had no idea."

**Headline**: "Here's what's happening around you."
**Primary stat**: Animated counter showing "1 in 5 homes sold in Greater Boston went to an investor" (or the user's neighborhood-specific rate if higher).
**Supporting context**: "That's [X,XXX] properties between 2004 and 2018 — bought not by families looking for a home, but by investors looking for a return."

**Personalization**: If the user's neighborhood has a higher-than-average investor purchase rate, display: "In [Neighborhood], it's even higher: [X] in [Y] homes."

**Visualization**: `hero-stat.js` — Large animated number counter with the "1 in 5" stat. Numbers tick up from 0. Secondary smaller counters for supporting stats.

**Transition to Screen 3**: The "1 in 5" number dissolves into a map pin, which drops onto the choropleth map below. The camera zooms from a single point to the full metro area.

**Static vs. interactive**: Static (author-driven reveal on scroll)
**Scroll trigger**: Number animation begins when section enters viewport
**Annotations**: Small footnote: "Source: MAPC Homes for Profit, 2004-2018 transaction data"

---

### Screen 3: Investor Map

**Narrative beat**: Geographic context. Where do investors buy? Where do they avoid? The user sees their neighborhood in the broader landscape. Emotional response: "This is happening right where I live."

**Headline**: "Where investors are buying — and where they're not."
**Body**: "Investor activity isn't spread evenly. It concentrates in neighborhoods with lower home prices, more renters, and larger BIPOC populations."

**Personalization**:
- User's neighborhood/area highlighted with a distinct outline and pulsing indicator
- Tooltip on user's area: "In [Neighborhood]: [X]% of sales to investors. [Y]% corporate, [Z]% small LLC, [W]% individual flippers."
- Investor type breakdown donut (small, inline) for user's area

**Visualization**: `choropleth.js` — Sequential color scale (light = low investor activity, dark = high). Census tract or municipal boundaries. User's area highlighted with contrasting outline.

**Interaction**:
- Hover/tap any area for tooltip with investor purchase rate and type breakdown
- Toggle between "All investors," "Corporate/PE," "Small LLC," "Individual flippers"
- User's area always remains highlighted

**Transition to Screen 4**: The map compresses horizontally while a timeline axis extends from left to right below it, creating a visual bridge from space to time.

**Static vs. interactive**: Interactive (hover/tap tooltips, investor type toggle)
**Scroll trigger**: Map renders and user's area highlights on scroll-in. Investor type toggle is user-initiated.
**Annotations**: Legend explaining color scale. Callout boxes for notable neighborhoods (e.g., "Roxbury: 35% to investors" or whatever the data shows).

---

### Screen 4: Timeline

**Narrative beat**: Temporal context. This didn't happen overnight — it accelerated after 2008 and again post-COVID. Emotional response: "It's getting worse."

**Headline**: "It wasn't always this way."
**Body**: "Investor purchases have been rising for two decades — with sharp jumps after the 2008 financial crisis and the post-COVID boom."

**Personalization**:
- If user is an owner: "When you might have been buying your home in [estimated year based on income/age], investors owned [X]% of properties in [Neighborhood]. Now it's [Y]%."
- If user is a renter: "In [Neighborhood], investor ownership has grown from [X]% to [Y]% since [year]. That likely affects who your landlord is and how much you pay."

**Visualization**: `timeline.js` — Multi-line or area chart showing investor purchase share over time. Key inflection points annotated:
- 2008: Financial crisis / foreclosure wave
- 2012-2014: Post-crisis institutional buying surge
- 2020-2021: COVID-era cash purchases spike
- User's neighborhood line highlighted in accent color; metro average in neutral

**Interaction**:
- Scroll-triggered reveal: lines draw left-to-right as user scrolls
- Hover for year-by-year values
- Annotations for inflection points appear as user scrolls past them

**Transition to Screen 5**: Timeline compresses into the x-axis of a bar chart. The "who" dimension (demographics) replaces the "when" dimension.

**Static vs. interactive**: Mixed. Scroll-driven line reveal (author-driven), then hover exploration (reader-driven).
**Scroll trigger**: Line drawing animation, annotation reveals at inflection points
**Annotations**: Inflection point callouts with 1-sentence historical context

---

### Screen 5: Who Gets Hurt

**Narrative beat**: The human cost. Not everyone is affected equally — investor activity hits hardest along lines of income and race. Emotional response: "People like me are affected more/less than I thought."

**Headline**: "Who gets hurt the most?"
**Body**: "Investor activity doesn't affect everyone equally. Lower-income households and communities of color bear a disproportionate burden — from higher eviction rates to more aggressive rent increases."

**Personalization**:
- User's demographic group (income x race intersection) highlighted in the bar chart
- Specific callout: "For [Race] households earning [Income bracket]: [specific stat about eviction rate, price impact, or displacement rate]"
- Comparison to overall average: "That's [X]% higher/lower than the metro average."

**Visualization**:
- `demographic-bars.js` — Grouped bar chart showing investor impact metric (e.g., eviction filing rate, price premium, or displacement rate) by income bracket, with bars colored/grouped by race. User's group highlighted with border and label.
- `eviction-dots.js` — Dot/strip chart overlay showing individual eviction rate data points, giving a sense of distribution rather than just averages. User's demographic dot highlighted.

**Interaction**:
- Hover bars/dots for specific values
- Toggle between metrics (eviction rate, price impact, displacement)
- User's group always highlighted

**Transition to Screen 6**: The bar chart for the user's group expands to fill the screen, transitioning into a detailed advice section. Visual cue: "Now let's talk about what this means for YOU specifically." The grouped bars dissolve and the screen splits into the renter/owner track based on user input.

**Static vs. interactive**: Mixed. Bars animate on scroll (author-driven), then hover/toggle (reader-driven).
**Scroll trigger**: Bars grow from zero, user's group bar animates last with emphasis
**Annotations**: Callout for the most affected group. Source citation for eviction data.

---

### Screen 6: Things You Should Know

**Narrative beat**: The pivot from "here's the problem" to "here's what it means for YOU." This is the heart of the personalization — actionable, specific advice. Emotional response: "This is actually useful to me."

**Headline**: "Things you should know."
**Subhead (renter)**: "As a renter in [Neighborhood] earning [Income bracket], here's what the data says about your housing situation."
**Subhead (owner)**: "As a homeowner/buyer in [Neighborhood] earning [Income bracket], here's what the data says about your market."

#### Renter Track

**Section 6A: Who's your landlord?**
- Visualization: `landlord-type-donut.js` — Donut chart showing breakdown of landlord types in user's neighborhood (corporate, small LLC, individual owner-occupant, nonprofit/public).
- Copy: "In [Neighborhood], [X]% of rental properties are owned by corporate landlords, [Y]% by small LLCs, and [Z]% by individual owners. Why does this matter? Because the type of landlord you have affects your risk of eviction, rent increases, and maintenance quality."

**Section 6B: Eviction risk by landlord type**
- Visualization: `eviction-by-owner.js` — Horizontal bar chart showing eviction filing rates by landlord type in user's area.
- Copy: "Corporate landlords in Boston file evictions 186% more often than small landlords. In [Neighborhood], the eviction filing rate for corporate-owned properties is [X] per 100 units, compared to [Y] for owner-occupied buildings."

**Section 6C: Your rights**
- No visualization (text-based content)
- Copy: "As a renter in [Municipality], you have these key protections: [list based on municipality]. And here's what's being proposed that could help you: [reference to Screen 8 policies]."

**Section 6D: Best value neighborhoods**
- Visualization: `neighborhood-value.js` — Strip/dot plot showing rent affordability across neighborhoods for the user's income bracket. User's current neighborhood highlighted.
- Copy: "For your income bracket, these neighborhoods offer the best balance of affordability and access: [ranked list]. Your current neighborhood, [Name], ranks [X] out of [Y]."

#### Owner/Buyer Track

**Section 6E: Can you afford it?**
- Visualization: `price-income-gauge.js` — Radial gauge or bullet chart showing price-to-income ratio in user's neighborhood vs. the affordable benchmark (3x income).
- Copy: "In [Neighborhood], the median home costs [X] times your annual income. The generally accepted 'affordable' benchmark is 3x. For [Race] households in your income bracket, homeownership in this area is [accessible/challenging/very difficult]."

**Section 6F: Cash buyer competition**
- Visualization: `cash-buyer-competition.js` — Stacked bar or area chart showing cash vs. financed purchases over time in user's area.
- Copy: "Cash buyers — often investors — won [X]% of bids in [Neighborhood] last year. That's [up/down] from [Y]% five years ago. If you're financing with a mortgage, here's what you're up against."

**Section 6G: Rent vs. buy breakeven**
- Visualization: `rent-buy-breakeven.js` — Interactive line chart with slider. Shows cumulative cost of renting vs. buying over time in user's neighborhood, with a breakeven point.
- Copy: "At current prices and rents in [Neighborhood], it takes approximately [X] years for buying to become cheaper than renting. If you plan to stay longer than [X] years, buying is likely the better financial move — if you can get past the cash-buyer competition."

**Section 6H: Where to look**
- Visualization: `investor-competition.js` — Ranked bar chart of neighborhoods with lowest investor competition in user's price range.
- Copy: "If you're priced out of [Neighborhood] or tired of competing with cash offers, these areas have the lowest investor activity in your price range: [ranked list]."

**Interaction**: Tab/toggle between renter and owner tracks. Each sub-section scrolls independently. All charts personalized.

**Transition to Screen 7**: A visual "breath" — the dense advice content gives way to a more open layout. The transition copy: "We've shown you how investors affect YOUR situation. But it's worth asking: is all investment bad?" The tone shifts from urgent to reflective.

**Static vs. interactive**: Fully interactive (reader-driven exploration)
**Scroll trigger**: Section headers animate in; charts render when scrolled into view
**Annotations**: Tooltips on all chart elements. Source citations for each data claim.

---

### Screen 7: The Other Side

**Narrative beat**: Nuance and credibility. Acknowledge that investment isn't purely harmful. Some investors improve housing stock, add density, or develop affordable units. Emotional response: "This is fair — they're not just demonizing investors."

**Headline**: "The other side of the story."
**Body**: "Not all investment is harmful. In some cases, investors improve deteriorating properties, add housing units, or develop affordable housing. Here's where the data shows investment helping rather than hurting."

**Content areas**:
- Property quality improvements in investor-renovated buildings
- Cases where investor development added housing supply
- Neighborhoods where investor activity correlated with improved outcomes (if data supports it)
- Honest framing: "The question isn't whether investment is good or bad — it's who benefits and who pays the cost."

**Personalization**: "In [Neighborhood], investor-renovated properties have [higher/lower/similar] assessed values and [more/fewer] code violations compared to non-investor properties."

**Visualization**: `comparison.js` — Slope/dumbbell chart showing before/after metrics (property values, code violations, unit counts) in investor-heavy vs. owner-occupied neighborhoods. User's neighborhood highlighted.

**Interaction**: Hover for specific before/after values. Toggle between metrics.

**Transition to Screen 8**: The balanced framing shifts to action: "Now that you've seen both sides — here's what's being done about it, and how it would affect you."

**Static vs. interactive**: Mixed. Author-driven framing text, reader-driven chart exploration.
**Scroll trigger**: Dumbbell chart animates (dots slide from "before" to "after" positions)
**Annotations**: Source citations. Callout for strongest positive example.

---

### Screen 8: Policy & Action

**Narrative beat**: Empowerment. What's being done? What's being proposed? How would each policy affect someone like you? End with a clear call to action. Emotional response: "I can do something about this."

**Headline**: "What's being done — and what it means for you."
**Body**: "Massachusetts is debating some of the most significant housing reforms in decades. Here's how each proposal would affect someone in your situation."

**Personalization**: Policies are sorted by relevance to the user's demographic profile (using the policy-to-personalization mapping from policy-research.md). Each policy card shows a personalized impact estimate.

**Visualization**: `policy-cards.js` — Data-driven card layout. Each card contains:
- Policy name and status (proposed / enacted / on ballot)
- 2-sentence plain-English explanation
- Personalized impact: "For [Race] [renters/owners] earning [Income bracket] in [Neighborhood], this policy would: [specific impact]"
- Relevance score (visual indicator: high / moderate / low relevance to this user)
- Sort/filter by: relevance to user, status, category

**Policy cards** (from policy-research.md):
1. Rent Stabilization (5% cap) — proposed
2. 2026 Rent Control Ballot Initiative — on ballot
3. Real Estate Transfer Fee — proposed (19 communities petitioning)
4. Condo Conversion Protections — enacted 2024
5. Affordable Homes Act provisions — enacted 2024
6. Just Cause Eviction — proposed
7. Corporate Ownership Transparency — under discussion

**Call to action section**:
- "Here's how to make your voice heard:"
- Link to contact your state representative (with pre-filled message template)
- Links to advocacy organizations (City Life / Vida Urbana, Homes for All MA, etc.)
- If 2026 ballot: "This November, you'll vote on rent control. Here's where to learn more."

**Caveats** (always visible, not hidden):
- "We can't predict exactly what would happen if these policies pass. Here's what the evidence from other places suggests."
- "This is a data-informed overview, not legal advice."

**Interaction**: Sort/filter policy cards. Expand cards for more detail. Click links to advocacy orgs.

**Transition to Screen 9**: Cards compress into a summary. The personalized header bar from Screen 1 reappears or pulses. "Let's bring it all together."

**Static vs. interactive**: Fully interactive (reader-driven card exploration)
**Scroll trigger**: Cards animate in sequentially
**Annotations**: Source citations on each card. Caveats in a visible callout box.

---

### Screen 9: Closing

**Narrative beat**: Synthesis and send-off. The user's personalized journey distilled into 3 key takeaways. End with agency and hope, not despair. Emotional response: "I learned something important about my situation, and I know what to do next."

**Headline**: "Your housing story, in three numbers."

**Personalization**: Three dynamically selected insights based on the user's inputs — the most striking/relevant stats from their journey:
- Example (renter, low-income, Black, Dorchester): "1. 38% of homes in Dorchester were bought by investors. 2. Corporate landlords file evictions 186% more often than small landlords. 3. Rent stabilization would cap your annual increase at 5%."
- Example (owner, moderate-income, White, Cambridge): "1. Cash buyers won 45% of bids in Cambridge last year. 2. At current prices, it takes 8 years for buying to beat renting. 3. The transfer fee would fund affordable housing in your community."

**Body**: "Housing is personal. The same trend — investor activity in Greater Boston — means very different things depending on who you are and where you live. We built this tool so you could see YOUR story in the data."

**Actions**:
- "Share your results" (generates shareable URL with query parameters)
- "Explore more" (links back to interactive sections)
- "Take action" (links to advocacy organizations from Screen 8)
- "Download the data" (link to data sources)

**Visualization**: No chart. Clean typographic layout with the three key numbers displayed prominently. Optional: subtle animation of the numbers counting up.

**Static vs. interactive**: Mostly static (author-driven summary). Share/action buttons are interactive.
**Scroll trigger**: Numbers animate on scroll-in
**Annotations**: "Built with data from MAPC, the Warren Group, Boston Housing Court, and U.S. Census."

---

## Transition Specifications Summary

| From → To | Transition Type | Visual Description |
|---|---|---|
| Landing → Big Picture | User-initiated (button click) | Personalization bar animates into persistent header; smooth scroll down |
| Big Picture → Investor Map | Scroll-triggered | "1 in 5" number dissolves into map pin dropping onto choropleth |
| Investor Map → Timeline | Scroll-triggered | Map compresses horizontally; timeline axis extends from left |
| Timeline → Who Gets Hurt | Scroll-triggered | Timeline compresses to x-axis; demographic bars grow from baseline |
| Who Gets Hurt → Things You Should Know | Scroll-triggered | User's demographic bar expands; screen splits into renter/owner track |
| Things You Should Know → The Other Side | Scroll-triggered | Dense content gives way to open layout; reflective tone shift |
| The Other Side → Policy & Action | Scroll-triggered | Balanced framing transitions to action framing |
| Policy & Action → Closing | Scroll-triggered | Cards compress; personalization bar pulses; three numbers appear |

---

## Annotation, Tooltip, and Highlight Strategy

| Element | Placement | Purpose |
|---|---|---|
| **Source annotations** | Small footnote text below each chart | Cite data source for every claim |
| **Tooltips** | On hover/tap for all chart elements | Show exact values, comparisons |
| **User highlight** | Pulsing outline/border + label | Always show user's group/area distinctly |
| **Inflection annotations** | Timeline screen, at key dates | Provide historical context for trend changes |
| **Helper text** | Below form fields on Landing | Explain why each demographic input matters |
| **Caveats** | Visible callout box on Policy screen | Maintain credibility through honesty |
| **Personalized callouts** | Inline with body text, emphasized styling | "For people like you..." statements |

---

## Changelog

### 2026-03-08 — Reconciliation with `analysis/narrative-flags.md`

**Flag 1 (Corporate Ownership vs. Investor Purchasing):** Accepted. Screen 3 (Investor Map) now distinguishes between *where investors already own* (affluent areas like South Boston Waterfront, Fenway) and *where investors are actively buying* (lower-income, majority-minority tracts). Screen 5 (Who Gets Hurt) focuses on purchasing activity metrics rather than ownership rates to better capture the ongoing displacement dynamic.

**Flag 2 (Eviction Data Recency Gap):** Accepted. All eviction-related copy in Screens 5 and 6 now specifies the reliable data window (2020–2022). Any temporal trend claims include a caveat about data collection lag in 2023–2024. The COVID moratorium backlog effect is noted for 2020–2021 figures.

**Flag 3 (Cash Sale Indicator):** Accepted. Screen 6 owner track copy uses "sales involving no mortgage financing" rather than "cash purchases." All cash buyer statistics are presented with the proxy methodology caveat.

**Flag 4 (Weak Corp Ownership–Eviction Correlation):** Accepted. Screen 5 eviction overlay uses "associated with" language, not causal claims. The quintile comparison (26% higher eviction rate in highest-corporate-ownership tracts) is the primary defensible statistic. Direct causation language removed.

**Flag 5 (Ambiguous Investor Categories):** Accepted. Screen 6 landlord type breakdown uses data-analyst's categorization with clear definitions in tooltips. The "Non-Small LLC Investor" category is explained as "larger corporate entities beyond individual landlords or small LLCs."
