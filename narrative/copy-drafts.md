# Copy Drafts: Hello Homeowners

> All text content for the "Hello Homeowners" scrollytelling experience. Includes headlines, body text, annotations, tooltips, and personalized variants. Each claim is annotated with its data source.

---

## Screen 1: Landing

### Headline
> Hello, Homeowner.

*Variant (renter)*:
> Hello, Renter.

*Note: Headline updates dynamically after the user selects their housing status in the form.*

### Subhead
> Let's look at what's happening in your housing market.

### Hook Text
> Over the past two decades, investors have bought 1 in 5 homes sold in Greater Boston. How does that affect you? It depends on who you are and where you live. Tell us a little about yourself, and we'll show you your data.

*Source: MAPC Homes for Profit (2023) — 21% of transactions 2004-2018 were by investors.*

### Form Field Labels and Helper Text

**Income bracket**
- Label: "What's your household income?"
- Helper: "We use income brackets to show how housing affordability and investor competition affect different economic groups."
- Options: Under $35K / $35K-$75K / $75K-$125K / $125K-$200K / Over $200K

**Race/Ethnicity**
- Label: "How do you identify?"
- Helper: "We ask about race because investor activity impacts racial groups differently — from eviction rates to homeownership access. We'll show you the data."
- Options: Asian / Black / Hispanic/Latino / White / Other/Multiracial

**Housing status**
- Label: "Do you rent or own?"
- Helper: "Your housing status determines which advice track we show you — renters and owners face very different challenges from investor activity."
- Options: Renter / Owner or Buyer

**Neighborhood**
- Label: "Where do you live?"
- Helper: "Your neighborhood determines which local data we highlight. All data stays in your browser — we don't store anything."
- Options: Searchable dropdown from personalization-schema.json

### CTA Button
> Show me my data

### Persistent Header Bar (appears after submission)
> [Income bracket] | [Race] | [Renter/Owner] | [Neighborhood]

---

## Screen 2: Big Picture

### Headline
> Here's what's happening around you.

### Primary Stat Display

**Default (metro-wide)**:
> **1 in 5** homes sold in Greater Boston went to an investor.

**Personalized variant (if user's neighborhood rate is higher than metro average)**:
> In **[Neighborhood]**, it's **1 in [X]** — [higher/much higher] than the metro average.

*Source: MAPC Homes for Profit (2023) — Analysis #1, investor purchase rate by geography.*

### Supporting Text
> That's over [X,000] properties between 2004 and 2018 — bought not by families looking for a home, but by investors looking for a return. And the pace is accelerating.

### Supporting Stats (smaller counters)
> **[X]%** of two-family homes went to investors.
> **[Y]%** of three-family homes went to investors.

*Source: MAPC — investors dominated 30% of 2-family and 50% of 3-family sales by 2018.*

### Annotation
> Source: MAPC "Homes for Profit," transaction data 2004-2018.

---

## Screen 3: Investor Map

### Headline
> Where investors are buying — and where they're not.

### Body
> Investor activity isn't spread evenly across Greater Boston. It concentrates in neighborhoods with lower home prices, more renters, and larger communities of color. The darker the area on the map, the higher the share of homes purchased by investors.

*Source: MAPC Homes for Profit (2023) — Analysis #2, geographic distribution of investor purchases.*

### Personalized Callout
> **Your neighborhood: [Neighborhood]**
> [X]% of sales to investors | [Y]% corporate | [Z]% small LLC | [W]% individual flippers

*Source: Analysis #2, investor type breakdown by geography.*

### Toggle Labels
- All investors
- Corporate & PE
- Small LLC
- Individual flippers

### Tooltip Template (on hover/tap)
> **[Area Name]**
> Investor purchase rate: [X]%
> Corporate/PE: [Y]% | Small LLC: [Z]% | Individual: [W]%
> Avg. sale price: $[XXX,XXX]

### Map Legend
> Investor purchase share (% of all residential sales, 2004-2018)
> [Light] 5% → [Dark] 40%+

### Notable Neighborhood Callouts
> **Roxbury**: Among the highest investor activity in the metro — [X]% of sales to investors.
> **Back Bay/Beacon Hill**: Among the lowest — investors can't profit at these price points.

*Source: MAPC — investment activity highest in neighborhoods with low prices and high BIPOC populations.*

---

## Screen 4: Timeline

### Headline
> It wasn't always this way.

### Body
> Investor purchases in Greater Boston have risen steadily since 2004 — with sharp jumps after the 2008 financial crisis and the post-COVID real estate boom. In your neighborhood, the trend looks like this:

*Source: Analysis #5, investor activity over time.*

### Personalized Variants

**Renter variant**:
> In **[Neighborhood]**, investor ownership grew from **[X]%** in 2004 to **[Y]%** by 2018. That likely affects who your landlord is, how much you pay, and how secure your housing is.

**Owner variant**:
> When families in your income bracket were buying homes in **[Neighborhood]**, investors owned **[X]%** of properties. Now they own **[Y]%** — and they're increasingly paying cash.

*Source: Analysis #5, neighborhood-level time series.*

### Inflection Point Annotations

**2008 — Financial Crisis**:
> The foreclosure wave created a buying opportunity. Institutional investors purchased distressed properties at steep discounts, converting owner-occupied homes into rentals.

**2012-2014 — Post-Crisis Surge**:
> Wall Street-backed firms began systematically buying single-family homes as an asset class. In Greater Boston, investor purchases jumped from [X]% to [Y]%.

**2020-2021 — COVID-Era Boom**:
> Remote work drove suburban demand. Cash-rich investors capitalized on low interest rates and competed aggressively with first-time buyers.

*Source: National trends from JCHS Harvard and Cotality; local data from MAPC.*

### Tooltip Template (on hover)
> **[Year]**: [X]% of sales to investors in [Neighborhood] (metro avg: [Y]%)

---

## Screen 5: Who Gets Hurt

### Headline
> Who gets hurt the most?

### Body
> Investor activity doesn't affect everyone equally. The data shows clear patterns along lines of income and race. Lower-income households and communities of color bear a disproportionate burden — from higher eviction rates to steeper price competition.

*Source: Analysis #3, demographic impact assessment; Analysis #4, neighborhood outcomes comparison.*

### Personalized Callout

**Template**:
> For **[Race]** households earning **[Income bracket]**:
> - Eviction filing rate: **[X]** per 100 units (**[Y]% [higher/lower]** than metro average)
> - Investor purchase share in your neighborhoods: **[Z]%**
> - Price premium from investor competition: **[W]%**

*Source: Analysis #3, Analysis #4.*

### Personalized Variants by Race

**Black households**:
> Black households face the highest eviction filing rates and live in the neighborhoods most targeted by investors. In predominantly Black neighborhoods, investors purchased [X]% of homes — nearly [Y] times the rate in predominantly white neighborhoods.

**Hispanic/Latino households**:
> Hispanic and Latino households face high investor activity and rent burden, concentrated in neighborhoods like East Boston, Chelsea, and parts of Dorchester and Jamaica Plain.

**Asian households**:
> Asian households in Greater Boston face unique pressures in neighborhoods like Chinatown and Quincy, where investor-driven development has reshaped housing options.

**White households**:
> White households are less likely to live in the neighborhoods most targeted by investors, but lower-income white renters still face significant pressure from rising rents and eviction risk.

*Source: Analysis #3, demographic crosscuts; JCHS Harvard racial disparity data.*

### Personalized Variants by Income

**Under $35K**:
> At this income level, you face the sharpest end of investor impact. You're most likely to rent from a corporate landlord, most vulnerable to eviction, and have the fewest alternatives if displaced.

**$35K-$75K**:
> You're in the squeeze zone — too much income for most housing assistance, not enough to compete with cash-paying investors. In [Neighborhood], the median home costs [X] times your annual income.

**$75K-$125K**:
> You may be able to buy — but you're competing directly with investors who pay cash and waive inspections. In [Neighborhood], cash buyers won [X]% of bids last year.

**$125K-$200K**:
> You have more options, but investor competition still shapes your market. In higher-demand neighborhoods, you may find yourself outbid by institutional buyers.

**Over $200K**:
> You're less directly affected by investor competition for housing, but investor activity in your neighborhood may affect property values, rental income, and neighborhood character.

*Source: Analysis #3, income bracket analysis; Analysis #8, breakeven analysis.*

### Chart Annotations

**Bar chart (demographic-bars.js)**:
> Each bar shows the [eviction/price/displacement] rate for one income-race group. Your group is highlighted.

**Dot chart (eviction-dots.js)**:
> Each dot is one data point. The spread shows how much variation exists within each group — averages don't tell the whole story.

---

## Screen 6: Things You Should Know

### Headline
> Things you should know.

### Renter Track Subhead
> As a renter in [Neighborhood] earning [Income bracket], here's what the data says about your housing situation.

### Owner Track Subhead
> As a homeowner or buyer in [Neighborhood] earning [Income bracket], here's what the data says about your market.

---

### Renter Track Copy

#### 6A: Who's your landlord?

**Headline**: Who owns your building?
**Body**:
> In **[Neighborhood]**, **[X]%** of rental properties are owned by corporate landlords, **[Y]%** by small LLCs, and **[Z]%** by individual owners. Why does this matter? Because the type of landlord you have affects how likely you are to face eviction, how quickly your rent rises, and how well your building is maintained.

*Source: Analysis #7, owner type classification by geography.*

**Tooltip on donut segments**:
> **[Type]**: [X]% of rental properties | [Y] eviction filings per 100 units | Avg. rent increase: [Z]%/year

#### 6B: Eviction risk by landlord type

**Headline**: Your eviction risk depends on who owns the building.
**Body**:
> In Boston, corporate landlords file evictions **186% more often** than small landlords. That's not because their tenants are worse — research shows the difference is driven by ownership structure, not tenant behavior. In **[Neighborhood]**, the eviction filing rate for corporate-owned properties is **[X]** per 100 units, compared to **[Y]** for owner-occupied buildings.

*Source: Urban Institute / Housing Matters — Boston multifamily eviction study; Analysis #7.*

#### 6C: Your rights

**Headline**: Know your rights.
**Body**:
> As a renter in **[Municipality]**, you have these protections:
> - **Security deposit**: Landlord must hold in interest-bearing account; limited to first month, last month, security deposit, and lock change fee.
> - **Retaliation protection**: Landlord cannot evict you for reporting code violations or organizing with other tenants.
> - **Habitability**: Landlord must maintain the property to state Sanitary Code standards.
> - **Condo conversion**: If your building is being converted, you have a right of first refusal to purchase your unit and extended notice periods.

> **What's being proposed** that could help you:
> - Rent stabilization (5% cap) — [see Policy & Action]
> - Just cause eviction protections — [see Policy & Action]

> **If you need help now**: Contact City Life / Vida Urbana (clvu.org) or Massachusetts Law Reform Institute (mlri.org).

*Source: Massachusetts tenant rights law; Policy Research document; Analysis #9.*

#### 6D: Best value neighborhoods

**Headline**: Where the better deals are.
**Body**:
> For households earning **[Income bracket]**, these neighborhoods offer the best balance of affordability, transit access, and lower investor activity:
> 1. **[Neighborhood A]** — Median rent: $[X] | Investor-owned: [Y]% | [Transit access note]
> 2. **[Neighborhood B]** — Median rent: $[X] | Investor-owned: [Y]% | [Transit access note]
> 3. **[Neighborhood C]** — Median rent: $[X] | Investor-owned: [Y]% | [Transit access note]
>
> Your current neighborhood, **[Name]**, ranks **[X]** out of **[Y]** for your income bracket.

*Source: Analysis #9, neighborhood value ranking for renters.*

---

### Owner/Buyer Track Copy

#### 6E: Can you afford it?

**Headline**: The price-to-income reality.
**Body**:
> In **[Neighborhood]**, the median home costs **[X] times** your annual income. The generally accepted "affordable" benchmark is 3x. For **[Race]** households earning **[Income bracket]**, homeownership in this area is **[accessible / challenging / very difficult / effectively out of reach]**.

> For context: in 2000, the same ratio was **[Y]x**. Investor competition is one factor driving prices up — but it's not the only one.

*Source: Analysis #3, price-to-income by demographic; Analysis #8.*

#### 6F: Cash buyer competition

**Headline**: You're competing with cash.
**Body**:
> Cash buyers — often investors — won **[X]%** of bids in **[Neighborhood]** last year. That's **[up/down]** from **[Y]%** five years ago. When an investor pays cash, they can close faster and waive financing contingencies. If you're relying on a mortgage, you're at a structural disadvantage.

> **What you can do**: Get pre-approved before shopping. Consider escalation clauses. Look at neighborhoods with lower investor competition (see below).

*Source: Analysis #5, cash vs. financed purchase trends.*

#### 6G: Should you rent or buy?

**Headline**: The rent-vs-buy math in your neighborhood.
**Body**:
> At current prices and rents in **[Neighborhood]**, it takes approximately **[X] years** for buying to become cheaper than renting (the "breakeven point"). If you plan to stay longer than **[X] years**, buying is likely the better financial decision — assuming you can afford the down payment and compete with cash buyers.

> Use the slider to adjust your assumptions (interest rate, down payment, expected appreciation) and see how the breakeven changes.

*Source: Analysis #8, rent-vs-buy breakeven model.*

#### 6H: Where to look

**Headline**: Lower-competition neighborhoods in your price range.
**Body**:
> If you're priced out of **[Neighborhood]** or tired of losing to cash offers, these areas have the lowest investor activity for homes in your price range:
> 1. **[Neighborhood A]** — Investor share: [X]% | Median price: $[Y] | Cash buyer rate: [Z]%
> 2. **[Neighborhood B]** — Investor share: [X]% | Median price: $[Y] | Cash buyer rate: [Z]%
> 3. **[Neighborhood C]** — Investor share: [X]% | Median price: $[Y] | Cash buyer rate: [Z]%

*Source: Analysis #2 + #5, investor competition by geography and price tier.*

---

## Screen 7: The Other Side

### Headline
> The other side of the story.

### Body
> We've shown you how investors can hurt. But intellectual honesty requires showing the full picture. In some cases, investor activity has positive effects:
>
> - **Property improvements**: Some investors purchase deteriorating properties and renovate them, improving housing quality and neighborhood aesthetics.
> - **Housing supply**: Investor-led development can add new units in supply-constrained markets.
> - **Market liquidity**: Investors buying distressed properties after the 2008 crisis prevented further price declines in some neighborhoods.
>
> The question isn't "are investors good or bad?" — it's **who benefits and who pays the cost**. In the Greater Boston data, the answer is clear: investment tends to benefit investors and wealthier neighborhoods while imposing costs on lower-income communities of color.

*Source: Analysis #6, neighborhood outcomes comparison; MAPC Homes for Profit nuanced findings.*

### Personalized Callout
> In **[Neighborhood]**, investor-renovated properties have **[higher/lower/similar]** assessed values compared to non-investor properties. Code violation rates in investor-owned buildings are **[X]** per 100 units vs. **[Y]** for owner-occupied.

*Source: Analysis #6, property quality comparison.*

### Chart Annotation (comparison.js)
> Each pair of dots shows a "before" and "after" value. Lines sloping up = improvement; lines sloping down = decline. Your neighborhood is highlighted.

---

## Screen 8: Policy & Action

### Headline
> What's being done — and what it means for you.

### Body
> Massachusetts is debating some of the most significant housing reforms in decades. We've ranked these by how much they'd affect someone in your situation. Here's what you need to know.

### Policy Card Templates

**Card: Rent Stabilization (5% cap)**
- Status badge: PROPOSED
- Summary: "Would let cities cap annual rent increases at 5% and ban no-fault evictions."
- Personalized (renter): "For you: Your annual rent increase would be capped at 5%, or about $[X]/month based on your current rent estimate."
- Personalized (owner): "For you: If you rent out property, your ability to raise rents would be limited. If you're buying, this wouldn't directly affect you."
- Evidence note: "Research from other cities shows rent control keeps tenants in their homes 10-20% longer, but may reduce rental housing supply by up to 15%."

**Card: 2026 Ballot Initiative**
- Status badge: ON BALLOT
- Summary: "Statewide vote to cap rent increases at 5% or CPI, whichever is lower. Exempts new buildings for 10 years and owner-occupied buildings with 4 or fewer units."
- Personalized (renter): "For you: This would cap your rent increases statewide — not just if your city opts in."
- Call to action: "You'll vote on this in November 2026."

**Card: Real Estate Transfer Fee**
- Status badge: PROPOSED
- Summary: "Would let cities charge a 0.5-2% fee on property sales over $1M. Revenue goes to affordable housing."
- Personalized (low-income): "For you: Revenue from this fee would fund affordable housing development in your community."
- Personalized (high-income owner): "For you: If you sell a home over $1M, you'd pay a fee of $[X]-$[Y]. The money funds affordable housing."

**Card: Condo Conversion Protections**
- Status badge: ENACTED 2024
- Summary: "Expanded protections to tenants in 2-3 family buildings. You now have a right of first refusal if your building converts to condos."
- Personalized (renter in 2-3 family): "For you: If your landlord converts your building to condos, you have the right to buy your unit first and extended eviction protections."

**Card: Affordable Homes Act**
- Status badge: ENACTED 2024
- Summary: "The largest housing investment in MA history — $5.16 billion over 5 years. Includes public housing improvements, affordable housing funding, ADU legalization, and eviction record protections."
- Personalized (renter with eviction history): "For you: Old eviction records can no longer be held against you when applying for new housing."
- Personalized (homeowner): "For you: You can now build an accessory dwelling unit up to 900 sq ft on your property by right — potential rental income."

**Card: Just Cause Eviction**
- Status badge: PROPOSED
- Summary: "Would require landlords to have a legal reason for evicting you. No more 'no-fault' evictions used to raise rents."
- Personalized (renter): "For you: Your landlord could no longer evict you without cause. This is especially important in [Neighborhood] where corporate landlords file evictions [X]% more often."

**Card: Corporate Ownership Transparency**
- Status badge: UNDER DISCUSSION
- Summary: "Various proposals to require LLC ownership disclosure and limit corporate residential property holdings."
- Personalized: "For you: Greater transparency would help identify who actually owns properties in [Neighborhood] — where [X]% of investor purchases are through LLCs."

### Caveat Box
> **A note on honesty**: We can't predict exactly what would happen if these policies pass. No one can — because you can't run the experiment twice. But we can share what the evidence from other cities suggests. We've tried to present both the benefits and the trade-offs. This is a data-informed overview, not legal advice. If you're facing a housing issue now, contact one of the organizations below.

### Call to Action
> **Make your voice heard.**
> - Find your state representative: [malegislature.gov]
> - Join the movement: City Life / Vida Urbana (clvu.org), Homes for All MA (homesforallmass.org)
> - Register to vote on the 2026 ballot initiative: [vote.org]

---

## Screen 9: Closing

### Headline
> Your housing story, in three numbers.

### Personalized Three-Number Display

*The system selects the 3 most striking stats from the user's journey. Examples:*

**Example A (renter, low-income, Black, Dorchester)**:
> **38%** of homes in Dorchester were bought by investors.
> **186%** more eviction filings from corporate landlords vs. small landlords.
> **5%** — the proposed cap on your annual rent increase.

**Example B (owner, moderate-income, White, Cambridge)**:
> **45%** of bids in Cambridge were won by cash buyers last year.
> **8 years** — how long before buying beats renting in your neighborhood.
> **$5.16B** — Massachusetts' historic investment in housing affordability.

**Example C (renter, moderate-income, Hispanic, East Boston)**:
> **1 in 4** homes in East Boston sold to investors.
> **$300/mo** — the kind of rent increase corporate landlords have imposed overnight.
> **124,000** signatures gathered for the 2026 rent control ballot initiative.

### Closing Body
> Housing is personal. The same trend — investor activity in Greater Boston — means very different things depending on who you are and where you live. We built this tool so you could see **your** story in the data.
>
> The data doesn't have all the answers. But it's a start. And now you know more about your housing market than most people ever will.

### Action Buttons
> **Share your results** — [Generates shareable URL with user's query parameters]
> **Explore more** — [Links back to interactive sections]
> **Take action** — [Links to advocacy organizations]
> **View the data** — [Links to MAPC Homes for Profit and other source data]

### Footer Attribution
> Built with data from MAPC "Homes for Profit," the Warren Group, Boston Housing Court, U.S. Census Bureau, and MassGIS. Visualization by [team name]. A project for [course name], [semester/year].

---

## Tone and Style Guide

- **Voice**: Like a knowledgeable friend who has done the research for you. Direct, honest, no jargon.
- **Person**: Second person ("you," "your"). First person plural when speaking as the team ("we built," "we can't predict").
- **Complexity**: 8th-grade reading level maximum. Short sentences. Active voice.
- **Honesty**: Always acknowledge uncertainty. Never overstate what the data shows. Present trade-offs.
- **Empathy**: Acknowledge that housing stress is real and personal. Never be condescending.
- **Balance**: Screen 7 exists to show the other side. Policy caveats are visible, not hidden.
- **Agency**: End with what the user can DO, not just what's being done TO them.
