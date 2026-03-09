/**
 * demographic-bars.js — Grouped bar chart for Screen 5 (Who Gets Hurt)
 * Shows investor purchase share by income bracket and race.
 */
import * as tooltip from '../utils/tooltip.js';
import { getDuration, getYouColor, getCSSVar, formatPercent, formatNumber } from '../utils/scales.js';

let svg, created = false;

export function create(container, data, options = {}) {
  if (created) return;
  created = true;

  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;

  const width = el.clientWidth || 800;
  const height = Math.round(width * 0.55);
  const margin = { top: 40, right: 30, bottom: 110, left: 70 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  svg = d3.select(el)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);

  svg.selectAll('*').remove();

  // Separate income and race data
  const incomeData = data.filter(d => d.category === 'income');
  const raceData = data.filter(d => d.category === 'race');

  // Abbreviate long labels for the x-axis
  const labelMap = {
    'Q1 (Lowest)': 'Q1 (Lowest)',
    'Q2': 'Q2',
    'Q3': 'Q3',
    'Q4': 'Q4',
    'Q5 (Highest)': 'Q5 (Highest)',
    'Majority White': 'White',
    'Majority Black': 'Black',
    'Majority Asian': 'Asian',
    'Majority Hispanic': 'Hispanic',
    'Mixed/No Majority': 'Mixed',
    'No Majority': 'No Majority',
    'Unknown': 'Unknown',
  };

  // Combine into a single bar chart
  const allGroups = [...incomeData, ...raceData];
  allGroups.forEach(d => { d.shortLabel = labelMap[d.group] || d.group; });
  const groups = allGroups.map(d => d.shortLabel);

  const xScale = d3.scaleBand()
    .domain(groups)
    .range([0, innerWidth])
    .padding(0.25);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(allGroups, d => d.investor_share) * 1.15])
    .range([innerHeight, 0]);

  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Grid
  g.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat('').ticks(5));

  // X axis — rotated labels for readability
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .attr('text-anchor', 'end')
    .attr('dx', '-0.5em')
    .attr('dy', '0.25em')
    .attr('font-size', '12px');

  // Y axis
  g.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(yScale).tickFormat(d => `${(d * 100).toFixed(0)}%`).ticks(5));

  // Y label
  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', -55)
    .attr('text-anchor', 'middle')
    .attr('font-size', '13px')
    .attr('font-weight', '500')
    .attr('fill', getCSSVar('--color-neutral-600'))
    .text('Investor Purchase Share');

  // Category separator
  const raceStartIdx = incomeData.length;
  if (raceStartIdx > 0 && raceData.length > 0) {
    const sepX = (xScale(incomeData[incomeData.length - 1].shortLabel) + xScale.bandwidth() +
                  xScale(raceData[0].shortLabel)) / 2;
    g.append('line')
      .attr('x1', sepX).attr('x2', sepX)
      .attr('y1', -10).attr('y2', innerHeight + 10)
      .attr('stroke', getCSSVar('--color-neutral-300'))
      .attr('stroke-dasharray', '4 4');

    // Category labels
    g.append('text')
      .attr('x', xScale(incomeData[Math.floor(incomeData.length / 2)].shortLabel) + xScale.bandwidth() / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', getCSSVar('--color-neutral-500'))
      .text('BY INCOME');

    g.append('text')
      .attr('x', xScale(raceData[Math.floor(raceData.length / 2)].shortLabel) + xScale.bandwidth() / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', getCSSVar('--color-neutral-500'))
      .text('BY RACE');
  }

  // Color mapping
  const incomeColors = [
    getCSSVar('--color-cat-6'),
    getCSSVar('--color-cat-7'),
    getCSSVar('--color-cat-1'),
    getCSSVar('--color-cat-4'),
    getCSSVar('--color-cat-5'),
  ];

  const raceColors = {
    'White': getCSSVar('--color-cat-1'),
    'Black': getCSSVar('--color-cat-2'),
    'Hispanic': getCSSVar('--color-cat-3'),
    'Asian': getCSSVar('--color-cat-4'),
    'Mixed': getCSSVar('--color-cat-5'),
    'No Majority': getCSSVar('--color-cat-5'),
    'Unknown': getCSSVar('--color-cat-7'),
  };

  const duration = getDuration(300);
  const stagger = getDuration(30);

  // Bars
  allGroups.forEach((d, i) => {
    let fillColor;
    if (d.category === 'income') {
      fillColor = incomeColors[i % incomeColors.length];
    } else {
      fillColor = raceColors[d.shortLabel] || getCSSVar('--color-cat-7');
    }

    const bar = g.append('rect')
      .attr('x', xScale(d.shortLabel))
      .attr('y', innerHeight)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', fillColor)
      .attr('rx', 2)
      .attr('tabindex', '0')
      .attr('role', 'img')
      .attr('aria-label', `${d.group}: ${formatPercent(d.investor_share)} investor purchase share`);

    bar.transition()
      .duration(duration)
      .delay(i * stagger)
      .attr('y', yScale(d.investor_share))
      .attr('height', innerHeight - yScale(d.investor_share));

    // Value label
    g.append('text')
      .attr('x', xScale(d.shortLabel) + xScale.bandwidth() / 2)
      .attr('y', yScale(d.investor_share) - 6)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', getCSSVar('--color-neutral-700'))
      .text(formatPercent(d.investor_share, 1))
      .attr('opacity', 0)
      .transition()
      .duration(duration)
      .delay(i * stagger)
      .attr('opacity', 1);

    // Tooltip
    bar.on('mouseenter', (event) => {
      tooltip.show(event, tooltip.formatTooltip(d.group, [
        ['Investor share', formatPercent(d.investor_share, 1)],
        ['Total investor purchases', formatNumber(d.total_investor)],
        ['Total sales', formatNumber(d.total_sales)],
      ]));
    })
    .on('mousemove', (event) => {
      tooltip.show(event, tooltip.formatTooltip(d.group, [
        ['Investor share', formatPercent(d.investor_share, 1)],
        ['Total investor purchases', formatNumber(d.total_investor)],
        ['Total sales', formatNumber(d.total_sales)],
      ]));
    })
    .on('mouseleave', () => tooltip.hide())
    .on('focus', function(event) {
      tooltip.show(event, tooltip.formatTooltip(d.group, [
        ['Investor share', formatPercent(d.investor_share, 1)],
        ['Total investor purchases', formatNumber(d.total_investor)],
        ['Total sales', formatNumber(d.total_sales)],
      ]));
    })
    .on('blur', () => tooltip.hide());
  });

  // Description
  const descEl = document.getElementById('demographic-bars-desc');
  if (descEl) {
    const maxGroup = allGroups.reduce((a, b) => a.investor_share > b.investor_share ? a : b);
    const minGroup = allGroups.reduce((a, b) => a.investor_share < b.investor_share ? a : b);
    descEl.textContent = `Bar chart showing investor purchase share across income and racial groups. Highest: ${maxGroup.group} at ${formatPercent(maxGroup.investor_share)}. Lowest: ${minGroup.group} at ${formatPercent(minGroup.investor_share)}.`;
  }
}

export function update(data, options = {}) {
  created = false;
  if (svg) svg.selectAll('*').remove();
  create(document.getElementById('demographic-bars-viz'), data, options);
}

export function highlight(demographic) {
  const el = document.getElementById('hurt-personalized');
  if (!el) return;
  const raceLabel = demographic.raceLabel || demographic.race;
  const incomeLabel = demographic.incomeLabel || demographic.income;
  el.innerHTML = `<p>For <strong>${raceLabel}</strong> households earning <strong>${incomeLabel}</strong>: investor activity in your neighborhoods is associated with higher displacement pressure. See your group highlighted in the chart above.</p>`;
}
