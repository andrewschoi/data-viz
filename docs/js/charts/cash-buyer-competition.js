/**
 * cash-buyer-competition.js — Stacked area chart of cash vs financed sales (Screen 6 Owner)
 */
import * as tooltip from '../utils/tooltip.js';
import { getDuration, getCSSVar, formatPercent } from '../utils/scales.js';

let svg, created = false;

export function create(container, data, options = {}) {
  if (created) return;
  created = true;

  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;

  const width = el.clientWidth || 800;
  const height = Math.round(width * 0.55);
  const margin = { top: 55, right: 150, bottom: 50, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  svg = d3.select(el)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);

  svg.selectAll('*').remove();

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, innerWidth]);

  const yMax = Math.max(0.5, d3.max(data, d => Math.max(d.cash_share, d.investor_cash_share)) * 1.15);
  const yScale = d3.scaleLinear()
    .domain([0, yMax])
    .range([innerHeight, 0]);

  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Title
  svg.append('text')
    .attr('x', margin.left)
    .attr('y', 22)
    .attr('font-size', '14px')
    .attr('font-weight', '600')
    .attr('fill', getCSSVar('--color-neutral-800'))
    .text('Cash vs Financed Sales Over Time (No Mortgage Recorded)');

  // Grid
  g.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat('').ticks(5));

  // X axis
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(8));

  // Y axis
  g.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(yScale).tickFormat(d => `${(d * 100).toFixed(0)}%`).ticks(5));

  // Y label
  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', -45)
    .attr('text-anchor', 'middle')
    .attr('font-size', '13px')
    .attr('font-weight', '500')
    .attr('fill', getCSSVar('--color-neutral-600'))
    .text('Share of Sales');

  const duration = getDuration(500);

  // Area for total cash share
  const area = d3.area()
    .x(d => xScale(d.year))
    .y0(innerHeight)
    .y1(d => yScale(d.cash_share))
    .curve(d3.curveMonotoneX);

  g.append('path')
    .datum(data)
    .attr('fill', getCSSVar('--color-cat-2'))
    .attr('opacity', 0.3)
    .attr('d', area);

  // Line for total cash share
  const line = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.cash_share))
    .curve(d3.curveMonotoneX);

  const cashPath = g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', getCSSVar('--color-cat-2'))
    .attr('stroke-width', 2.5)
    .attr('d', line);

  // Line for investor cash share
  const investorLine = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.investor_cash_share))
    .curve(d3.curveMonotoneX);

  g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', getCSSVar('--color-negative'))
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '6 4')
    .attr('d', investorLine);

  // Labels at end
  const lastPoint = data[data.length - 1];
  g.append('text')
    .attr('x', xScale(lastPoint.year) + 6)
    .attr('y', yScale(lastPoint.cash_share) + 4)
    .attr('font-size', '11px')
    .attr('font-weight', '600')
    .attr('fill', getCSSVar('--color-cat-2'))
    .text(`All cash: ${formatPercent(lastPoint.cash_share)}`);

  g.append('text')
    .attr('x', xScale(lastPoint.year) + 6)
    .attr('y', yScale(lastPoint.investor_cash_share) + 4)
    .attr('font-size', '11px')
    .attr('font-weight', '600')
    .attr('fill', getCSSVar('--color-negative'))
    .text(`Investor: ${formatPercent(lastPoint.investor_cash_share)}`);

  // Hover
  const bisect = d3.bisector(d => d.year).left;
  const focus = g.append('g').style('display', 'none');
  focus.append('line')
    .attr('y1', 0).attr('y2', innerHeight)
    .attr('stroke', getCSSVar('--color-neutral-400'))
    .attr('stroke-dasharray', '2 2');

  g.append('rect')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('fill', 'transparent')
    .on('mousemove', function(event) {
      const [mx] = d3.pointer(event);
      const year = Math.round(xScale.invert(mx));
      const idx = bisect(data, year);
      const d = data[Math.min(idx, data.length - 1)];
      if (!d) return;

      focus.style('display', null);
      focus.select('line').attr('x1', xScale(d.year)).attr('x2', xScale(d.year));

      tooltip.show(event, tooltip.formatTooltip(`${d.year}`, [
        ['Total cash share', formatPercent(d.cash_share)],
        ['Investor cash', formatPercent(d.investor_cash_share)],
        ['Non-investor cash', formatPercent(d.noninvestor_cash_share)],
        ['Total sales', d.total_sales.toLocaleString()],
      ]));
    })
    .on('mouseleave', () => {
      focus.style('display', 'none');
      tooltip.hide();
    });

  // Caveat
  g.append('text')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + 40)
    .attr('text-anchor', 'middle')
    .attr('font-size', '10px')
    .attr('fill', getCSSVar('--color-neutral-400'))
    .text('Note: "Cash" = no mortgage recorded. May include non-arm\'s-length transactions.');

  const descEl = document.getElementById('cash-buyer-desc');
  if (descEl) {
    descEl.textContent = `Area chart showing cash purchase share from ${data[0].year} to ${lastPoint.year}. Cash sales were ${formatPercent(lastPoint.cash_share)} of all sales in ${lastPoint.year}.`;
  }
}

export function update(data, options = {}) {
  created = false;
  if (svg) svg.selectAll('*').remove();
  create(document.getElementById('cash-buyer-viz'), data, options);
}

export function highlight(demographic) {}
