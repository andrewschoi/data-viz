/**
 * rent-buy-breakeven.js — Interactive breakeven analysis chart (Screen 6 Owner)
 * Shows cumulative cost of renting vs buying with adjustable assumptions.
 */
import * as tooltip from '../utils/tooltip.js';
import { getDuration, getCSSVar, getYouColor, formatCurrency } from '../utils/scales.js';

let svg, created = false;
let chartData = null;

// Default parameters
let params = {
  mortgageRate: 6.5,
  downPayment: 20,
  appreciation: 3,
  rentIncrease: 4,
  maintenance: 1,
};

export function create(container, data, options = {}) {
  if (created) return;
  created = true;
  chartData = data;

  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;

  // Use median values from data
  const medianEntry = data[Math.floor(data.length / 2)] || data[0];
  const medianPrice = medianEntry ? medianEntry.median_price : 450000;
  const medianIncome = medianEntry ? medianEntry.mhi : 85000;

  // Build sliders
  const sliderContainer = document.getElementById('breakeven-sliders');
  if (sliderContainer && !sliderContainer.hasChildNodes()) {
    const sliders = [
      { id: 'mortgage-rate', label: 'Mortgage rate', min: 4, max: 9, step: 0.5, value: params.mortgageRate, unit: '%' },
      { id: 'down-payment', label: 'Down payment', min: 5, max: 30, step: 5, value: params.downPayment, unit: '%' },
      { id: 'appreciation', label: 'Home appreciation', min: 0, max: 8, step: 0.5, value: params.appreciation, unit: '%/yr' },
      { id: 'rent-increase', label: 'Rent increase', min: 0, max: 8, step: 0.5, value: params.rentIncrease, unit: '%/yr' },
    ];

    sliders.forEach(s => {
      const div = document.createElement('div');
      div.className = 'slider-group';
      div.innerHTML = `
        <label for="slider-${s.id}">${s.label}</label>
        <input type="range" id="slider-${s.id}" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.value}">
        <span class="slider-value" id="val-${s.id}">${s.value}${s.unit}</span>
      `;
      sliderContainer.appendChild(div);

      const input = div.querySelector('input');
      const valEl = div.querySelector('.slider-value');
      input.addEventListener('input', () => {
        valEl.textContent = `${input.value}${s.unit}`;
        params[s.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = parseFloat(input.value);
        redraw(el, medianPrice, medianIncome);
      });
    });
  }

  drawChart(el, medianPrice, medianIncome);
}

function redraw(el, price, income) {
  created = false;
  if (svg) svg.selectAll('*').remove();
  drawChart(el, price, income);
}

function drawChart(el, homePrice, annualIncome) {
  const width = el.clientWidth || 800;
  const height = Math.round(width * 0.55);
  const margin = { top: 40, right: 30, bottom: 50, left: 70 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  if (!svg) {
    svg = d3.select(el)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);
  } else {
    svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`);
  }
  svg.selectAll('*').remove();

  // Calculate breakeven
  const years = 20;
  const monthlyRate = params.mortgageRate / 100 / 12;
  const loanAmount = homePrice * (1 - params.downPayment / 100);
  const monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, 360)) / (Math.pow(1 + monthlyRate, 360) - 1);

  const estimatedRent = annualIncome * 0.3 / 12; // 30% of income
  const monthlyMaintenace = homePrice * (params.maintenance / 100) / 12;
  const monthlyPropertyTax = homePrice * 0.012 / 12; // 1.2% MA avg

  let rentCumulative = [];
  let buyCumulative = [];
  let rentTotal = 0, buyTotal = 0;
  let breakeven = null;

  for (let y = 0; y <= years; y++) {
    const yearRent = estimatedRent * Math.pow(1 + params.rentIncrease / 100, y) * 12;
    rentTotal += yearRent;
    rentCumulative.push({ year: y, cost: rentTotal });

    if (y === 0) {
      buyTotal = homePrice * params.downPayment / 100; // Down payment
    }
    const yearBuy = (monthlyMortgage + monthlyMaintenace + monthlyPropertyTax) * 12;
    const equity = homePrice * Math.pow(1 + params.appreciation / 100, y) - loanAmount;
    buyTotal += yearBuy;
    const netBuyCost = buyTotal - Math.max(0, equity);
    buyCumulative.push({ year: y, cost: netBuyCost });

    if (!breakeven && y > 0 && netBuyCost < rentTotal) {
      breakeven = y;
    }
  }

  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleLinear().domain([0, years]).range([0, innerWidth]);
  const yMax = Math.max(d3.max(rentCumulative, d => d.cost), d3.max(buyCumulative, d => d.cost));
  const yScale = d3.scaleLinear().domain([0, yMax]).range([innerHeight, 0]);

  // Grid
  g.append('g').attr('class', 'grid')
    .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat('').ticks(5));

  // Axes
  g.append('g').attr('class', 'axis').attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale).ticks(10).tickFormat(d => `Yr ${d}`));

  g.append('g').attr('class', 'axis')
    .call(d3.axisLeft(yScale).tickFormat(d => `$${(d / 1000).toFixed(0)}k`).ticks(5));

  // Title
  svg.append('text')
    .attr('x', margin.left)
    .attr('y', 22)
    .attr('font-size', '14px')
    .attr('font-weight', '600')
    .attr('fill', getCSSVar('--color-neutral-800'))
    .text('Rent vs Buy: Cumulative Cost Comparison');

  const line = d3.line().x(d => xScale(d.year)).y(d => yScale(d.cost)).curve(d3.curveMonotoneX);

  // Rent line
  g.append('path')
    .datum(rentCumulative)
    .attr('fill', 'none')
    .attr('stroke', getCSSVar('--color-renter-accent'))
    .attr('stroke-width', 2.5)
    .attr('d', line);

  // Buy line
  g.append('path')
    .datum(buyCumulative)
    .attr('fill', 'none')
    .attr('stroke', getCSSVar('--color-owner-accent'))
    .attr('stroke-width', 2.5)
    .attr('d', line);

  // Breakeven marker
  if (breakeven) {
    g.append('line')
      .attr('x1', xScale(breakeven)).attr('x2', xScale(breakeven))
      .attr('y1', 0).attr('y2', innerHeight)
      .attr('stroke', getYouColor())
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 4');

    g.append('text')
      .attr('x', xScale(breakeven) + 6)
      .attr('y', 15)
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', getYouColor())
      .text(`Breakeven: Year ${breakeven}`);
  }

  // Legend
  const legendG = g.append('g').attr('transform', `translate(${innerWidth - 160}, ${10})`);
  legendG.append('line').attr('x1', 0).attr('x2', 20).attr('y1', 0).attr('y2', 0).attr('stroke', getCSSVar('--color-renter-accent')).attr('stroke-width', 2.5);
  legendG.append('text').attr('x', 25).attr('y', 4).attr('font-size', '11px').attr('fill', getCSSVar('--color-neutral-600')).text('Renting');
  legendG.append('line').attr('x1', 0).attr('x2', 20).attr('y1', 20).attr('y2', 20).attr('stroke', getCSSVar('--color-owner-accent')).attr('stroke-width', 2.5);
  legendG.append('text').attr('x', 25).attr('y', 24).attr('font-size', '11px').attr('fill', getCSSVar('--color-neutral-600')).text('Buying (net of equity)');

  const descEl = document.getElementById('breakeven-desc');
  if (descEl) {
    descEl.textContent = breakeven
      ? `Based on current assumptions, buying becomes cheaper than renting after approximately ${breakeven} years. Adjust the sliders to change assumptions.`
      : `Based on current assumptions, renting remains cheaper than buying over a 20-year horizon. Adjust the sliders to change assumptions.`;
  }
}

export function update(data, options = {}) {
  created = false;
  chartData = data;
  if (svg) svg.selectAll('*').remove();
  create(document.getElementById('breakeven-viz'), data, options);
}

export function highlight(demographic) {}
