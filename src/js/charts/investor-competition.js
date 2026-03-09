/**
 * investor-competition.js — Ranked bar chart of lowest investor competition (Screen 6 Owner)
 */
import * as tooltip from '../utils/tooltip.js';
import { getDuration, getCSSVar, getYouColor, formatPercent, formatCurrency } from '../utils/scales.js';

let svg, created = false;

export function create(container, data, options = {}) {
  if (created) return;
  created = true;

  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;

  // Data already sorted low to high
  const sorted = data.slice(0, 15);

  const width = el.clientWidth || 800;
  const barHeight = 26;
  const margin = { top: 30, right: 100, bottom: 30, left: 130 };
  const height = margin.top + margin.bottom + sorted.length * (barHeight + 4);
  const innerWidth = width - margin.left - margin.right;

  svg = d3.select(el)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);

  svg.selectAll('*').remove();

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(sorted, d => d.investor_share) * 1.2])
    .range([0, innerWidth]);

  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  svg.append('text')
    .attr('x', margin.left)
    .attr('y', 18)
    .attr('font-size', '14px')
    .attr('font-weight', '600')
    .attr('fill', getCSSVar('--color-neutral-800'))
    .text('Neighborhoods with Lowest Investor Competition');

  const duration = getDuration(300);

  sorted.forEach((d, i) => {
    const y = i * (barHeight + 4);
    const isUser = options.userNeighborhood === d.neighborhood;

    g.append('text')
      .attr('x', -8)
      .attr('y', y + barHeight / 2 + 4)
      .attr('text-anchor', 'end')
      .attr('font-size', '12px')
      .attr('font-weight', isUser ? '700' : '400')
      .attr('fill', isUser ? getYouColor() : getCSSVar('--color-neutral-600'))
      .text(d.neighborhood);

    const bar = g.append('rect')
      .attr('x', 0)
      .attr('y', y)
      .attr('width', 0)
      .attr('height', barHeight)
      .attr('fill', isUser ? getYouColor() : getCSSVar('--color-owner-accent'))
      .attr('opacity', isUser ? 1 : 0.7)
      .attr('rx', 2)
      .attr('tabindex', '0')
      .attr('role', 'img')
      .attr('aria-label', `${d.neighborhood}: ${formatPercent(d.investor_share)} investor share`);

    bar.transition()
      .duration(duration)
      .delay(i * getDuration(20))
      .attr('width', xScale(d.investor_share));

    g.append('text')
      .attr('x', xScale(d.investor_share) + 6)
      .attr('y', y + barHeight / 2 + 4)
      .attr('font-size', '10px')
      .attr('fill', getCSSVar('--color-neutral-500'))
      .text(`${formatPercent(d.investor_share, 0)} | ${formatCurrency(d.median_price)}`)
      .attr('opacity', 0)
      .transition()
      .duration(duration)
      .delay(i * getDuration(20))
      .attr('opacity', 1);

    bar.on('mouseenter', (event) => {
      tooltip.show(event, tooltip.formatTooltip(d.neighborhood, [
        ['Investor share', formatPercent(d.investor_share)],
        ['Cash buyer share', formatPercent(d.cash_share)],
        ['Median price', formatCurrency(d.median_price)],
        ['Total sales', d.total_sales.toLocaleString()],
      ]));
    })
    .on('mouseleave', () => tooltip.hide());
  });

  const descEl = document.getElementById('investor-competition-desc');
  if (descEl) {
    descEl.textContent = `Ranked bar chart showing ${sorted.length} neighborhoods with the lowest investor competition. ${sorted[0].neighborhood} has the lowest at ${formatPercent(sorted[0].investor_share)}.`;
  }
}

export function update(data, options = {}) {
  created = false;
  if (svg) svg.selectAll('*').remove();
  create(document.getElementById('investor-competition-viz'), data, options);
}

export function highlight(demographic) {}
