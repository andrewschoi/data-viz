# Visual Inspiration — Hello Homeowners

## Purpose

This document collects visual references across diverse media — photography, print, physical design, illustration, and culturally representative work — to establish the tonal and aesthetic direction for "Hello Homeowners." The project serves Boston-area residents across racial, ethnic, and income lines, so the visual language must be inclusive, respectful, and grounded in lived experience.

---

## Photography References

### 1. Camilo Jose Vergara — Urban Documentation

**Source**: Camilo Jose Vergara's longitudinal photography of American cities
**Description**: Decades-long documentation of the same buildings and blocks in cities like Camden, Detroit, and New York. Photographs show incremental change — a rowhouse maintained, then neglected, then demolished, then replaced with a parking lot.

**What to borrow:**
- The power of "same place, different time" — could inform our Timeline screen's emotional arc
- Muted, natural lighting that avoids romanticizing or catastrophizing urban change
- Human-scale framing (not aerial/abstract — you can imagine living there)

---

### 2. Boston Globe — Spotlight Team Housing Photography

**Source**: Boston Globe investigative housing features
**Description**: Documentary photography of Boston triple-deckers, public housing, condo conversions. Shows the specific architectural textures of the Boston metro area — vinyl siding, fire escapes, porch railings, yard fences.

**What to borrow:**
- Boston-specific visual textures for background imagery or subtle pattern fills
- The warmth of brick and wood tones (reinforces our color palette)
- Real places the audience recognizes — Dot Ave, Blue Hill Ave, East Boston waterfront

---

### 3. LaToya Ruby Frazier — Community Portrait Photography

**Source**: LaToya Ruby Frazier, "The Notion of Family"
**Description**: Intimate black-and-white portraits of families and communities affected by industrial decline and disinvestment. Emphasizes dignity, agency, and intergenerational connection rather than victimhood.

**What to borrow:**
- The principle of **dignity-first** portrayal. When showing demographic data about who is hurt by investors, the visual framing must not reduce people to their hardship.
- Portraits that include context (home interiors, neighborhoods) without making poverty the spectacle.

---

### 4. Alex Webb — Color Street Photography

**Source**: Alex Webb, urban color photography (Magnum Photos)
**Description**: Vibrant, layered street photography in diverse communities. Complex compositions with multiple focal planes. Rich, saturated color.

**What to borrow:**
- The vibrancy and visual density of diverse neighborhoods — counters the "gray, clinical data" aesthetic
- Layered compositions as a metaphor for the layered data story (demographics, geography, time)

---

## Print & Editorial Design References

### 5. ProPublica Local Reporting Network — Report Layouts

**Source**: ProPublica print-format investigation layouts
**Description**: Full-bleed photography paired with data callouts. Pull quotes in large serif type with colored accent bars. Charts integrated into text flow rather than isolated in sidebars.

**What to borrow:**
- Chart-in-text-flow layout — visualizations feel like part of the story, not separate exhibits
- The accent bar treatment for personalized callouts ("In your neighborhood...")
- Clear hierarchy: massive stat > context paragraph > source citation

---

### 6. The Marshall Project — Print Magazine Aesthetic

**Source**: The Marshall Project feature layouts
**Description**: Generous whitespace, strong typographic hierarchy, restrained color. Data is presented in clean, simple charts (often just a few bars or a single line) with heavy annotation.

**What to borrow:**
- Heavy annotation on charts — the viz-engineer should add contextual labels directly on the chart, not just in surrounding text
- Generous margins and whitespace between sections (reinforces the "take your time, this matters" tone)

---

### 7. Harvard Joint Center for Housing Studies — Annual Report

**Source**: "The State of the Nation's Housing" annual reports
**Description**: Polished policy report design. Clean data tables, well-captioned maps, consistent chart styling. Professional but accessible.

**What to borrow:**
- The caption and source citation format (source name, year, and link on every chart)
- The balance of rigor and readability — data-confident without being intimidating

---

## Physical & Non-Digital References

### 8. Boston Neighborhood Signage

**Description**: The painted wooden signs marking neighborhood boundaries in Boston (e.g., "Welcome to Roxbury," "Dorchester — 1630"). Hand-lettered or classic sign-painter aesthetics. Often weathered, reflecting community history.

**What to borrow:**
- The warmth of hand-crafted type as an accent texture (not for body text, but for section dividers or neighborhood labels on the map)
- The idea that neighborhoods have identity and history — our map should feel like it's naming places, not just coloring polygons

---

### 9. Community Zine Aesthetics — Chinatown, Roxbury, East Boston

**Description**: Grassroots zines and community flyers from Boston neighborhoods. Often bilingual (English/Spanish, English/Chinese, English/Haitian Creole). Photocopied, collage-style, direct and urgent.

**What to borrow:**
- The directness and urgency of community communication — our "Things You Should Know" and "Policy & Action" screens should feel like practical advice from a neighbor, not a government pamphlet
- Bilingual sensitivity — while the app is in English, design should leave space for translation and avoid text-heavy layouts that break in other languages

---

### 10. WPA-Era Housing Murals

**Description**: New Deal-era murals and posters about housing, homeownership, and urban planning. Bold, graphic, populist style. Flat colors, strong silhouettes, optimistic messaging.

**What to borrow:**
- The populist, empowering tone — housing as a right, community as strength
- Bold graphic simplicity for the Landing screen and Closing screen, where the message should be clear and motivating
- The idea that housing policy is a public issue, not just a personal one

---

## Culturally Diverse Visual Language

### Principles for Inclusive Visual Design

**1. Avoid demographic stereotyping through imagery.**
- Never use stock photography that reduces racial/ethnic groups to visual shorthand
- If photography is used, source from within communities (local photographers, community organizations)
- Prefer abstract/architectural photography over portraits when illustrating demographic data

**2. Color-to-group assignment must be arbitrary and neutral.**
- No racial group should be assigned red (too negative), green (too positive), or any color with strong cultural associations for that group
- Our categorical palette uses muted, equitable tones — no color "stands out" more than others
- The only color that stands out is `--color-you`, which marks the user's own group regardless of what that group is

**3. Iconography should be universal.**
- Use simple geometric icons (house, building, dollar sign, document) rather than culturally specific imagery
- Avoid hand/skin-tone icons
- If human silhouettes are used, they should be abstract and not racially coded

**4. Language and labels must be respectful.**
- Racial categories should use the terms from the census data (White, Black, Hispanic/Latino, Asian, Other/Multiracial) without modification
- Income categories should use bracket ranges, not loaded terms like "poor" or "wealthy"
- Neighborhood names should match community usage, not just municipal designations

### Anti-Patterns to Avoid

| Anti-Pattern | Why It Fails | What to Do Instead |
|---|---|---|
| Heat maps with red = "bad neighborhoods" | Implies blame on residents, not investors | Use the sequential scale with neutral naming ("higher investor activity") |
| Before/after "blight to beauty" imagery | Implies disinvestment = ugliness, investment = improvement (erases displacement) | Show outcomes data (prices, evictions, ownership rates) without aesthetic judgment |
| Single "diverse group" stock photo | Tokenizing, feels corporate | Use abstract/architectural imagery; let the data represent people |
| Emoji flags or cultural symbols per group | Reductive, potentially offensive | Use consistent geometric shapes across all groups |
| Poverty-focused imagery for certain neighborhoods | Reinforces deficit narratives | Show neighborhoods as places with identity, history, and data — not problems |

### Positive Examples

**The Opportunity Atlas (Harvard/Census)**
- Uses abstract dot-density maps where each dot represents a person, colored by outcome
- No portraits, no neighborhood judgment — just data marks in geographic space
- Personalization happens through the user finding their own tract, not through targeted imagery

**Data for Black Lives — Report Design**
- Centers community voice and data sovereignty
- Uses bold typography and color to convey urgency without exploitative imagery
- Charts are annotated with context about data limitations and collection biases

**Urban Displacement Project (UC Berkeley)**
- Maps gentrification and displacement risk with neutral, accessible language
- Color scales use purple (low risk) to red (high risk) — avoids green/red moral coding
- Hover states show specific policy recommendations, not just data values

---

## Mood Board Summary

The visual identity of "Hello Homeowners" sits at the intersection of:

| Axis | Toward | Away From |
|---|---|---|
| Tone | Investigative journalism (ProPublica, Marshall Project) | Government data portal |
| Warmth | Boston brick/brownstone palette | Cold corporate blue-gray |
| Personalization | "This is about YOU" (Opportunity Atlas) | "Look at these statistics" |
| Community | Neighbor-to-neighbor advice (zine energy) | Top-down policy lecture |
| Rigor | Harvard JCHS data confidence | Buzzfeed infographic |
| Inclusivity | Dignity-first, data-represents-people | Stereotype-driven imagery |
