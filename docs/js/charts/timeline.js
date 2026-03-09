/**
 * timeline.js — Multi-line chart showing corporate ownership over time (Screen 4)
 * User's neighborhood highlighted in YOU color, metro average in gray.
 */
import * as tooltip from '../utils/tooltip.js';
import { getDuration, getYouColor, getCSSVar, formatPercent } from '../utils/scales.js';

let svg, created = false;

export function create(container, data, options = {}) {
  if (created) return;
  created = true;

  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;

  const width = el.clientWidth || 800;
  const height = Math.round(width * 0.55);
  const margin = { top: 40, right: 140, bottom: 60, left: 65 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  svg = d3.select(el)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);

  svg.selectAll('*').remove();

  // Group data by neighborhood
  const grouped = d3.group(data, d => d.Neighborhood);
  const neighborhoods = Array.from(grouped.keys());

  const userNeighborhood = options.userNeighborhood || 'Dorchester';
  const avgKey = 'Boston (Average)';

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.Year))
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.corp_own_rate) * 1.1])
    .range([innerHeight, 0]);

  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Grid lines
  g.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat('').ticks(6));

  // X axis — show every 4 years to avoid overlap
  const yearExtent = d3.extent(data, d => d.Year);
  const yearTicks = d3.range(Math.ceil(yearExtent[0] / 4) * 4, yearExtent[1] + 1, 4);
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale).tickValues(yearTicks).tickFormat(d3.format('d')))
    .selectAll('text')
    .attr('font-size', '12px');

  // Y axis
  g.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(yScale).tickFormat(d => `${(d * 100).toFixed(0)}%`).ticks(6));

  // Y axis label
  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', -45)
    .attr('text-anchor', 'middle')
    .attr('font-size', '13px')
    .attr('font-weight', '500')
    .attr('fill', getCSSVar('--color-neutral-600'))
    .text('Corporate Ownership Rate');

  const line = d3.line()
    .x(d => xScale(d.Year))
    .y(d => yScale(d.corp_own_rate))
    .curve(d3.curveMonotoneX);

  const duration = getDuration(500);

  // Draw all neighborhood lines (faded)
  neighborhoods.forEach(name => {
    if (name === userNeighborhood || name === avgKey) return;
    const lineData = grouped.get(name);
    if (!lineData) return;

    g.append('path')
      .datum(lineData)
      .attr('fill', 'none')
      .attr('stroke', getCSSVar('--color-neutral-300'))
      .attr('stroke-width', 1)
      .attr('opacity', 0.4)
      .attr('d', line);
  });

  // Average line
  if (grouped.has(avgKey)) {
    const avgData = grouped.get(avgKey);
    g.append('path')
      .datum(avgData)
      .attr('fill', 'none')
      .attr('stroke', getCSSVar('--color-neutral-500'))
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 4')
      .attr('d', line);

    // Label
    const lastAvg = avgData[avgData.length - 1];
    g.append('text')
      .attr('x', xScale(lastAvg.Year) + 6)
      .attr('y', yScale(lastAvg.corp_own_rate) + 4)
      .attr('font-size', '11px')
      .attr('fill', getCSSVar('--color-neutral-500'))
      .text('Boston Avg');
  }

  // User's neighborhood line (highlighted)
  if (grouped.has(userNeighborhood)) {
    const userData = grouped.get(userNeighborhood);

    const userPath = g.append('path')
      .datum(userData)
      .attr('fill', 'none')
      .attr('stroke', getYouColor())
      .attr('stroke-width', 3)
      .attr('d', line);

    // Animate line drawing
    if (duration > 0) {
      const totalLength = userPath.node().getTotalLength();
      userPath
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(getDuration(1200))
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);
    }

    // Label
    const lastUser = userData[userData.length - 1];
    g.append('text')
      .attr('x', xScale(lastUser.Year) + 6)
      .attr('y', yScale(lastUser.corp_own_rate) + 4)
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', getYouColor())
      .text(userNeighborhood);

    // Endpoint dot
    g.append('circle')
      .attr('cx', xScale(lastUser.Year))
      .attr('cy', yScale(lastUser.corp_own_rate))
      .attr('r', 5)
      .attr('fill', getYouColor());
  }

  // Inflection point annotations
  const annotations = [
    { year: 2008, label: 'Financial Crisis', y: 0.05 },
    { year: 2020, label: 'COVID-19', y: 0.05 },
  ];

  annotations.forEach(ann => {
    if (ann.year >= d3.min(data, d => d.Year) && ann.year <= d3.max(data, d => d.Year)) {
      g.append('line')
        .attr('x1', xScale(ann.year))
        .attr('x2', xScale(ann.year))
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .attr('stroke', getCSSVar('--color-neutral-400'))
        .attr('stroke-dasharray', '4 4')
        .attr('opacity', 0.6);

      g.append('text')
        .attr('x', xScale(ann.year) + 4)
        .attr('y', 14)
        .attr('font-size', '10px')
        .attr('fill', getCSSVar('--color-neutral-500'))
        .text(ann.label);
    }
  });

  // Hover overlay
  const bisect = d3.bisector(d => d.Year).left;
  const focus = g.append('g').style('display', 'none');
  focus.append('circle').attr('r', 5).attr('fill', getYouColor());
  focus.append('line')
    .attr('class', 'hover-line')
    .attr('y1', 0).attr('y2', innerHeight)
    .attr('stroke', getCSSVar('--color-neutral-400'))
    .attr('stroke-dasharray', '2 2');

  const overlay = g.append('rect')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('fill', 'transparent')
    .attr('cursor', 'crosshair');

  overlay
    .on('mousemove', function(event) {
      const [mx] = d3.pointer(event);
      const year = Math.round(xScale.invert(mx));
      const userData = grouped.get(userNeighborhood) || grouped.get(avgKey);
      if (!userData) return;

      const idx = bisect(userData, year);
      const d = userData[Math.min(idx, userData.length - 1)];
      if (!d) return;

      focus.style('display', null);
      focus.select('circle').attr('cx', xScale(d.Year)).attr('cy', yScale(d.corp_own_rate));
      focus.select('.hover-line').attr('x1', xScale(d.Year)).attr('x2', xScale(d.Year));

      tooltip.show(event, tooltip.formatTooltip(`${d.Neighborhood} (${d.Year})`, [
        ['Corporate ownership', formatPercent(d.corp_own_rate)],
        ['Owner-occupied', formatPercent(d.own_occ_rate)],
      ]));
    })
    .on('mouseleave', () => {
      focus.style('display', 'none');
      tooltip.hide();
    });

  // Update description
  const descEl = document.getElementById('timeline-desc');
  if (descEl && grouped.has(userNeighborhood)) {
    const ud = grouped.get(userNeighborhood);
    const first = ud[0];
    const last = ud[ud.length - 1];
    descEl.textContent = `Line chart showing corporate ownership rate in ${userNeighborhood} from ${first.Year} to ${last.Year}. The rate changed from ${formatPercent(first.corp_own_rate)} to ${formatPercent(last.corp_own_rate)}.`;
  }
}

export function update(data, options = {}) {
  created = false;
  if (svg) svg.selectAll('*').remove();
  create(document.getElementById('timeline-viz'), data, options);
}

export function highlight(demographic) {
  const el = document.getElementById('timeline-personalized');
  if (!el || !demographic.neighborhood) return;
  el.innerHTML = `<p>In <strong>${demographic.neighborhood}</strong>, corporate ownership has been tracked since 2004. See how your neighborhood compares to the Boston average above.</p>`;
}
