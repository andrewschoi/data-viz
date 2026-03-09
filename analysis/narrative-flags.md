# Narrative Flags

Flags for the narrative-architect where data findings may affect story assumptions.

---

## Flag 1: Corporate Ownership vs. Investor Purchasing — Two Different Stories

**Date**: 2026-03-08
**Agent**: data-analyst
**Issue**: At the neighborhood level, corporate ownership is highest in affluent, whiter neighborhoods (South Boston Waterfront 38%, Fenway 36%, Downtown 34%). But at the tract level, investor *purchasing activity* disproportionately targets lower-income and majority-minority tracts (30.6% in majority-Black tracts vs 12.7% in majority-White tracts).

**Suggested Resolution**: The narrative should distinguish between "where investors already own" (affluent areas) and "where investors are actively buying" (lower-income, minority communities). The "Who Gets Hurt" screen should focus on the purchasing/activity metric rather than the ownership rate metric, as the purchasing data better captures the ongoing displacement dynamic.

---

## Flag 2: Eviction Data Has a Recency Gap

**Date**: 2026-03-08
**Agent**: data-analyst
**Issue**: The eviction filings dataset shows 17,844 filings in 2022 but only 153 in 2023 and 4 in 2024. This is almost certainly a data collection lag, not a real decline. The 2020-2021 spike may also be distorted by COVID moratorium backlog.

**Suggested Resolution**: The narrative should focus on 2020-2022 eviction data as the reliable period. Any temporal claims about eviction trends should caveat the data gap. Do not present the 2023-2024 decline as evidence that evictions decreased.

---

## Flag 3: Cash Sale Indicator Unreliable

**Date**: 2026-03-08
**Agent**: data-analyst
**Issue**: The `cash_sale` column in boston_residential_sales.csv contains only zeros/nulls. Analysis used `mortgage == 0` as a proxy, which may overcount (e.g., gifts, non-arm's-length transactions) or undercount cash sales.

**Suggested Resolution**: The narrative should present cash buyer statistics with appropriate caveats. Language like "approximately 25% of sales involved no mortgage financing" is more accurate than "25% were cash purchases."

---

## Flag 4: Correlation Between Corp Ownership and Evictions is Weak

**Date**: 2026-03-08
**Agent**: data-analyst
**Issue**: The tract-level correlation between corporate ownership rate and eviction rate is only 0.098 (very weak). The quintile analysis shows a more meaningful pattern (19.4 vs 24.4 per 1000), but the relationship is not as strong as the narrative might imply.

**Suggested Resolution**: Present the eviction-investor link as "associated with" rather than "caused by." The quintile comparison (26% higher eviction rate in highest-corporate-ownership tracts) is the strongest defensible claim. Avoid implying direct causation.

---

## Flag 5: "Non-Small LLC Investor" Category is Ambiguous

**Date**: 2026-03-08
**Agent**: data-analyst
**Issue**: 45.6% of all sales are classified as "Non-small LLC investor" in the aggregated data. This category likely includes many legitimate owner-occupied properties held in trusts or family LLCs, not actual investors. The investor type classification in the raw data is more granular but doesn't perfectly separate investors from non-investors.

**Suggested Resolution**: Use the explicit investor categories (institutional, large, medium, small) for the landlord type donut chart rather than the LLC-based categories. Present total investor share as the sum of the four named categories (approximately 7% of sales), which is more defensible than including the ambiguous LLC categories.
