/**
 * demographic-bars.js — Lollipop chart for Screen 5 (Who Gets Hurt)
 * Shows investor purchase share by income bracket and race as a horizontal
 * lollipop chart, sorted by investor share within each category.
 * A reference line marks the overall average so users can immediately see
 * which groups face disproportionate investor targeting.
 * The user's own income + race groups are highlighted with the YOU color.
 */
import * as tooltip from '../utils/tooltip.js';
import { getDuration, getYouColor, getCSSVar, formatPercent, formatNumber } from '../utils/scales.js';

let svg, created = false;

// Map group names to shorter display labels
const labelMap = {
  'Q1 (Lowest)': 'Under $55k',
  'Q2': '$55k – $80k',
  'Q3': '$80k – $105k',
  'Q4': '$105k – $130k',
  'Q5 (Highest)': '$130k+',
  'Majority White': 'White',
  'Majority Black': 'Black',
  'Majority Asian': 'Asian',
  'Majority Hispanic/Latino': 'Hispanic/Latino',
  'Majority Hispanic': 'Hispanic',
  'Mixed/No Majority': 'Mixed',
  'No Majority': 'No Majority',
  'Unknown': 'Unknown',
};

// Mapping from user-facing demographic labels to data group names (for highlight matching)
const incomeMatchMap = {
  'Under $35k': 'Q1 (Lowest)',
  '$35k-$75k': 'Q1 (Lowest)',
  '$75k-$125k': 'Q3',
  '$125k-$200k': 'Q4',
  '$200k+': 'Q5 (Highest)',
  'Q1 (Lowest)': 'Q1 (Lowest)',
  'Q2': 'Q2',
  'Q3': 'Q3',
  'Q4': 'Q4',
  'Q5 (Highest)': 'Q5 (Highest)',
};
const raceMatchMap = {
  'White': 'Majority White',
  'Black': 'Majority Black',
  'Asian': 'Majority Asian',
  'Hispanic/Latino': 'Majority Hispanic/Latino',
  'Hispanic': 'Majority Hispanic/Latino',
  'Mixed': 'No Majority',
  'Other': 'No Majority',
};

function matchesUser(d, userIncome, userRace) {
  if (!userIncome && !userRace) return false;
  if (d.category === 'income' && userIncome) {
    return d.group === userIncome || d.group === incomeMatchMap[userIncome];
  }
  if (d.category === 'race' && userRace) {
    return d.group === userRace || d.group === raceMatchMap[userRace];
  }
  return false;
}

export function create(container, data, options = {}) {
  if (created) return;
  created = true;

  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;

  const width = el.clientWidth || 800;
  const height = Math.round(width * 0.55);
  const margin = { top: 50, right: 100, bottom: 40, left: 160 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  svg = d3.select(el)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);

  svg.selectAll('*').remove();

  // Separate and sort each category by investor share (highest first)
  const incomeData = data.filter(d => d.category === 'income')
    .sort((a, b) => b.investor_share - a.investor_share);
  const raceData = data.filter(d => d.category === 'race')
    .filter(d => d.group !== 'Unknown') // exclude Unknown (only 13 sales)
    .sort((a, b) => b.investor_share - a.investor_share);

  // Add short labels
  [...incomeData, ...raceData].forEach(d => {
    d.shortLabel = labelMap[d.group] || d.group;
  });

  // Compute overall average investor share (weighted by total_sales)
  const allData = [...incomeData, ...raceData];
  const totalInvestor = d3.sum(data.filter(d => d.category === 'income'), d => d.total_investor);
  const totalSales = d3.sum(data.filter(d => d.category === 'income'), d => d.total_sales);
  const avgShare = totalInvestor / totalSales;

  // Compute key insight ratio (Black vs White)
  const blackEntry = raceData.find(d => d.group === 'Majority Black');
  const whiteEntry = raceData.find(d => d.group === 'Majority White');
  const insightRatio = blackEntry && whiteEntry
    ? (blackEntry.investor_share / whiteEntry.investor_share).toFixed(1)
    : null;

  // Layout: income rows, then a gap, then race rows
  const gap = 28; // pixels between sections
  const rowHeight = Math.min(32, (innerHeight - gap) / (incomeData.length + raceData.length + 1));
  const incomeHeight = incomeData.length * rowHeight;
  const raceStartY = incomeHeight + gap;

  // Build ordered items with y positions
  const items = [];
  incomeData.forEach((d, i) => {
    items.push({ ...d, y: i * rowHeight + rowHeight / 2 });
  });
  raceData.forEach((d, i) => {
    items.push({ ...d, y: raceStartY + i * rowHeight + rowHeight / 2 });
  });

  const totalChartHeight = raceStartY + raceData.length * rowHeight;

  // Scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(items, d => d.investor_share) * 1.12])
    .range([0, innerWidth]);

  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  // User highlight info
  const userIncome = options.userIncome || null;
  const userRace = options.userRace || null;
  const youColor = getYouColor();
  const defaultColor = getCSSVar('--color-neutral-400');
  const incomeColor = getCSSVar('--color-cat-6');
  const raceColorMap = {
    'White': getCSSVar('--color-cat-1'),
    'Black': getCSSVar('--color-cat-2'),
    'Hispanic/Latino': getCSSVar('--color-cat-3'),
    'Asian': getCSSVar('--color-cat-4'),
    'No Majority': getCSSVar('--color-cat-5'),
    'Mixed': getCSSVar('--color-cat-5'),
  };

  function getItemColor(d) {
    if (matchesUser(d, userIncome, userRace)) return youColor;
    if (d.category === 'income') return incomeColor;
    return raceColorMap[d.shortLabel] || defaultColor;
  }

  // --- Section labels ---
  g.append('text')
    .attr('x', -margin.left + 8)
    .attr('y', -12)
    .attr('font-size', '11px')
    .attr('font-weight', '600')
    .attr('letter-spacing', '0.08em')
    .attr('fill', getCSSVar('--color-neutral-500'))
    .text('BY INCOME BRACKET');

  g.append('text')
    .attr('x', -margin.left + 8)
    .attr('y', raceStartY - 12)
    .attr('font-size', '11px')
    .attr('font-weight', '600')
    .attr('letter-spacing', '0.08em')
    .attr('fill', getCSSVar('--color-neutral-500'))
    .text('BY NEIGHBORHOOD RACE');

  // --- Average reference line ---
  const avgX = xScale(avgShare);

  g.append('line')
    .attr('x1', avgX).attr('x2', avgX)
    .attr('y1', -6)
    .attr('y2', totalChartHeight + 6)
    .attr('stroke', getCSSVar('--color-neutral-800'))
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '6 4')
    .attr('opacity', 0.7);

  g.append('text')
    .attr('x', avgX)
    .attr('y', -20)
    .attr('text-anchor', 'middle')
    .attr('font-size', '11px')
    .attr('font-weight', '600')
    .attr('fill', getCSSVar('--color-neutral-700'))
    .text(`Avg: ${formatPercent(avgShare, 1)}`);

  // --- Grid lines ---
  const ticks = xScale.ticks(5);
  ticks.forEach(t => {
    if (Math.abs(t - avgShare) < 0.01) return; // skip if too close to avg line
    g.append('line')
      .attr('x1', xScale(t)).attr('x2', xScale(t))
      .attr('y1', -6).attr('y2', totalChartHeight + 6)
      .attr('stroke', getCSSVar('--color-neutral-200'))
      .attr('stroke-width', 1);
  });

  // --- X axis labels (skip ticks too close to the average line) ---
  ticks.forEach(t => {
    if (Math.abs(xScale(t) - avgX) < 50) return;
    g.append('text')
      .attr('x', xScale(t))
      .attr('y', totalChartHeight + 24)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', getCSSVar('--color-neutral-400'))
      .text(`${(t * 100).toFixed(0)}%`);
  });

  // --- X axis title ---
  g.append('text')
    .attr('x', innerWidth / 2)
    .attr('y', totalChartHeight + 38)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', '500')
    .attr('fill', getCSSVar('--color-neutral-600'))
    .text('Investor Purchase Share');

  // --- Lollipop rows ---
  const duration = getDuration(300);
  const stagger = getDuration(40);

  items.forEach((d, i) => {
    const isYou = matchesUser(d, userIncome, userRace);
    const color = getItemColor(d);
    const aboveAvg = d.investor_share > avgShare;

    // Row label (left side)
    const label = g.append('text')
      .attr('x', -12)
      .attr('y', d.y)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'central')
      .attr('font-size', isYou ? '13px' : '12px')
      .attr('font-weight', isYou ? '700' : '500')
      .attr('fill', isYou ? youColor : getCSSVar('--color-neutral-700'))
      .text(d.shortLabel);

    // "YOU" badge
    if (isYou) {
      const labelBBox = label.node().getBBox ? label.node().getBBox() : { x: -12, width: 30 };
      g.append('text')
        .attr('x', labelBBox.x - 6)
        .attr('y', d.y)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'central')
        .attr('font-size', '9px')
        .attr('font-weight', '700')
        .attr('letter-spacing', '0.06em')
        .attr('fill', youColor)
        .text('YOU');
    }

    // Stem (line from 0 to value)
    g.append('line')
      .attr('x1', 0)
      .attr('x2', 0) // animate from 0
      .attr('y1', d.y)
      .attr('y2', d.y)
      .attr('stroke', color)
      .attr('stroke-width', isYou ? 3 : 2)
      .attr('opacity', isYou ? 1 : 0.7)
      .transition()
      .duration(duration)
      .delay(i * stagger)
      .attr('x2', xScale(d.investor_share));

    // Dot at end
    g.append('circle')
      .attr('cx', 0) // animate from 0
      .attr('cy', d.y)
      .attr('r', isYou ? 7 : 5)
      .attr('fill', color)
      .attr('stroke', isYou ? getCSSVar('--color-you-dark') : 'none')
      .attr('stroke-width', isYou ? 2 : 0)
      .attr('tabindex', '0')
      .attr('role', 'img')
      .attr('aria-label', `${d.group}: ${formatPercent(d.investor_share)} investor purchase share, ${aboveAvg ? 'above' : 'below'} average`)
      .transition()
      .duration(duration)
      .delay(i * stagger)
      .attr('cx', xScale(d.investor_share));

    // Value label (right of dot)
    g.append('text')
      .attr('x', xScale(d.investor_share) + (isYou ? 12 : 10))
      .attr('y', d.y)
      .attr('dominant-baseline', 'central')
      .attr('font-size', isYou ? '12px' : '11px')
      .attr('font-weight', isYou ? '700' : '600')
      .attr('fill', isYou ? youColor : getCSSVar('--color-neutral-700'))
      .text(formatPercent(d.investor_share, 1))
      .attr('opacity', 0)
      .transition()
      .duration(duration)
      .delay(i * stagger)
      .attr('opacity', 1);

    // Tooltip (on dot)
    const dotSel = g.selectAll('circle').filter(function() {
      return d3.select(this).attr('aria-label') &&
        d3.select(this).attr('aria-label').startsWith(d.group);
    });

    const tooltipContent = (event) => {
      const rows = [
        ['Investor share', formatPercent(d.investor_share, 1)],
        ['vs. average', `${aboveAvg ? '+' : ''}${formatPercent(d.investor_share - avgShare, 1)}`],
        ['Total investor purchases', formatNumber(d.total_investor)],
        ['Total sales', formatNumber(d.total_sales)],
      ];
      if (d.median_income) rows.push(['Median income', `$${formatNumber(d.median_income)}`]);
      if (d.n_tracts) rows.push(['Census tracts', formatNumber(d.n_tracts)]);
      tooltip.show(event, tooltip.formatTooltip(d.group, rows));
    };

    // Reselect the specific circle for this item using the index
    // We use a transparent hit area rect instead for better hover target
    const hitArea = g.append('rect')
      .attr('x', 0)
      .attr('y', d.y - rowHeight / 2)
      .attr('width', innerWidth)
      .attr('height', rowHeight)
      .attr('fill', 'transparent')
      .attr('cursor', 'pointer');

    hitArea
      .on('mouseenter', tooltipContent)
      .on('mousemove', tooltipContent)
      .on('mouseleave', () => tooltip.hide())
      .on('focus', tooltipContent)
      .on('blur', () => tooltip.hide());
  });

  // --- Annotation: key insight ---
  if (insightRatio && blackEntry && whiteEntry) {
    const annotG = g.append('g')
      .attr('class', 'annotation')
      .attr('opacity', 0);

    // Position annotation above the race section
    const blackItem = items.find(it => it.group === 'Majority Black');
    const whiteItem = items.find(it => it.group === 'Majority White');

    if (blackItem && whiteItem) {
      // Bracket connector between Black and White dots
      const bx = xScale(blackEntry.investor_share);
      const wx = xScale(whiteEntry.investor_share);
      const midX = (bx + wx) / 2;
      const annotY = Math.min(blackItem.y, whiteItem.y) - rowHeight * 0.6;

      // Annotation text
      annotG.append('text')
        .attr('x', midX)
        .attr('y', annotY - 8)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .attr('fill', getCSSVar('--color-negative'))
        .text(`${insightRatio}x more investor activity in Black vs. White neighborhoods`);

      // Small connector lines
      annotG.append('line')
        .attr('x1', bx).attr('x2', bx)
        .attr('y1', blackItem.y - 8).attr('y2', annotY)
        .attr('stroke', getCSSVar('--color-negative'))
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2 2');

      annotG.append('line')
        .attr('x1', wx).attr('x2', wx)
        .attr('y1', whiteItem.y - 8).attr('y2', annotY)
        .attr('stroke', getCSSVar('--color-negative'))
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2 2');

      annotG.append('line')
        .attr('x1', bx).attr('x2', wx)
        .attr('y1', annotY).attr('y2', annotY)
        .attr('stroke', getCSSVar('--color-negative'))
        .attr('stroke-width', 1);
    }

    annotG.transition()
      .duration(getDuration(400))
      .delay(items.length * stagger + duration)
      .attr('opacity', 1);
  }

  // --- Accessibility description ---
  const descEl = document.getElementById('demographic-bars-desc');
  if (descEl) {
    const maxGroup = items.reduce((a, b) => a.investor_share > b.investor_share ? a : b);
    const minGroup = items.reduce((a, b) => a.investor_share < b.investor_share ? a : b);
    descEl.textContent = `Lollipop chart showing investor purchase share across income and racial groups, sorted by concentration. `
      + `Highest: ${maxGroup.group} at ${formatPercent(maxGroup.investor_share)}. `
      + `Lowest: ${minGroup.group} at ${formatPercent(minGroup.investor_share)}. `
      + `Overall average: ${formatPercent(avgShare)}. `
      + (insightRatio ? `Investors are ${insightRatio}x more active in majority-Black neighborhoods than majority-White ones.` : '');
  }
}

export function update(data, options = {}) {
  created = false;
  if (svg) svg.selectAll('*').remove();
  create(document.getElementById('demographic-bars-viz'), data, options);
}

export function highlight(demographic) {
  // Re-render with user highlighting
  if (!svg) return;
  const el = document.getElementById('demographic-bars-viz');
  if (!el) return;

  // Update the personalized text block
  const textEl = document.getElementById('hurt-personalized');
  if (textEl) {
    const raceLabel = demographic.raceLabel || demographic.race;
    const incomeLabel = demographic.incomeLabel || demographic.income;
    textEl.innerHTML = `<p>As a <strong>${raceLabel}</strong> household earning <strong>${incomeLabel}</strong>, `
      + `look for your groups highlighted in <span style="color:${getYouColor()};font-weight:700">blue</span> above. `
      + `Groups above the dashed average line face disproportionate investor targeting — `
      + `meaning more competition, rising prices, and higher displacement pressure in those neighborhoods.</p>`;
  }

  // Re-render chart with user's groups highlighted
  created = false;
  svg.selectAll('*').remove();

  // We need the data to re-render; fetch it from the existing element's dataset
  // or re-fetch. Since the data might not be stored, we reload it.
  d3.json('data/demographic-bars.json').then(data => {
    create(el, data, {
      userIncome: demographic.incomeLabel || demographic.income,
      userRace: demographic.raceLabel || demographic.race,
    });
  }).catch(() => {
    // Fallback: try relative path variants
    d3.json('./data/demographic-bars.json').then(data => {
      create(el, data, {
        userIncome: demographic.incomeLabel || demographic.income,
        userRace: demographic.raceLabel || demographic.race,
      });
    });
  });
}
