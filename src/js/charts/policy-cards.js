/**
 * policy-cards.js — Data-driven card layout for Screen 8 (Policy & Action)
 * Renders sortable/filterable policy cards with personalized relevance.
 */
import { getDuration, formatPercent, getCSSVar } from '../utils/scales.js';

let created = false;
let policyData = null;

const STATUS_CLASSES = {
  'Proposed': 'policy-card__status--proposed',
  'Proposed (Federal)': 'policy-card__status--proposed',
  'Existing (Boston)': 'policy-card__status--enacted',
  'Enacted': 'policy-card__status--enacted',
  'On Ballot': 'policy-card__status--ballot',
};

export function create(container, data, options = {}) {
  if (created) return;
  created = true;
  policyData = data;

  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;

  const isRenter = options.status === 'renter';

  // Sort by relevance (for now, just render in order)
  const sorted = [...data];

  el.innerHTML = '';

  sorted.forEach((policy, i) => {
    const card = document.createElement('div');
    card.className = 'policy-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';

    const statusClass = STATUS_CLASSES[policy.status] || 'policy-card__status--proposed';

    const relevanceText = isRenter ? policy.relevance_renter : policy.relevance_owner;

    let dataContextHTML = '';
    if (policy.data_context) {
      const ctx = policy.data_context;
      if (ctx.pct_sales_over_1m !== undefined && ctx.pct_sales_over_1m !== null) {
        dataContextHTML = `<p style="font-size:var(--font-size-caption);color:var(--color-neutral-500);margin-top:var(--space-2)">Data: ${formatPercent(ctx.pct_sales_over_1m)} of sales over $1M</p>`;
      } else if (ctx.no_cause_evictions_pct !== undefined && ctx.no_cause_evictions_pct !== null) {
        dataContextHTML = `<p style="font-size:var(--font-size-caption);color:var(--color-neutral-500);margin-top:var(--space-2)">Data: ${formatPercent(ctx.no_cause_evictions_pct)} of evictions are no-cause</p>`;
      } else if (ctx.investor_purchases_per_year !== undefined && ctx.investor_purchases_per_year !== null) {
        dataContextHTML = `<p style="font-size:var(--font-size-caption);color:var(--color-neutral-500);margin-top:var(--space-2)">Data: ~${ctx.investor_purchases_per_year.toLocaleString()} investor purchases/year</p>`;
      } else if (ctx.llc_purchase_share !== undefined && ctx.llc_purchase_share !== null) {
        dataContextHTML = `<p style="font-size:var(--font-size-caption);color:var(--color-neutral-500);margin-top:var(--space-2)">Data: ${formatPercent(ctx.llc_purchase_share)} of purchases through LLCs</p>`;
      } else if (ctx.annual_conversions_boston !== undefined && ctx.annual_conversions_boston !== null) {
        dataContextHTML = `<p style="font-size:var(--font-size-caption);color:var(--color-neutral-500);margin-top:var(--space-2)">Data: ~${ctx.annual_conversions_boston} condo conversions/year in Boston</p>`;
      }
    }

    card.innerHTML = `
      <span class="policy-card__status ${statusClass}">${policy.status}</span>
      <h4 class="policy-card__title">${policy.title}</h4>
      <p class="policy-card__description">${policy.description}</p>
      <div class="policy-card__relevance">
        <strong>For you:</strong> ${relevanceText}
      </div>
      ${dataContextHTML}
    `;

    el.appendChild(card);

    // Animate in
    const duration = getDuration(300);
    setTimeout(() => {
      card.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * getDuration(80));
  });

  // Sort handler
  const sortSelect = document.getElementById('policy-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const sortBy = sortSelect.value;
      let resorted;
      if (sortBy === 'status') {
        const statusOrder = { 'On Ballot': 0, 'Proposed': 1, 'Proposed (Federal)': 2, 'Existing (Boston)': 3 };
        resorted = [...policyData].sort((a, b) => (statusOrder[a.status] || 5) - (statusOrder[b.status] || 5));
      } else {
        resorted = [...policyData]; // Default order
      }
      created = false;
      create(el, resorted, options);
    });
  }
}

export function update(data, options = {}) {
  created = false;
  policyData = data;
  const el = document.getElementById('policy-cards-container');
  if (el) create(el, data, options);
}

export function highlight(demographic) {}
