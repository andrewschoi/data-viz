# Supplementary Findings

Five exploratory findings for presentation depth slides. Each is self-contained and suitable for a single slide.

---

## Finding 1: The Investor Cash Advantage

**Insight**: Investors are nearly twice as likely to make all-cash purchases compared to regular homebuyers, giving them a decisive advantage in competitive bidding situations.

**Statistics**:
- Investor cash purchase rate: 39-41% of all investor purchases
- Non-investor cash purchase rate: 19-22% of regular purchases
- This ~2x gap has remained consistent from 2018-2022
- In a market where 25% of all sales are cash, first-time buyers face systematic disadvantage

**Why it matters**: Cash offers close faster, have no financing contingencies, and are preferred by sellers. In a tight market, this means investors can outcompete regular buyers even when offering similar prices.

**Data source**: Boston residential sales 2000-2023, `mortgage == 0` as cash proxy.

---

## Finding 2: The COVID Acceleration

**Insight**: Corporate ownership jumped by 3.81 percentage points in 2020 alone — the single largest year-over-year increase in the 20-year dataset — suggesting pandemic conditions accelerated institutional acquisition.

**Statistics**:
- Pre-COVID (2019): avg 19.5% corporate ownership across Boston neighborhoods
- Post-COVID (2021): avg 25.8% corporate ownership
- Two-year change: +6.3 percentage points (more than the entire 2004-2010 period combined)
- This coincided with eviction moratoriums ending and economic distress

**Why it matters**: Economic shocks don't affect all populations equally. The pandemic created buying opportunities for well-capitalized investors while distressed owners and landlords sold. This pattern mirrors what happened after the 2008 financial crisis but at a faster pace.

**Data source**: Corp_Ownership_and_Occupancy_Over_Time.csv

---

## Finding 3: Serial Eviction Filers — The Corporate Landlord Pattern

**Insight**: A small number of corporate landlords drive a disproportionate share of eviction filings. Just 1,722 plaintiffs (those filing 5+ cases) account for 27,409 of all eviction cases — over 52% of total filings.

**Statistics**:
- Top filer: Corcoran Management Co. — 694 eviction cases
- Top 10 filers combined: 3,507 cases
- Most top filers are property management companies, housing authorities, or corporate LLCs
- 16.6% of all evictions are "No Cause" — meaning tenants are evicted without any stated reason

**Why it matters**: This suggests that evictions in Boston are not primarily small-landlord disputes but a systematic practice by large property management companies. Policy interventions like "just cause eviction" laws would disproportionately affect these serial filers.

**Data source**: Eviction filings + plaintiffs data (2020-2024)

---

## Finding 4: The Dorchester Flip Factory

**Insight**: Dorchester alone accounts for more property flips than any other Boston neighborhood by a factor of nearly 3x, with 3,672 flips generating a median profit of $73,000 each.

**Statistics**:
- Dorchester: 3,672 flips (22% of all Boston flips)
- South Boston: 1,318 flips
- Back Bay: 1,146 flips
- Dorchester is also the #1 neighborhood for eviction filings (2,035 cases)
- The combination of high flip activity and high evictions suggests a pattern where investors purchase, renovate, and either sell or convert to higher-rent units, displacing existing tenants

**Why it matters**: The concentration of both flipping and evictions in the same neighborhood is not coincidental. It points to a cycle where investor acquisition, renovation, and tenant displacement are interconnected parts of the same investment strategy.

**Data source**: Boston residential sales (flip flags) + eviction filings

---

## Finding 5: The Income-Investor Gradient

**Insight**: There is a nearly perfect inverse relationship between neighborhood income and investor activity — investors are 2.1x more active in the lowest-income tracts compared to the highest-income tracts.

**Statistics**:
| Income Quintile | Median Income | Investor Purchase Share |
|---|---|---|
| Q1 (Lowest) | $53,692 | 22.9% |
| Q2 | $80,974 | 16.2% |
| Q3 | $104,176 | 13.5% |
| Q4 | $127,520 | 12.4% |
| Q5 (Highest) | $168,125 | 10.9% |

This monotonic decline from 22.9% to 10.9% means that residents who can least afford housing competition face the most of it from institutional buyers.

Similarly, majority-Black tracts see 30.6% investor share vs 12.7% in majority-White tracts — a 2.4x disparity that intersects with the income gradient.

**Why it matters**: This finding directly contradicts the narrative that investors primarily target luxury/high-end markets. In Boston, the data shows investors systematically target affordable neighborhoods where their capital advantage is greatest and residents have the fewest alternatives.

**Data source**: Aggregated 2020 sales + census data by tract
