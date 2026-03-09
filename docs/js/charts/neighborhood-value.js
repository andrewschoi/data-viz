/**
 * neighborhood-value.js — Strip/dot plot of neighborhood investment & pricing (Screen 6 Renter)
 */
import * as tooltip from '../utils/tooltip.js';
import { getDuration, getCSSVar, getYouColor, formatPercent, formatCurrency } from '../utils/scales.js';

let svg, created = false;

export function create(container, data, options = {}) {
  if (created) return;
  created = true;

  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;

  const sorted = [...data].sort((a, b) => a.investor_share - b.investor_share);

  const width = el.clientWidth || 800;
  const barHeight = 26;
  const margin = { top: 30, right: 90, bottom: 40, left: 130 };
  const height = margin.top + margin.bottom + sorted.length * (barHeight + 4);
  const innerWidth = width - margin.left - margin.right;

  svg = d3.select(el)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);

  svg.selectAll('*').remove();

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(sorted, d => d.investor_share) * 1.1])
    .range([0, innerWidth]);

  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Title
  svg.append('text')
    .attr('x', margin.left)
    .attr('y', 18)
    .attr('font-size', '14px')
    .attr('font-weight', '600')
    .attr('fill', getCSSVar('--color-neutral-800'))
    .text('Neighborhoods by Investor Share (Lower = Less Competition)');

  // X axis
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${sorted.length * (barHeight + 4)})`)
    .call(d3.axisBottom(xScale).tickFormat(d => `${(d * 100).toFixed(0)}%`).ticks(6));

  const duration = getDuration(300);

  sorted.forEach((d, i) => {
    const y = i * (barHeight + 4);
    const isUser = options.userNeighborhood === d.neighborhood;

    // Label
    g.append('text')
      .attr('x', -8)
      .attr('y', y + barHeight / 2 + 4)
      .attr('text-anchor', 'end')
      .attr('font-size', '12px')
      .attr('font-weight', isUser ? '700' : '400')
      .attr('fill', isUser ? getYouColor() : getCSSVar('--color-neutral-600'))
      .text(d.neighborhood);

    // Dot
    const dotX = xScale(d.investor_share);
    const dot = g.append('circle')
      .attr('cx', dotX)
      .attr('cy', y + barHeight / 2)
      .attr('r', 0)
      .attr('fill', isUser ? getYouColor() : getCSSVar('--color-cat-7'))
      .attr('tabindex', '0')
      .attr('role', 'img')
      .attr('aria-label', `${d.neighborhood}: ${formatPercent(d.investor_share)} investor share, median price ${formatCurrency(d.median_price)}`);

    dot.transition()
      .duration(duration)
      .delay(i * getDuration(20))
      .attr('r', isUser ? 8 : 6);

    // Connecting line
    g.append('line')
      .attr('x1', 0)
      .attr('y1', y + barHeight / 2)
      .attr('x2', dotX)
      .attr('y2', y + barHeight / 2)
      .attr('stroke', getCSSVar('--color-neutral-200'))
      .attr('stroke-width', 1);

    // Value
    g.append('text')
      .attr('x', dotX + 12)
      .attr('y', y + barHeight / 2 + 4)
      .attr('font-size', '10px')
      .attr('fill', getCSSVar('--color-neutral-500'))
      .text(`${formatPercent(d.investor_share, 0)} | ${formatCurrency(d.median_price)}`);

    // Tooltip
    dot.on('mouseenter', (event) => {
      tooltip.show(event, tooltip.formatTooltip(d.neighborhood, [
        ['Investor share', formatPercent(d.investor_share)],
        ['Cash share', formatPercent(d.cash_share)],
        ['Median price', formatCurrency(d.median_price)],
        ['Total sales', d.total_sales.toLocaleString()],
      ]));
    })
    .on('mouseleave', () => tooltip.hide());
  });

  const descEl = document.getElementById('neighborhood-value-desc');
  if (descEl) {
    descEl.textContent = `Strip plot showing ${sorted.length} neighborhoods ranked by investor share. Most affordable (lowest investor activity): ${sorted[0].neighborhood}. Highest investor activity: ${sorted[sorted.length - 1].neighborhood}.`;
  }
}

export function update(data, options = {}) {
  created = false;
  if (svg) svg.selectAll('*').remove();
  create(document.getElementById('neighborhood-value-viz'), data, options);
}

export function highlight(demographic) {}
