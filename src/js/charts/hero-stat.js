/**
 * hero-stat.js — Animated number counter for Screen 2 (Big Picture)
 * Uses d3.interpolateNumber with easing for the "1 in 5" reveal.
 */
import { getDuration, formatNumber, formatPercent } from '../utils/scales.js';

let created = false;

export function create(container, data, options = {}) {
  if (created) return;
  created = true;

  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;

  const investorShare = data.investor_purchase_share;
  const ratio = Math.round(1 / investorShare);
  const totalInvestor = data.total_investor_purchases;

  // Main stat
  const mainDiv = document.createElement('div');
  mainDiv.innerHTML = `
    <div class="hero-stat__number" id="hero-main-number">1 in ${ratio}</div>
    <div class="hero-stat__label">homes sold in Greater Boston went to an investor</div>
    <div class="hero-stat__secondary">
      <div class="hero-stat__sub">
        <div class="hero-stat__sub-number" id="hero-total">${formatNumber(totalInvestor)}</div>
        <div class="hero-stat__sub-label">investor purchases (2004-2018)</div>
      </div>
      <div class="hero-stat__sub">
        <div class="hero-stat__sub-number">${data.n_neighborhoods}</div>
        <div class="hero-stat__sub-label">Boston neighborhoods analyzed</div>
      </div>
    </div>
  `;
  el.appendChild(mainDiv);

  // Update aria
  const descEl = document.getElementById('hero-stat-desc');
  if (descEl) {
    descEl.textContent = `${formatPercent(investorShare)} of residential purchases in the Boston metro area were made by investors between 2004 and 2018. That is approximately 1 in every ${ratio} homes sold.`;
  }
}

export function update(data, options = {}) {
  // Not needed for this static stat
}

export function highlight(demographic) {
  const el = document.getElementById('hero-personalized');
  if (!el || !demographic.neighborhood) return;
  el.hidden = false;

  // Find neighborhood-specific rate from neighborhood investor rates
  // For now, use the global rate with a personalized note
  el.innerHTML = `
    <p><strong>Your neighborhood: ${demographic.neighborhood}</strong></p>
    <p>We're showing you data from across Greater Boston, with your area highlighted throughout.</p>
  `;
}

export function animateIn() {
  const numberEl = document.getElementById('hero-main-number');
  if (!numberEl) return;

  const duration = getDuration(800);
  if (duration === 0) return;

  const finalText = numberEl.textContent;
  numberEl.style.opacity = '0';
  numberEl.style.transform = 'translateY(20px)';

  requestAnimationFrame(() => {
    numberEl.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
    numberEl.style.opacity = '1';
    numberEl.style.transform = 'translateY(0)';
  });
}
