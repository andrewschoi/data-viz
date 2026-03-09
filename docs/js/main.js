/**
 * main.js — Application entry point
 * Initializes scroll controller, binds form, lazy-loads charts.
 */
import * as personalize from './utils/personalize.js';
import * as scroll from './utils/scroll.js';
import * as heroStat from './charts/hero-stat.js';
import * as choropleth from './charts/choropleth.js';
import * as timeline from './charts/timeline.js';
import * as demographicBars from './charts/demographic-bars.js';
import * as evictionDots from './charts/eviction-dots.js';
import * as landlordDonut from './charts/landlord-type-donut.js';
import * as evictionByOwner from './charts/eviction-by-owner.js';
import * as neighborhoodValue from './charts/neighborhood-value.js';
import * as priceIncomeGauge from './charts/price-income-gauge.js';
import * as cashBuyer from './charts/cash-buyer-competition.js';
import * as rentBuyBreakeven from './charts/rent-buy-breakeven.js';
import * as investorCompetition from './charts/investor-competition.js';
import * as comparison from './charts/comparison.js';
import * as policyCards from './charts/policy-cards.js';

const DATA_BASE = './data';

// Track which sections have been loaded
const loaded = new Set();

// Data cache
const dataCache = {};

/** Fetch JSON data with caching */
async function fetchData(filename) {
  if (dataCache[filename]) return dataCache[filename];
  try {
    const res = await fetch(`${DATA_BASE}/${filename}`);
    if (!res.ok) throw new Error(`Failed to load ${filename}: ${res.status}`);
    const data = await res.json();
    dataCache[filename] = data;
    return data;
  } catch (err) {
    console.error(`Error loading ${filename}:`, err);
    return null;
  }
}

/** Initialize the application */
async function init() {
  // Load schema and populate form
  await personalize.loadSchema();
  personalize.populateForm();

  // Check for URL params
  const urlState = personalize.readFromURL();
  if (urlState.income && urlState.race && urlState.neighborhood) {
    personalize.prefillForm();
  }

  // Bind form
  bindForm();
  bindToggles();
  bindTrackToggle();
  bindEditButton();
  bindShareButton();

  // If we have complete state from URL, auto-submit
  if (personalize.isComplete()) {
    personalize.captureForm();
    showStory();
  }

  // Initialize scroll controller
  scroll.initScrolly();
  scroll.initSectionObserver(handleSectionEnter);
}

/** Bind form submission */
function bindForm() {
  const form = document.getElementById('personalization-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate
    const income = document.getElementById('input-income').value;
    const race = document.getElementById('input-race').value;
    const neighborhood = document.getElementById('input-neighborhood').value;

    if (!income || !race || !neighborhood) {
      // Show validation errors
      const selects = form.querySelectorAll('.form-select');
      selects.forEach(select => {
        if (!select.value) {
          select.style.borderColor = 'var(--color-negative)';
          const helper = select.parentElement.querySelector('.form-helper');
          if (helper) {
            const error = document.createElement('p');
            error.className = 'form-error';
            error.textContent = 'Please select an option.';
            helper.after(error);
          }
        }
      });
      return;
    }

    // Clear any previous errors
    form.querySelectorAll('.form-error').forEach(el => el.remove());
    form.querySelectorAll('.form-select').forEach(el => {
      el.style.borderColor = '';
    });

    personalize.captureForm();
    showStory();
  });
}

/** Show the story sections (scroll past landing) */
function showStory() {
  // Update dynamic headline
  const state = personalize.getState();
  const headline = document.querySelector('.landing__headline');
  if (headline && state.status === 'renter') {
    headline.textContent = 'Hello, Renter.';
  }

  // Update Screen 6 subtitle
  const subtitle = document.getElementById('screen-6-subtitle');
  if (subtitle) {
    const statusLabel = state.status === 'renter' ? 'a renter' : 'a homeowner/buyer';
    subtitle.textContent = `As ${statusLabel} in ${state.neighborhood} earning ${personalize.getLabelFor('income', state.income)}, here's what the data says.`;
  }

  // Set default track
  setTrack(state.status === 'owner' ? 'owner' : 'renter');

  // Scroll to big picture
  setTimeout(() => {
    scroll.scrollToSection('screen-big-picture');
  }, 300);
}

/** Bind toggle buttons (housing status) */
function bindToggles() {
  document.querySelectorAll('#personalization-form .toggle-group').forEach(group => {
    group.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.toggle-btn').forEach(b => {
          b.classList.remove('toggle-btn--active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('toggle-btn--active');
        btn.setAttribute('aria-checked', 'true');

        // Update headline dynamically
        if (btn.dataset.value === 'renter') {
          document.querySelector('.landing__headline').textContent = 'Hello, Renter.';
        } else {
          document.querySelector('.landing__headline').textContent = 'Hello, Homeowner.';
        }
      });
    });
  });

  // Investor type toggle on map
  const mapToggle = document.querySelector('#screen-investor-map .toggle-group--compact');
  if (mapToggle) {
    mapToggle.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        mapToggle.querySelectorAll('.toggle-btn').forEach(b => {
          b.classList.remove('toggle-btn--active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('toggle-btn--active');
        btn.setAttribute('aria-checked', 'true');
        // Filter choropleth by investor type
        choropleth.setType(btn.dataset.value);
      });
    });
  }
}

/** Bind track toggle on Screen 6 */
function bindTrackToggle() {
  document.querySelectorAll('.track-toggle__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setTrack(btn.dataset.track);
    });
  });
}

/** Switch between renter and owner tracks */
function setTrack(track) {
  const renterTrack = document.getElementById('track-renter');
  const ownerTrack = document.getElementById('track-owner');
  const renterBtn = document.querySelector('.track-toggle__btn--renter');
  const ownerBtn = document.querySelector('.track-toggle__btn--owner');

  if (track === 'owner') {
    renterTrack.hidden = true;
    ownerTrack.hidden = false;
    renterBtn.setAttribute('aria-checked', 'false');
    ownerBtn.setAttribute('aria-checked', 'true');
    // Load owner track charts
    loadOwnerTrack();
  } else {
    renterTrack.hidden = false;
    ownerTrack.hidden = true;
    renterBtn.setAttribute('aria-checked', 'true');
    ownerBtn.setAttribute('aria-checked', 'false');
    // Load renter track charts
    loadRenterTrack();
  }
}

/** Bind edit button in demo bar */
function bindEditButton() {
  const editBtn = document.getElementById('demo-bar-edit');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      scroll.scrollToSection('screen-landing');
    });
  }
}

/** Bind share button */
function bindShareButton() {
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const url = window.location.href;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          shareBtn.textContent = 'Link copied!';
          setTimeout(() => { shareBtn.textContent = 'Share your results'; }, 2000);
        });
      } else {
        // Fallback
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        shareBtn.textContent = 'Link copied!';
        setTimeout(() => { shareBtn.textContent = 'Share your results'; }, 2000);
      }
    });
  }
}

/** Handle section enter (lazy load charts) */
async function handleSectionEnter(sectionId) {
  if (loaded.has(sectionId)) return;
  if (!personalize.isComplete() && sectionId !== 'screen-landing') return;

  loaded.add(sectionId);
  const state = personalize.getState();

  switch (sectionId) {
    case 'screen-big-picture':
      await loadBigPicture(state);
      break;
    case 'screen-investor-map':
      await loadInvestorMap(state);
      break;
    case 'screen-timeline':
      await loadTimeline(state);
      break;
    case 'screen-who-gets-hurt':
      await loadWhoGetsHurt(state);
      break;
    case 'screen-things-to-know':
      await loadThingsToKnow(state);
      break;
    case 'screen-other-side':
      await loadOtherSide(state);
      break;
    case 'screen-policy':
      await loadPolicy(state);
      break;
    case 'screen-closing':
      loadClosing(state);
      break;
  }
}

/** Load Screen 2: Big Picture */
async function loadBigPicture(state) {
  const data = await fetchData('hero-stats.json');
  if (!data) return;
  heroStat.create('#hero-stat-viz', data);
  heroStat.highlight(state);
  heroStat.animateIn();
}

/** Load Screen 3: Investor Map */
async function loadInvestorMap(state) {
  const data = await fetchData('neighborhood-investor-rates.json');
  if (!data) return;
  choropleth.create(document.getElementById('choropleth-viz'), data, {
    userNeighborhood: state.neighborhood,
  });
  choropleth.highlight(state);
}

/** Load Screen 4: Timeline */
async function loadTimeline(state) {
  const data = await fetchData('timeline-corp-ownership.json');
  if (!data) return;
  timeline.create(document.getElementById('timeline-viz'), data, {
    userNeighborhood: state.neighborhood,
  });
  timeline.highlight(state);
}

/** Load Screen 5: Who Gets Hurt */
async function loadWhoGetsHurt(state) {
  const [barsData, dotsData] = await Promise.all([
    fetchData('demographic-bars.json'),
    fetchData('eviction-by-tract.json'),
  ]);

  if (barsData) {
    demographicBars.create(document.getElementById('demographic-bars-viz'), barsData, {
      userRace: state.race,
      userIncome: state.income,
    });
    demographicBars.highlight({
      ...state,
      raceLabel: personalize.getLabelFor('race', state.race),
      incomeLabel: personalize.getLabelFor('income', state.income),
    });
  }

  if (dotsData) {
    evictionDots.create(document.getElementById('eviction-dots-viz'), dotsData);
  }
}

/** Load Screen 6 Renter Track */
async function loadRenterTrack() {
  const state = personalize.getState();

  const [donutData, evictionData, valueData] = await Promise.all([
    fetchData('landlord-type-donut.json'),
    fetchData('eviction-by-owner-type.json'),
    fetchData('neighborhood-value.json'),
  ]);

  if (donutData) {
    landlordDonut.create(document.getElementById('landlord-donut-viz'), donutData, {
      userNeighborhood: state.neighborhood,
    });
  }

  if (evictionData) {
    evictionByOwner.create(document.getElementById('eviction-by-owner-viz'), evictionData, {
      userNeighborhood: state.neighborhood,
    });
  }

  if (valueData) {
    neighborhoodValue.create(document.getElementById('neighborhood-value-viz'), valueData, {
      userNeighborhood: state.neighborhood,
    });
  }
}

/** Load Screen 6 Owner Track */
async function loadOwnerTrack() {
  const state = personalize.getState();

  const [gaugeData, cashData, breakevenData, competitionData] = await Promise.all([
    fetchData('price-income-gauge.json'),
    fetchData('cash-buyer-competition.json'),
    fetchData('rent-buy-breakeven.json'),
    fetchData('investor-competition.json'),
  ]);

  if (gaugeData) {
    priceIncomeGauge.create(document.getElementById('price-income-viz'), gaugeData, {
      userIncome: state.income,
    });
  }

  if (cashData) {
    cashBuyer.create(document.getElementById('cash-buyer-viz'), cashData);
  }

  if (breakevenData) {
    rentBuyBreakeven.create(document.getElementById('breakeven-viz'), breakevenData, {
      userNeighborhood: state.neighborhood,
    });
  }

  if (competitionData) {
    investorCompetition.create(document.getElementById('investor-competition-viz'), competitionData, {
      userNeighborhood: state.neighborhood,
    });
  }
}

/** Load Screen 6 (decides which track to show) */
async function loadThingsToKnow(state) {
  if (state.status === 'owner') {
    await loadOwnerTrack();
  } else {
    await loadRenterTrack();
  }
}

/** Load Screen 7: The Other Side */
async function loadOtherSide(state) {
  const data = await fetchData('comparison-neighborhood-change.json');
  if (!data) return;
  comparison.create(document.getElementById('comparison-viz'), data, {
    userNeighborhood: state.neighborhood,
  });
  comparison.highlight(state);
}

/** Load Screen 8: Policy */
async function loadPolicy(state) {
  const data = await fetchData('policy-cards.json');
  if (!data) return;
  policyCards.create(document.getElementById('policy-cards-container'), data, {
    status: state.status,
    neighborhood: state.neighborhood,
  });
}

/** Load Screen 9: Closing */
function loadClosing(state) {
  const container = document.getElementById('closing-insights');
  if (!container || container.hasChildNodes()) return;

  // Generate 3 personalized insights based on cached data
  const insights = [];

  // Insight 1: Hero stat
  const heroData = dataCache['hero-stats.json'];
  if (heroData) {
    const ratio = Math.round(1 / heroData.investor_purchase_share);
    insights.push({
      number: `1 in ${ratio}`,
      label: `homes sold in Greater Boston went to an investor`,
    });
  }

  // Insight 2: Based on status
  if (state.status === 'renter') {
    insights.push({
      number: '186%',
      label: 'more eviction filings from corporate landlords vs. small landlords',
    });
  } else {
    const cashData = dataCache['cash-buyer-competition.json'];
    if (cashData && cashData.length > 0) {
      const latest = cashData[cashData.length - 1];
      insights.push({
        number: `${(latest.cash_share * 100).toFixed(0)}%`,
        label: `of sales had no mortgage recorded (${latest.year})`,
      });
    }
  }

  // Insight 3: Corporate ownership change
  const changeData = dataCache['comparison-neighborhood-change.json'];
  if (changeData) {
    const userHood = changeData.find(d => d.neighborhood === state.neighborhood);
    if (userHood) {
      insights.push({
        number: `+${(userHood.corp_change * 100).toFixed(0)}pp`,
        label: `corporate ownership change in ${state.neighborhood} since 2004`,
      });
    } else {
      insights.push({
        number: '21',
        label: 'Boston neighborhoods analyzed in this data story',
      });
    }
  }

  // Render insights
  insights.slice(0, 3).forEach(insight => {
    const card = document.createElement('div');
    card.className = 'insight-card';
    card.innerHTML = `
      <div class="insight-card__number">${insight.number}</div>
      <div class="insight-card__label">${insight.label}</div>
    `;
    container.appendChild(card);
  });
}

// Subscribe to personalization changes for updates
personalize.subscribe((state) => {
  // Reset loaded state for dynamic sections
  loaded.delete('screen-things-to-know');
  loaded.delete('screen-closing');

  // Re-highlight all charts
  heroStat.highlight(state);
  choropleth.highlight(state);
  timeline.highlight(state);
  demographicBars.highlight({
    ...state,
    raceLabel: personalize.getLabelFor('race', state.race),
    incomeLabel: personalize.getLabelFor('income', state.income),
  });
  comparison.highlight(state);
});

// Start the app
init().catch(err => console.error('Failed to initialize app:', err));
