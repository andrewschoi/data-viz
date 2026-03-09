/**
 * eviction-dots.js — Dot/strip chart showing eviction filing rates by census tract (Screen 5)
 */
import * as tooltip from '../utils/tooltip.js';
import { getDuration, getYouColor, getCSSVar, formatPercent, formatNumber } from '../utils/scales.js';

let svg, created = false;

export function create(container, data, options = {}) {
  if (created) return;
  created = true;

  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;

  // Filter out extreme outliers and nulls
  const filtered = data.filter(d => d.eviction_rate != null && d.eviction_rate < 200 && d.eviction_rate > 0);

  const width = el.clientWidth || 800;
  const height = Math.round(width * 0.35);
  const margin = { top: 30, right: 30, bottom: 50, left: 70 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  svg = d3.select(el)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);

  svg.selectAll('*').remove();

  const xScale = d3.scaleLinear()
    .domain([0, d3.quantile(filtered.map(d => d.eviction_rate).sort(d3.ascending), 0.95)])
    .range([0, innerWidth]);

  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  // X axis
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale).ticks(8).tickFormat(d => d.toFixed(0)));

  // X label
  g.append('text')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + 40)
    .attr('text-anchor', 'middle')
    .attr('font-size', '13px')
    .attr('font-weight', '500')
    .attr('fill', getCSSVar('--color-neutral-600'))
    .text('Eviction Filing Rate (per 1,000 renters)');

  // Title
  g.append('text')
    .attr('x', 0)
    .attr('y', -12)
    .attr('font-size', '14px')
    .attr('font-weight', '600')
    .attr('fill', getCSSVar('--color-neutral-800'))
    .text('Eviction Filing Rates by Census Tract');

  const duration = getDuration(300);
  const jitter = innerHeight * 0.6;
  const centerY = innerHeight / 2;

  // Dots
  filtered.forEach((d, i) => {
    const x = xScale(Math.min(d.eviction_rate, xScale.domain()[1]));
    const y = centerY + (Math.random() - 0.5) * jitter;

    const dot = g.append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', 0)
      .attr('fill', getCSSVar('--color-neutral-400'))
      .attr('opacity', 0.4)
      .attr('tabindex', '0')
      .attr('role', 'img')
      .attr('aria-label', `Tract: eviction rate ${d.eviction_rate.toFixed(1)} per 1,000`);

    dot.transition()
      .duration(duration)
      .delay(Math.random() * getDuration(400))
      .attr('r', 4);

    dot.on('mouseenter', (event) => {
      d3.select(event.target).attr('r', 7).attr('opacity', 0.9);
      tooltip.show(event, tooltip.formatTooltip(`Census Tract`, [
        ['Eviction rate', `${d.eviction_rate.toFixed(1)} per 1,000`],
        ['Total evictions', formatNumber(d.total_evictions)],
        ['Corp ownership', formatPercent(d.corp_own_rate)],
        ['Median income', `$${formatNumber(d.mhi)}`],
      ]));
    })
    .on('mouseleave', (event) => {
      d3.select(event.target).attr('r', 4).attr('opacity', 0.4);
      tooltip.hide();
    });
  });

  // Median line
  const median = d3.median(filtered, d => d.eviction_rate);
  if (median !== undefined) {
    g.append('line')
      .attr('x1', xScale(median))
      .attr('x2', xScale(median))
      .attr('y1', centerY - jitter / 2 - 10)
      .attr('y2', centerY + jitter / 2 + 10)
      .attr('stroke', getCSSVar('--color-neutral-700'))
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 4');

    g.append('text')
      .attr('x', xScale(median) + 6)
      .attr('y', centerY - jitter / 2 - 15)
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', getCSSVar('--color-neutral-700'))
      .text(`Median: ${median.toFixed(1)}`);
  }

  // Description
  const descEl = document.getElementById('eviction-dots-desc');
  if (descEl) {
    descEl.textContent = `Dot plot showing eviction filing rates across ${filtered.length} census tracts. Rates range from ${d3.min(filtered, d => d.eviction_rate).toFixed(1)} to ${d3.max(filtered, d => d.eviction_rate).toFixed(1)} per 1,000 renters. Median rate: ${median ? median.toFixed(1) : 'N/A'}.`;
  }
}

export function update(data, options = {}) {
  created = false;
  if (svg) svg.selectAll('*').remove();
  create(document.getElementById('eviction-dots-viz'), data, options);
}

export function highlight(demographic) {
  // Highlighting individual tracts would require geocoding the user's neighborhood
  // For now, the dot cloud provides distributional context
}
