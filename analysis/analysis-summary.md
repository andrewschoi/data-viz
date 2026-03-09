# Data Analysis Summary

## Analysis #1: Investor Geography

**Key Finding**: Corporate ownership in Boston has exploded from 5.5% (2004) to 25.3% (2024) on average across 21 neighborhoods — a nearly 5x increase in two decades.

**Top Corporate Ownership Neighborhoods (2024)**:
1. South Boston Waterfront: 38% corporate, 29% owner-occupied
2. Fenway: 36% corporate, 16% owner-occupied
3. Downtown: 34% corporate, 30% owner-occupied
4. Longwood: 34% corporate, 18% owner-occupied
5. Allston: 30% corporate, 22% owner-occupied

**Metro-wide** (MAPC region, 803 census tracts): 13.8% of all residential sales (61,818 of 447,201) involved investor buyers. Investor activity varies dramatically by tract from near-zero to over 50%.

**Output**: `choropleth-investor-activity.json`, `neighborhood-investor-rates.json`

---

## Analysis #2: Investor Activity Over Time

**Key Finding**: Corporate ownership grew steadily 2004-2024, with notable acceleration around 2020 (+3.8 percentage points in one year — the largest single-year jump).

**Inflection Points**:
- 2020: +3.81% (largest increase — pandemic year, possible fire-sale acquisitions)
- 2021: +2.52% (continued acceleration)
- 2024: +2.38% (ongoing trend)

**Owner-occupancy** has declined correspondingly as corporate ownership rose.

**Output**: `timeline-corp-ownership.json`

---

## Analysis #3: Demographic Impact

**Key Finding**: Investor activity disproportionately targets lower-income and communities of color.

**By Income (tract-level)**:
- Lowest income quintile (median $53,692): 22.9% investor share
- Highest income quintile (median $168,125): 10.9% investor share
- This is a **2.1x disparity** — investors purchase at more than double the rate in low-income tracts

**By Race (majority-race tracts)**:
- Majority Black tracts: 30.6% investor share (19 tracts)
- Majority Hispanic/Latino tracts: 26.0% investor share (27 tracts)
- No Majority tracts: 21.2% investor share (150 tracts)
- Majority White tracts: 12.7% investor share (600 tracts)

**Correlation with corp ownership rate** (neighborhood level):
- % Black: -0.625 (strong negative — more Black residents = lower corp ownership BUT this reflects Boston-specific geography where neighborhoods like Dorchester/Roxbury have different patterns)
- % White: +0.438 (positive — corp ownership concentrates in whiter, more affluent neighborhoods at the neighborhood level)

**Important Nuance**: At the **neighborhood level**, corporate ownership is highest in affluent areas (South Boston Waterfront, Fenway, Downtown). But at the **tract level**, investor *purchasing activity* (distinct from ownership rate) disproportionately targets lower-income and minority communities. This distinction is important for the narrative.

**Output**: `demographic-bars.json`, `demographic-impact.json`

---

## Analysis #4: Personalization Segmentation

Schema defines canonical dimensions:
- **Income**: 5 brackets from Under $35k to $200k+
- **Race**: White, Black, Hispanic/Latino, Asian, Other/Multiracial
- **Housing status**: Renter or Owner
- **Neighborhoods**: 21 Boston neighborhoods + 101 MAPC municipalities

**Output**: `personalization-schema.json`

---

## Analysis #5: Renter vs Owner Outcomes

**Key Finding**: Higher corporate ownership correlates with higher eviction rates, though the relationship is modest.

**Correlation**: corp_own_rate vs eviction_rate = 0.098 (weak positive at tract level)

**Eviction Rates by Corporate Ownership Quintile (per 1,000 residents)**:
- Q1 (Lowest corp, avg 6.1%): 19.4 evictions/1000
- Q5 (Highest corp, avg 32.6%): 24.4 evictions/1000

This represents a **26% higher eviction rate** in the highest corporate ownership tracts vs the lowest.

**Output**: `eviction-by-tract.json`

---

## Analysis #6: Owner Type Breakdown

**Metro-wide investor type distribution** (from all sales):
- Non-investor (owner-occupied): 43.1% (385,364)
- Non-small LLC investor: 45.6% (407,626)
- Small LLC investor: 4.4% (39,556)
- Institutional investor: 2.0% (17,980)
- Small investor: 2.1% (19,161)
- Medium investor: 1.7% (14,881)
- Large investor: 1.1% (9,796)

**Note**: The "Non-small LLC investor" category is large and likely includes trusts, business entities that may or may not be investors. The data schema doesn't cleanly separate owner-occupant LLCs from investor LLCs.

**Output**: `landlord-type-donut.json`

---

## Analysis #7: Renter Experience & Eviction Patterns

**Total eviction filings**: 52,146 (2020-2024, statewide dataset filtered to Boston)

**Eviction Types**:
- Non-payment of Rent: 33,807 (64.8%)
- No Cause: 8,656 (16.6%)
- Cause: 8,314 (15.9%)
- Foreclosure: 801 (1.5%)

**Top Boston Neighborhoods by Eviction Count**:
1. Dorchester: 2,035
2. Roxbury: 553
3. Hyde Park: 488
4. Mattapan: 466
5. South End: 433

**Serial Filers**: 1,722 plaintiffs filed 5+ cases, accounting for 27,409 total cases. Top filer: Corcoran Management Co. (694 cases).

**Temporal Pattern**: Spike in filings 2020-2021 (possibly backlog from COVID moratorium), then sharp decline in 2023-2024 data (likely data recency issue).

**Output**: `eviction-by-neighborhood.json`, `eviction-by-owner-type.json`, `eviction-case-types.json`, `eviction-monthly-trend.json`

---

## Analysis #8: Rent vs Buy Breakeven

**Key Finding**: Across the metro area, the median breakeven point for buying vs renting is approximately 7.1 years, but it varies significantly by income.

**By Income Bracket**:
| Income Bracket | Price-to-Income Ratio | Breakeven Years |
|---|---|---|
| Under $55k | 7.0x | 8.4 years |
| $55k-$80k | 4.5x | 7.0 years |
| $80k-$105k | 4.2x | 6.6 years |
| $105k-$130k | 3.9x | 6.7 years |
| $130k+ | 3.8x | 7.5 years |

**Cash Buyer Competition**: ~25% of all Boston residential sales are cash purchases (mortgage=0). Investors pay cash 39% of the time vs 21% for non-investors, giving them a significant competitive advantage.

**Caveats**: Breakeven calculation uses simplified assumptions (20% down, 6.5% rate, 3% appreciation, 30% rent-to-income). Actual breakeven varies by specific property and market conditions.

**Output**: `price-income-gauge.json`, `cash-buyer-competition.json`, `rent-buy-breakeven.json`, `investor-competition.json`

---

## Analysis #9: Flip Analysis (Enrichment)

**Total Flips**: 16,559 out of 179,920 Boston sales (9.2%)

**Trends**: Flip rate peaked around 2004-2007 (pre-crisis), declined post-2008, and has stabilized at 6-9% since 2015.

**Recent Profits** (median):
- 2018: $130,000 per flip
- 2019: $107,575
- 2020: $92,800
- 2021: $115,000
- 2022: $125,000

**Top Flip Neighborhoods**:
1. Dorchester: 3,672 flips, $73,000 median profit
2. South Boston: 1,318 flips, $55,000 median profit
3. Back Bay: 1,146 flips, $70,750 median profit

**Output**: `flip-analysis.json`, `flip-by-neighborhood.json`

---

## Analysis #10: Condo Conversions (Enrichment)

**Boston**: 2,245 properties converted to condos
**Cambridge**: 285 properties converted

**Top Boston Neighborhoods**:
1. South Boston: 67 conversions, 429 units created
2. Jamaica Plain: 66 conversions, 230 units
3. Dorchester: 61 conversions, 260 units
4. Roslindale: 44 conversions, 172 units
5. East Boston: 37 conversions, 128 units

**Output**: `condo-conversions.json`

---

## Data Quality Notes

1. **cash_sale column**: Contains only zeros/nulls in boston_residential_sales.csv. Used `mortgage == 0` as proxy for cash sales.
2. **Eviction data**: 2023-2024 data appears incomplete (only 157 filings vs 17,000+ in 2022). Temporal analysis should caveat this.
3. **Investor type classification**: The "Non-small LLC investor" category (45.6%) is ambiguous and may include both investors and legitimate entity-held owner-occupied properties.
4. **Census tract matching**: 2010 and 2020 tracts don't perfectly align due to redistricting; 592 of ~800 tracts matched for comparison analysis.
5. **Neighborhood mapping**: Not all zip codes map to named neighborhoods; about 2.5% of Boston sales could not be assigned.
