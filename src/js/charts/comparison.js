/**
 * comparison.js — Slope/dumbbell chart for Screen 7 (The Other Side)
 * Shows before/after corporate ownership and owner-occupancy changes.
 */
import * as tooltip from '../utils/tooltip.js';
import { getDuration, getCSSVar, getYouColor, formatPercent } from '../utils/scales.js';

let svg, created = false;

export function create(container, data, options = {}) {
  if (created) return;
  created = true;

  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;

  // Use neighborhood change data
  const sorted = [...data].sort((a, b) => b.corp_change - a.corp_change);

  const width = el.clientWidth || 800;
  const height = Math.max(500, sorted.length * 22 + 120);
  const margin = { top: 70, right: 100, bottom: 40, left: 140 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  svg = d3.select(el)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);

  svg.selectAll('*').remove();

  const yScale = d3.scaleBand()
    .domain(sorted.map(d => d.neighborhood))
    .range([0, innerHeight])
    .padding(0.35);

  const xScale = d3.scaleLinear()
    .domain([0, Math.max(d3.max(sorted, d => Math.max(d.corp_rate_early, d.corp_rate_late)), 0.4)])
    .range([0, innerWidth]);

  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Title
  svg.append('text')
    .attr('x', margin.left)
    .attr('y', 28)
    .attr('font-size', '14px')
    .attr('font-weight', '600')
    .attr('fill', getCSSVar('--color-neutral-800'))
    .text('Corporate Ownership Change by Neighborhood (2004 vs 2024)');

  // Column headers — positioned just above chart area
  g.append('text')
    .attr('x', xScale(0)).attr('y', -8)
    .attr('font-size', '12px').attr('font-weight', '600')
    .attr('fill', getCSSVar('--color-neutral-500'))
    .text('2004');

  g.append('text')
    .attr('x', innerWidth).attr('y', -8)
    .attr('text-anchor', 'end')
    .attr('font-size', '12px').attr('font-weight', '600')
    .attr('fill', getCSSVar('--color-neutral-500'))
    .text('2024');

  // X axis
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale).tickFormat(d => `${(d * 100).toFixed(0)}%`).ticks(8))
    .selectAll('text')
    .attr('font-size', '12px');

  const duration = getDuration(300);

  sorted.forEach((d, i) => {
    const y = yScale(d.neighborhood) + yScale.bandwidth() / 2;
    const isUser = options.userNeighborhood === d.neighborhood;
    const increased = d.corp_change > 0;

    // Label
    g.append('text')
      .attr('x', -8)
      .attr('y', y + 4)
      .attr('text-anchor', 'end')
      .attr('font-size', '12px')
      .attr('font-weight', isUser ? '700' : '400')
      .attr('fill', isUser ? getYouColor() : getCSSVar('--color-neutral-600'))
      .text(d.neighborhood);

    // Connecting line
    const lineColor = increased ? getCSSVar('--color-negative') : getCSSVar('--color-positive');
    g.append('line')
      .attr('x1', xScale(d.corp_rate_early))
      .attr('x2', xScale(d.corp_rate_early))
      .attr('y1', y)
      .attr('y2', y)
      .attr('stroke', isUser ? getYouColor() : lineColor)
      .attr('stroke-width', isUser ? 3 : 2)
      .attr('opacity', 0.6)
      .transition()
      .duration(duration)
      .delay(i * getDuration(30))
      .attr('x2', xScale(d.corp_rate_late));

    // Early dot
    g.append('circle')
      .attr('cx', xScale(d.corp_rate_early))
      .attr('cy', y)
      .attr('r', isUser ? 6 : 4)
      .attr('fill', 'white')
      .attr('stroke', isUser ? getYouColor() : lineColor)
      .attr('stroke-width', 2);

    // Late dot
    const lateDot = g.append('circle')
      .attr('cx', xScale(d.corp_rate_early))
      .attr('cy', y)
      .attr('r', isUser ? 7 : 5)
      .attr('fill', isUser ? getYouColor() : lineColor)
      .attr('tabindex', '0')
      .attr('role', 'img')
      .attr('aria-label', `${d.neighborhood}: corporate ownership ${formatPercent(d.corp_rate_early)} to ${formatPercent(d.corp_rate_late)}`);

    lateDot.transition()
      .duration(duration)
      .delay(i * getDuration(30))
      .attr('cx', xScale(d.corp_rate_late));

    // Change label
    const changeText = `${d.corp_change > 0 ? '+' : ''}${(d.corp_change * 100).toFixed(0)}pp`;
    g.append('text')
      .attr('x', xScale(d.corp_rate_late) + 8)
      .attr('y', y + 4)
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', increased ? getCSSVar('--color-negative') : getCSSVar('--color-positive'))
      .text(changeText)
      .attr('opacity', 0)
      .transition()
      .duration(duration)
      .delay(i * getDuration(30))
      .attr('opacity', 1);

    // Tooltip
    lateDot.on('mouseenter', (event) => {
      tooltip.show(event, tooltip.formatTooltip(d.neighborhood, [
        ['Corp. ownership 2004', formatPercent(d.corp_rate_early)],
        ['Corp. ownership 2024', formatPercent(d.corp_rate_late)],
        ['Change', `${changeText}`],
        ['Owner-occ. change', `${(d.occ_change * 100).toFixed(1)}pp`],
      ]));
    })
    .on('mouseleave', () => tooltip.hide());
  });

  const descEl = document.getElementById('comparison-desc');
  if (descEl) {
    const biggestIncrease = sorted[0];
    descEl.textContent = `Dumbbell chart showing corporate ownership changes in ${sorted.length} neighborhoods from 2004 to 2024. Largest increase: ${biggestIncrease.neighborhood} (+${(biggestIncrease.corp_change * 100).toFixed(0)} percentage points).`;
  }
}

export function update(data, options = {}) {
  created = false;
  if (svg) svg.selectAll('*').remove();
  create(document.getElementById('comparison-viz'), data, options);
}

export function highlight(demographic) {
  const el = document.getElementById('other-personalized');
  if (!el || !demographic.neighborhood) return;
  el.innerHTML = `<p>In <strong>${demographic.neighborhood}</strong>, see how corporate ownership has changed compared to other neighborhoods. The chart shows the shift from 2004 to 2024.</p>`;
}
