/**
 * choropleth.js — Neighborhood-level investor activity map for Screen 3
 * Uses D3 to render a bar-chart-style neighborhood comparison since we use
 * neighborhood-level data (not census tract GeoJSON).
 * Falls back to a horizontal bar chart showing investor rates by neighborhood.
 */
import * as tooltip from '../utils/tooltip.js';
import { getDuration, getSequentialColors, getYouColor, formatPercent, formatCurrency, getCSSVar } from '../utils/scales.js';

let svg, created = false;
let cachedData = null, cachedOptions = {};

const TYPE_LABELS = {
  all: 'Corporate Ownership Rate by Neighborhood (2024)',
  institutional: 'Institutional Investor Ownership by Neighborhood',
  large: 'Large Investor Ownership by Neighborhood',
  small: 'Small Investor Ownership by Neighborhood',
};

const TYPE_FIELDS = {
  all: 'corp_own_rate',
  institutional: 'inst_rate',
  large: 'large_rate',
  small: 'small_rate',
};

export function create(container, data, options = {}) {
  cachedData = data;
  cachedOptions = options;
  created = true;

  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;

  // We have neighborhood-level data, so we render a horizontal bar chart
  // sorted by investor share (highest at top)
  const investorType = options.investorType || 'all';
  const rateField = TYPE_FIELDS[investorType] || 'corp_own_rate';
  const sorted = [...data].sort((a, b) => (b[rateField] || 0) - (a[rateField] || 0));

  const width = el.clientWidth || 800;
  const barHeight = 32;
  const margin = { top: 44, right: 80, bottom: 30, left: 180 };
  const height = margin.top + margin.bottom + sorted.length * (barHeight + 4);

  svg = d3.select(el)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);

  svg.selectAll('*').remove();

  // Add title
  svg.append('text')
    .attr('x', margin.left)
    .attr('y', 20)
    .attr('font-size', '14px')
    .attr('font-weight', '600')
    .attr('fill', getCSSVar('--color-neutral-800'))
    .text(TYPE_LABELS[investorType] || TYPE_LABELS.all);

  const innerWidth = width - margin.left - margin.right;

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(sorted, d => d[rateField] || 0)])
    .range([0, innerWidth]);

  const seqColors = getSequentialColors();

  const colorScale = d3.scaleQuantile()
    .domain(sorted.map(d => d[rateField] || 0))
    .range(seqColors);

  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
  const duration = getDuration(300);

  sorted.forEach((d, i) => {
    const rate = d[rateField] || 0;
    const y = i * (barHeight + 4);
    const isUser = options.userNeighborhood === d.Neighborhood;

    // Label
    g.append('text')
      .attr('x', -8)
      .attr('y', y + barHeight / 2 + 4)
      .attr('text-anchor', 'end')
      .attr('font-size', '13px')
      .attr('font-weight', isUser ? '700' : '400')
      .attr('fill', isUser ? getYouColor() : getCSSVar('--color-neutral-600'))
      .text(d.Neighborhood);

    // Bar
    const bar = g.append('rect')
      .attr('x', 0)
      .attr('y', y)
      .attr('width', 0)
      .attr('height', barHeight)
      .attr('fill', isUser ? getYouColor() : colorScale(rate))
      .attr('rx', 2)
      .attr('tabindex', '0')
      .attr('role', 'img')
      .attr('aria-label', `${d.Neighborhood}: ${formatPercent(rate)} investor ownership rate`);

    bar.transition()
      .duration(duration)
      .delay(i * getDuration(30))
      .attr('width', xScale(rate));

    // User highlight stroke
    if (isUser) {
      g.append('rect')
        .attr('x', -2)
        .attr('y', y - 2)
        .attr('width', xScale(rate) + 4)
        .attr('height', barHeight + 4)
        .attr('fill', 'none')
        .attr('stroke', getYouColor())
        .attr('stroke-width', 2)
        .attr('rx', 4)
        .attr('opacity', 0)
        .transition()
        .duration(duration)
        .delay(i * getDuration(30))
        .attr('opacity', 1);
    }

    // Value label
    g.append('text')
      .attr('x', xScale(rate) + 6)
      .attr('y', y + barHeight / 2 + 4)
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('fill', getCSSVar('--color-neutral-600'))
      .text(formatPercent(rate, 0))
      .attr('opacity', 0)
      .transition()
      .duration(duration)
      .delay(i * getDuration(30))
      .attr('opacity', 1);

    // Tooltip interactions
    const tooltipContent = (event) => {
      tooltip.show(event, tooltip.formatTooltip(d.Neighborhood, [
        ['All corporate ownership', formatPercent(d.corp_own_rate, 1)],
        ['Institutional', formatPercent(d.inst_rate || 0, 1)],
        ['Large investors', formatPercent(d.large_rate || 0, 1)],
        ['Small investors', formatPercent(d.small_rate || 0, 1)],
        ['Owner-occupied', formatPercent(d.own_occ_rate, 1)],
      ]));
    };
    bar.on('mouseenter', tooltipContent)
    .on('mousemove', tooltipContent)
    .on('mouseleave', () => tooltip.hide())
    .on('focus', tooltipContent)
    .on('blur', () => tooltip.hide());
  });

  // Update description
  const descEl = document.getElementById('choropleth-desc');
  if (descEl) {
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];
    descEl.textContent = `Bar chart showing investor ownership rates across ${sorted.length} Boston neighborhoods. Highest: ${highest.Neighborhood} at ${formatPercent(highest[rateField])}. Lowest: ${lowest.Neighborhood} at ${formatPercent(lowest[rateField])}.`;
  }

  // Legend
  const legendEl = document.getElementById('choropleth-legend');
  if (legendEl) {
    legendEl.innerHTML = '';
    const labels = ['Low', '', '', 'Medium', '', '', 'High'];
    seqColors.forEach((color, i) => {
      const item = document.createElement('span');
      item.className = 'chart-legend__item';
      item.innerHTML = `<span class="chart-legend__swatch" style="background:${color}"></span>${labels[i]}`;
      legendEl.appendChild(item);
    });
  }
}

export function update(data, options = {}) {
  created = false;
  if (svg) svg.selectAll('*').remove();
  create(document.getElementById('choropleth-viz'), data, options);
}

/** Switch investor type and re-render */
export function setType(investorType) {
  if (!cachedData) return;
  const newOptions = { ...cachedOptions, investorType };
  update(cachedData, newOptions);
}

export function highlight(demographic) {
  if (!demographic.neighborhood) return;
  // Update user stats panel
  const statsEl = document.getElementById('map-user-stats');
  const nameEl = document.getElementById('map-user-neighborhood');
  if (nameEl) nameEl.textContent = demographic.neighborhood;

  // We can provide stats if we have neighborhood data
  if (statsEl) {
    statsEl.textContent = 'See your neighborhood highlighted in the chart above.';
  }
}
