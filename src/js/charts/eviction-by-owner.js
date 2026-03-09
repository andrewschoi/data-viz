/**
 * eviction-by-owner.js — Horizontal bar chart of eviction counts by neighborhood (Screen 6 Renter)
 * Shows estimated corporate vs individual evictions side by side.
 */
import * as tooltip from '../utils/tooltip.js';
import { getDuration, getCSSVar, formatNumber, getYouColor } from '../utils/scales.js';

let svg, created = false;

export function create(container, data, options = {}) {
  if (created) return;
  created = true;

  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;

  // Sort by eviction count descending, take top 15
  const sorted = [...data].sort((a, b) => b.eviction_count - a.eviction_count).slice(0, 15);

  const width = el.clientWidth || 800;
  const barHeight = 24;
  const margin = { top: 30, right: 80, bottom: 30, left: 130 };
  const height = margin.top + margin.bottom + sorted.length * (barHeight + 6);
  const innerWidth = width - margin.left - margin.right;

  svg = d3.select(el)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);

  svg.selectAll('*').remove();

  const maxVal = d3.max(sorted, d => d.eviction_count);
  const xScale = d3.scaleLinear().domain([0, maxVal]).range([0, innerWidth]);

  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Title
  svg.append('text')
    .attr('x', margin.left)
    .attr('y', 18)
    .attr('font-size', '14px')
    .attr('font-weight', '600')
    .attr('fill', getCSSVar('--color-neutral-800'))
    .text('Eviction Filings by Neighborhood (2020-2022)');

  const duration = getDuration(300);
  const corpColor = getCSSVar('--color-cat-2');
  const indivColor = getCSSVar('--color-cat-1');

  sorted.forEach((d, i) => {
    const y = i * (barHeight + 6);
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

    // Estimated corporate evictions bar
    const corpWidth = xScale(d.estimated_corp_evictions || 0);
    g.append('rect')
      .attr('x', 0)
      .attr('y', y)
      .attr('width', 0)
      .attr('height', barHeight)
      .attr('fill', corpColor)
      .attr('rx', 2)
      .transition()
      .duration(duration)
      .delay(i * getDuration(20))
      .attr('width', corpWidth);

    // Individual evictions bar (stacked after corporate)
    const indivWidth = xScale(d.estimated_individual_evictions || 0);
    g.append('rect')
      .attr('x', corpWidth)
      .attr('y', y)
      .attr('width', 0)
      .attr('height', barHeight)
      .attr('fill', indivColor)
      .attr('rx', 2)
      .attr('opacity', 0.7)
      .transition()
      .duration(duration)
      .delay(i * getDuration(20))
      .attr('width', indivWidth);

    // Value label
    g.append('text')
      .attr('x', xScale(d.eviction_count) + 6)
      .attr('y', y + barHeight / 2 + 4)
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('fill', getCSSVar('--color-neutral-600'))
      .text(formatNumber(d.eviction_count))
      .attr('opacity', 0)
      .transition()
      .duration(duration)
      .delay(i * getDuration(20))
      .attr('opacity', 1);

    // User highlight
    if (isUser) {
      g.append('rect')
        .attr('x', -4)
        .attr('y', y - 3)
        .attr('width', xScale(d.eviction_count) + 8)
        .attr('height', barHeight + 6)
        .attr('fill', 'none')
        .attr('stroke', getYouColor())
        .attr('stroke-width', 2)
        .attr('rx', 4);
    }

    // Tooltip area
    const hoverRect = g.append('rect')
      .attr('x', 0)
      .attr('y', y)
      .attr('width', innerWidth)
      .attr('height', barHeight)
      .attr('fill', 'transparent')
      .attr('cursor', 'pointer');

    hoverRect.on('mouseenter', (event) => {
      tooltip.show(event, tooltip.formatTooltip(d.neighborhood, [
        ['Total evictions', formatNumber(d.eviction_count)],
        ['Est. corporate', formatNumber(d.estimated_corp_evictions)],
        ['Est. individual', formatNumber(d.estimated_individual_evictions)],
        ['Corp ownership rate', `${(d.corp_own_rate * 100).toFixed(0)}%`],
      ]));
    })
    .on('mouseleave', () => tooltip.hide());
  });

  // Legend
  const legendG = g.append('g').attr('transform', `translate(${innerWidth - 200}, ${-15})`);
  legendG.append('rect').attr('width', 10).attr('height', 10).attr('rx', 2).attr('fill', corpColor);
  legendG.append('text').attr('x', 14).attr('y', 9).attr('font-size', '10px').attr('fill', getCSSVar('--color-neutral-600')).text('Est. Corporate');
  legendG.append('rect').attr('x', 110).attr('width', 10).attr('height', 10).attr('rx', 2).attr('fill', indivColor).attr('opacity', 0.7);
  legendG.append('text').attr('x', 124).attr('y', 9).attr('font-size', '10px').attr('fill', getCSSVar('--color-neutral-600')).text('Est. Individual');

  // Description
  const descEl = document.getElementById('eviction-by-owner-desc');
  if (descEl) {
    descEl.textContent = `Horizontal stacked bar chart showing eviction filings by neighborhood. ${sorted[0].neighborhood} has the most filings at ${formatNumber(sorted[0].eviction_count)}.`;
  }
}

export function update(data, options = {}) {
  created = false;
  if (svg) svg.selectAll('*').remove();
  create(document.getElementById('eviction-by-owner-viz'), data, options);
}

export function highlight(demographic) {}
