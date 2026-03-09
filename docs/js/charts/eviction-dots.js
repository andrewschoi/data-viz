/**
 * eviction-dots.js — Scatter plot: Corporate Ownership vs. Eviction Filing Rates (Screen 5)
 * Each dot is a census tract, colored by majority race, with a trend line.
 */
import * as tooltip from '../utils/tooltip.js';
import { getDuration, getYouColor, getCSSVar, formatPercent, formatNumber } from '../utils/scales.js';

let svg, created = false;

/** Determine majority race category from demographic population fields */
function getMajorityRace(d) {
  const groups = [
    { key: 'White', pop: d.nhwhi || 0 },
    { key: 'Black', pop: d.nhaa || 0 },
    { key: 'Asian', pop: d.nhas || 0 },
    { key: 'Hispanic/Latino', pop: d.lat || 0 },
  ];
  const total = groups.reduce((s, g) => s + g.pop, 0);
  if (total === 0) return 'Other/Multiracial';
  const top = groups.reduce((a, b) => (a.pop > b.pop ? a : b));
  // "Majority" = plurality (largest share)
  return top.key;
}

/** Race → CSS variable mapping */
const RACE_CSS = {
  'White': '--color-cat-1',
  'Black': '--color-cat-2',
  'Hispanic/Latino': '--color-cat-3',
  'Asian': '--color-cat-4',
  'Other/Multiracial': '--color-cat-5',
};

/** Simple linear regression: returns { slope, intercept } */
function linearRegression(points) {
  const n = points.length;
  if (n < 2) return null;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumX2 += p.x * p.x;
  }
  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return null;
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export function create(container, data, options = {}) {
  if (created) return;
  created = true;

  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;

  // Filter out nulls/zeros and extreme outliers
  const filtered = data.filter(d =>
    d.eviction_rate != null && d.eviction_rate > 0 && d.eviction_rate < 200 &&
    d.corp_own_rate != null
  );

  // Assign race to each tract
  filtered.forEach(d => { d._race = getMajorityRace(d); });

  const width = el.clientWidth || 800;
  const height = Math.round(width * 0.55);
  const margin = { top: 36, right: 30, bottom: 56, left: 70 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  svg = d3.select(el)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);

  svg.selectAll('*').remove();

  // Scales
  const xMax = d3.quantile(filtered.map(d => d.corp_own_rate).sort(d3.ascending), 0.98) || 0.5;
  const yMax = d3.quantile(filtered.map(d => d.eviction_rate).sort(d3.ascending), 0.95) || 50;

  const xScale = d3.scaleLinear()
    .domain([0, Math.min(xMax * 1.05, 1)])
    .range([0, innerWidth])
    .clamp(true);

  const yScale = d3.scaleLinear()
    .domain([0, yMax * 1.1])
    .range([innerHeight, 0])
    .clamp(true);

  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Gridlines
  g.append('g')
    .attr('class', 'grid')
    .selectAll('line')
    .data(yScale.ticks(6))
    .join('line')
    .attr('x1', 0)
    .attr('x2', innerWidth)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d))
    .attr('stroke', getCSSVar('--color-neutral-200') || '#e5e5e5')
    .attr('stroke-width', 0.5);

  // X axis
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale).ticks(6).tickFormat(d => `${(d * 100).toFixed(0)}%`));

  // Y axis
  g.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(yScale).ticks(6).tickFormat(d => d.toFixed(0)));

  // X label
  g.append('text')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + 44)
    .attr('text-anchor', 'middle')
    .attr('font-size', '13px')
    .attr('font-weight', '500')
    .attr('fill', getCSSVar('--color-neutral-600'))
    .text('Corporate Ownership Rate');

  // Y label
  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', -52)
    .attr('text-anchor', 'middle')
    .attr('font-size', '13px')
    .attr('font-weight', '500')
    .attr('fill', getCSSVar('--color-neutral-600'))
    .text('Eviction Filing Rate (per 1,000 renters)');

  // Title
  g.append('text')
    .attr('x', 0)
    .attr('y', -14)
    .attr('font-size', '14px')
    .attr('font-weight', '600')
    .attr('fill', getCSSVar('--color-neutral-800'))
    .text('Corporate Ownership vs. Eviction Rates');

  // --- Trend line ---
  const regressionPoints = filtered
    .filter(d => d.corp_own_rate > 0)
    .map(d => ({ x: d.corp_own_rate, y: d.eviction_rate }));
  const reg = linearRegression(regressionPoints);
  if (reg) {
    const x0 = xScale.domain()[0];
    const x1 = xScale.domain()[1];
    const y0 = reg.slope * x0 + reg.intercept;
    const y1 = reg.slope * x1 + reg.intercept;
    g.append('line')
      .attr('x1', xScale(x0))
      .attr('y1', yScale(Math.max(0, y0)))
      .attr('x2', xScale(x1))
      .attr('y2', yScale(Math.max(0, y1)))
      .attr('stroke', getCSSVar('--color-neutral-700') || '#444')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '8 4')
      .attr('opacity', 0.7);

    // Trend label
    g.append('text')
      .attr('x', xScale(x1) - 4)
      .attr('y', yScale(Math.max(0, y1)) - 8)
      .attr('text-anchor', 'end')
      .attr('font-size', '11px')
      .attr('font-style', 'italic')
      .attr('fill', getCSSVar('--color-neutral-600'))
      .text('Trend');
  }

  // --- Median reference line (horizontal, for eviction rate) ---
  const medianEviction = d3.median(filtered, d => d.eviction_rate);
  if (medianEviction !== undefined) {
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(medianEviction))
      .attr('y2', yScale(medianEviction))
      .attr('stroke', getCSSVar('--color-neutral-500') || '#888')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 3')
      .attr('opacity', 0.6);

    g.append('text')
      .attr('x', innerWidth - 4)
      .attr('y', yScale(medianEviction) - 6)
      .attr('text-anchor', 'end')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', getCSSVar('--color-neutral-600'))
      .text(`Median: ${medianEviction.toFixed(1)}`);
  }

  // --- Dots ---
  const duration = getDuration(300);

  filtered.forEach((d, i) => {
    const cx = xScale(d.corp_own_rate);
    const cy = yScale(d.eviction_rate);
    const raceVar = RACE_CSS[d._race] || '--color-cat-5';
    const color = getCSSVar(raceVar) || '#999';

    const dot = g.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', 0)
      .attr('fill', color)
      .attr('opacity', 0.55)
      .attr('stroke', color)
      .attr('stroke-width', 0.5)
      .attr('stroke-opacity', 0.3)
      .attr('data-race', d._race)
      .attr('data-geoid', d.GEOID)
      .attr('tabindex', '0')
      .attr('role', 'img')
      .attr('aria-label', `Tract ${d.GEOID}: corporate ownership ${(d.corp_own_rate * 100).toFixed(1)}%, eviction rate ${d.eviction_rate.toFixed(1)} per 1,000, majority ${d._race}`);

    dot.transition()
      .duration(duration)
      .delay(i * getDuration(3))
      .attr('r', 5);

    dot.on('mouseenter', (event) => {
      d3.select(event.target).attr('r', 8).attr('opacity', 0.95);
      tooltip.show(event, tooltip.formatTooltip(`Census Tract`, [
        ['Majority race', d._race],
        ['Eviction rate', `${d.eviction_rate.toFixed(1)} per 1,000`],
        ['Total evictions', formatNumber(d.total_evictions)],
        ['Corp ownership', formatPercent(d.corp_own_rate)],
        ['Median income', `$${formatNumber(d.mhi)}`],
        ['Population', formatNumber(d.pop)],
      ]));
    })
    .on('mouseleave', (event) => {
      d3.select(event.target).attr('r', 5).attr('opacity', 0.55);
      tooltip.hide();
    });
  });

  // --- Legend ---
  const legendRaces = ['White', 'Black', 'Hispanic/Latino', 'Asian'];
  const legendG = g.append('g')
    .attr('transform', `translate(${innerWidth - 150}, ${4})`);

  legendG.append('rect')
    .attr('x', -8)
    .attr('y', -10)
    .attr('width', 158)
    .attr('height', legendRaces.length * 18 + 12)
    .attr('rx', 4)
    .attr('fill', 'white')
    .attr('opacity', 0.85)
    .attr('stroke', getCSSVar('--color-neutral-200') || '#e5e5e5')
    .attr('stroke-width', 1);

  legendRaces.forEach((race, i) => {
    const row = legendG.append('g')
      .attr('transform', `translate(0, ${i * 18})`);

    row.append('circle')
      .attr('cx', 4)
      .attr('cy', 4)
      .attr('r', 5)
      .attr('fill', getCSSVar(RACE_CSS[race]) || '#999')
      .attr('opacity', 0.7);

    row.append('text')
      .attr('x', 16)
      .attr('y', 8)
      .attr('font-size', '11px')
      .attr('fill', getCSSVar('--color-neutral-700'))
      .text(race);
  });

  // --- Accessible description ---
  const descEl = document.getElementById('eviction-dots-desc');
  if (descEl) {
    descEl.textContent = `Scatter plot of ${filtered.length} census tracts showing corporate ownership rate (x-axis) versus eviction filing rate per 1,000 renters (y-axis). Dots are colored by the tract's plurality racial group. ${reg ? `The trend line shows a ${reg.slope > 0 ? 'positive' : 'negative'} correlation.` : ''} Median eviction rate: ${medianEviction ? medianEviction.toFixed(1) : 'N/A'}.`;
  }
}

export function update(data, options = {}) {
  created = false;
  if (svg) svg.selectAll('*').remove();
  create(document.getElementById('eviction-dots-viz'), data, options);
}

export function highlight(demographic) {
  if (!svg || !demographic) return;
  const race = demographic.race;
  if (!race) return;

  // Dim all dots, then highlight matching race
  svg.selectAll('circle[data-race]')
    .transition()
    .duration(getDuration(200))
    .attr('opacity', function () {
      return d3.select(this).attr('data-race') === race ? 0.85 : 0.12;
    })
    .attr('r', function () {
      return d3.select(this).attr('data-race') === race ? 6 : 3;
    });
}
