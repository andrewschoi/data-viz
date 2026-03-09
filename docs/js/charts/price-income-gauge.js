/**
 * price-income-gauge.js — Bullet/bar chart showing price-to-income ratio (Screen 6 Owner)
 */
import * as tooltip from '../utils/tooltip.js';
import { getDuration, getCSSVar, getYouColor, formatCurrency } from '../utils/scales.js';

let svg, created = false;

export function create(container, data, options = {}) {
  if (created) return;
  created = true;

  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;

  const width = el.clientWidth || 800;
  const height = Math.round(width * 0.55);
  const margin = { top: 60, right: 30, bottom: 60, left: 120 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  svg = d3.select(el)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);

  svg.selectAll('*').remove();

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.income_bracket))
    .range([0, innerHeight])
    .padding(0.3);

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.price_to_income) * 1.2])
    .range([0, innerWidth]);

  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Title
  svg.append('text')
    .attr('x', margin.left)
    .attr('y', 22)
    .attr('font-size', '14px')
    .attr('font-weight', '600')
    .attr('fill', getCSSVar('--color-neutral-800'))
    .text('Home Price-to-Income Ratio by Income Bracket');

  // Grid
  g.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale).tickSize(-innerHeight).tickFormat('').ticks(6));

  // X axis
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale).tickFormat(d => `${d}x`).ticks(6));

  // X label
  g.append('text')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + 45)
    .attr('text-anchor', 'middle')
    .attr('font-size', '13px')
    .attr('font-weight', '500')
    .attr('fill', getCSSVar('--color-neutral-600'))
    .text('Price-to-Income Ratio');

  // Affordable threshold line
  g.append('line')
    .attr('x1', xScale(3))
    .attr('x2', xScale(3))
    .attr('y1', -10)
    .attr('y2', innerHeight)
    .attr('stroke', getCSSVar('--color-positive'))
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '6 4');

  g.append('text')
    .attr('x', xScale(3) + 6)
    .attr('y', -4)
    .attr('font-size', '10px')
    .attr('fill', getCSSVar('--color-positive'))
    .attr('font-weight', '600')
    .text('"Affordable" (3x)');

  const duration = getDuration(300);

  data.forEach((d, i) => {
    const y = yScale(d.income_bracket);
    const barHeight = yScale.bandwidth();

    // Affordability color
    let color;
    if (d.price_to_income <= 3) color = getCSSVar('--color-positive');
    else if (d.price_to_income <= 5) color = getCSSVar('--color-warning');
    else color = getCSSVar('--color-negative');

    // Y label
    g.append('text')
      .attr('x', -8)
      .attr('y', y + barHeight / 2 + 4)
      .attr('text-anchor', 'end')
      .attr('font-size', '12px')
      .attr('font-weight', '400')
      .attr('fill', getCSSVar('--color-neutral-700'))
      .text(d.income_bracket);

    // Bar
    const bar = g.append('rect')
      .attr('x', 0)
      .attr('y', y)
      .attr('width', 0)
      .attr('height', barHeight)
      .attr('fill', color)
      .attr('rx', 2)
      .attr('tabindex', '0')
      .attr('role', 'img')
      .attr('aria-label', `${d.income_bracket}: price-to-income ratio of ${d.price_to_income}x`);

    bar.transition()
      .duration(duration)
      .delay(i * getDuration(50))
      .attr('width', xScale(d.price_to_income));

    // Value label
    g.append('text')
      .attr('x', xScale(d.price_to_income) + 6)
      .attr('y', y + barHeight / 2 + 4)
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', getCSSVar('--color-neutral-700'))
      .text(`${d.price_to_income}x`)
      .attr('opacity', 0)
      .transition()
      .duration(duration)
      .delay(i * getDuration(50))
      .attr('opacity', 1);

    // Tooltip
    bar.on('mouseenter', (event) => {
      tooltip.show(event, tooltip.formatTooltip(d.income_bracket, [
        ['Price-to-income', `${d.price_to_income}x`],
        ['Median home price', formatCurrency(d.median_price)],
        ['Median income', formatCurrency(d.median_income)],
        ['Breakeven (years)', `${d.breakeven_years} years`],
      ]));
    })
    .on('mouseleave', () => tooltip.hide());
  });

  const descEl = document.getElementById('price-income-desc');
  if (descEl) {
    descEl.textContent = `Bar chart showing price-to-income ratios by income bracket. The "affordable" benchmark of 3x is exceeded by all but the highest income brackets.`;
  }
}

export function update(data, options = {}) {
  created = false;
  if (svg) svg.selectAll('*').remove();
  create(document.getElementById('price-income-viz'), data, options);
}

export function highlight(demographic) {}
