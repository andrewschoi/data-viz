/**
 * tooltip.js — Reusable D3 tooltip component
 * Dark background, follows mouse/touch, configurable content.
 */

let tooltipEl = null;

/** Create or get the singleton tooltip element */
function getTooltip() {
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'chart-tooltip';
    tooltipEl.setAttribute('role', 'tooltip');
    tooltipEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(tooltipEl);
  }
  return tooltipEl;
}

/** Show tooltip with HTML content near the mouse position */
export function show(event, html) {
  const tip = getTooltip();
  tip.innerHTML = html;
  tip.classList.add('is-visible');
  tip.setAttribute('aria-hidden', 'false');

  const rect = tip.getBoundingClientRect();
  const pageX = event.pageX || (event.touches && event.touches[0] ? event.touches[0].pageX : 0);
  const pageY = event.pageY || (event.touches && event.touches[0] ? event.touches[0].pageY : 0);

  let left = pageX + 12;
  let top = pageY - 12;

  // Keep within viewport
  if (left + rect.width > window.innerWidth + window.scrollX - 10) {
    left = pageX - rect.width - 12;
  }
  if (top + rect.height > window.innerHeight + window.scrollY - 10) {
    top = pageY - rect.height - 12;
  }
  if (top < window.scrollY + 10) {
    top = window.scrollY + 10;
  }

  tip.style.left = `${left}px`;
  tip.style.top = `${top}px`;
}

/** Hide the tooltip */
export function hide() {
  const tip = getTooltip();
  tip.classList.remove('is-visible');
  tip.setAttribute('aria-hidden', 'true');
}

/** Build a standard tooltip HTML string */
export function formatTooltip(title, rows) {
  let html = `<div class="chart-tooltip__title">${title}</div>`;
  rows.forEach(([label, value]) => {
    html += `<div class="chart-tooltip__row"><span>${label}</span><span>${value}</span></div>`;
  });
  return html;
}
