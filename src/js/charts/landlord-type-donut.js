/**
 * landlord-type-donut.js — Donut chart of property owner types (Screen 6 Renter)
 */
import * as tooltip from '../utils/tooltip.js';
import { getDuration, getCSSVar, formatPercent, formatNumber } from '../utils/scales.js';

let svg, created = false;

const TYPE_COLORS = {
  'Non-Investor (Owner-Occupied)': '--color-cat-1',
  'Small Investor': '--color-cat-3',
  'Medium Investor': '--color-cat-5',
  'Large Investor': '--color-cat-6',
  'Institutional Investor': '--color-cat-2',
};

export function create(container, data, options = {}) {
  if (created) return;
  created = true;

  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;

  const size = 320;
  const width = size;
  const height = size;
  const radius = size / 2 - 40;
  const innerRadius = radius * 0.55;

  svg = d3.select(el)
    .attr('width', width)
    .attr('height', height + 70)
    .attr('viewBox', `0 0 ${width} ${height + 70}`)
    .style('max-width', `${width}px`)
    .style('margin', '0 auto');

  svg.selectAll('*').remove();

  const g = svg.append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const pie = d3.pie()
    .value(d => d.share)
    .sort(null)
    .padAngle(0.02);

  const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(radius);

  const arcHover = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(radius + 8);

  const duration = getDuration(300);
  const arcs = pie(data);

  arcs.forEach((d, i) => {
    const colorVar = TYPE_COLORS[d.data.type] || '--color-cat-7';
    const color = getCSSVar(colorVar);

    const path = g.append('path')
      .attr('fill', color)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('tabindex', '0')
      .attr('role', 'img')
      .attr('aria-label', `${d.data.type}: ${formatPercent(d.data.share)}`);

    if (duration > 0) {
      path.transition()
        .duration(duration)
        .delay(i * getDuration(50))
        .attrTween('d', function() {
          const interpolate = d3.interpolate({ startAngle: d.startAngle, endAngle: d.startAngle }, d);
          return t => arc(interpolate(t));
        });
    } else {
      path.attr('d', arc(d));
    }

    path.on('mouseenter', function(event) {
      d3.select(this).transition().duration(getDuration(150)).attr('d', arcHover(d));
      tooltip.show(event, tooltip.formatTooltip(d.data.type, [
        ['Share', formatPercent(d.data.share)],
        ['Count', formatNumber(d.data.count)],
      ]));
    })
    .on('mousemove', function(event) {
      tooltip.show(event, tooltip.formatTooltip(d.data.type, [
        ['Share', formatPercent(d.data.share)],
        ['Count', formatNumber(d.data.count)],
      ]));
    })
    .on('mouseleave', function() {
      d3.select(this).transition().duration(getDuration(150)).attr('d', arc(d));
      tooltip.hide();
    })
    .on('focus', function(event) {
      d3.select(this).attr('d', arcHover(d));
      tooltip.show(event, tooltip.formatTooltip(d.data.type, [
        ['Share', formatPercent(d.data.share)],
        ['Count', formatNumber(d.data.count)],
      ]));
    })
    .on('blur', function() {
      d3.select(this).attr('d', arc(d));
      tooltip.hide();
    });
  });

  // Center text
  g.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '-0.3em')
    .attr('font-size', '14px')
    .attr('font-weight', '600')
    .attr('fill', getCSSVar('--color-neutral-800'))
    .text('Owner Types');

  g.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '1.2em')
    .attr('font-size', '12px')
    .attr('fill', getCSSVar('--color-neutral-500'))
    .text('Metro Boston');

  // Legend below
  const legend = svg.append('g')
    .attr('transform', `translate(${width / 2 - 130}, ${height + 12})`);

  data.forEach((d, i) => {
    const colorVar = TYPE_COLORS[d.type] || '--color-cat-7';
    const x = (i % 3) * 100;
    const y = Math.floor(i / 3) * 18;

    legend.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('width', 10)
      .attr('height', 10)
      .attr('rx', 2)
      .attr('fill', getCSSVar(colorVar));

    legend.append('text')
      .attr('x', x + 14)
      .attr('y', y + 9)
      .attr('font-size', '10px')
      .attr('fill', getCSSVar('--color-neutral-600'))
      .text(d.type.replace('Non-Investor (Owner-Occupied)', 'Owner-Occ.').replace(' Investor', ''));
  });

  // Description
  const descEl = document.getElementById('landlord-donut-desc');
  if (descEl) {
    const largest = data.reduce((a, b) => a.share > b.share ? a : b);
    descEl.textContent = `Donut chart showing property owner types in metro Boston. ${largest.type} is the largest category at ${formatPercent(largest.share)}.`;
  }
}

export function update(data, options = {}) {
  created = false;
  if (svg) svg.selectAll('*').remove();
  create(document.getElementById('landlord-donut-viz'), data, options);
}

export function highlight(demographic) {}
