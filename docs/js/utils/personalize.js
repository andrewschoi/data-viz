/**
 * personalize.js — User demographic state management
 * Captures form inputs, manages global state, persists via URL query params,
 * and broadcasts state changes to chart modules.
 */

const STATE_KEYS = ['income', 'race', 'status', 'neighborhood'];

let state = {
  income: null,
  race: null,
  status: 'renter',
  neighborhood: null,
};

let schema = null;
const listeners = [];

/** Load personalization schema from data file */
export async function loadSchema() {
  const res = await fetch('./data/personalization-schema.json');
  schema = await res.json();
  return schema;
}

/** Get the loaded schema */
export function getSchema() {
  return schema;
}

/** Populate form dropdowns from schema */
export function populateForm() {
  if (!schema) return;

  const incomeSelect = document.getElementById('input-income');
  schema.dimensions.income_brackets.values.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = v.label;
    incomeSelect.appendChild(opt);
  });

  const raceSelect = document.getElementById('input-race');
  schema.dimensions.race_ethnicity.values.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = v.label;
    raceSelect.appendChild(opt);
  });

  const neighborhoodSelect = document.getElementById('input-neighborhood');
  // Boston neighborhoods first
  const bostonGroup = document.createElement('optgroup');
  bostonGroup.label = 'Boston Neighborhoods';
  schema.dimensions.neighborhoods.boston_neighborhoods.forEach(n => {
    const opt = document.createElement('option');
    opt.value = n;
    opt.textContent = n;
    bostonGroup.appendChild(opt);
  });
  neighborhoodSelect.appendChild(bostonGroup);

  // MAPC municipalities excluded — chart data only covers Boston neighborhoods
}

/** Read state from URL query parameters */
export function readFromURL() {
  const params = new URLSearchParams(window.location.search);
  STATE_KEYS.forEach(key => {
    const val = params.get(key);
    if (val) state[key] = val;
  });
  return { ...state };
}

/** Write state to URL query parameters */
export function writeToURL() {
  const params = new URLSearchParams();
  STATE_KEYS.forEach(key => {
    if (state[key]) params.set(key, state[key]);
  });
  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newURL);
}

/** Set state from form inputs */
export function captureForm() {
  const income = document.getElementById('input-income').value;
  const race = document.getElementById('input-race').value;
  const neighborhood = document.getElementById('input-neighborhood').value;

  // Get status from toggle
  const activeToggle = document.querySelector('#personalization-form .toggle-btn--active');
  const status = activeToggle ? activeToggle.dataset.value : 'renter';

  state.income = income;
  state.race = race;
  state.status = status;
  state.neighborhood = neighborhood;

  writeToURL();
  notifyListeners();
  updateDemoBar();
  announceUpdate();
}

/** Pre-fill form from URL state */
export function prefillForm() {
  if (state.income) {
    document.getElementById('input-income').value = state.income;
  }
  if (state.race) {
    document.getElementById('input-race').value = state.race;
  }
  if (state.neighborhood) {
    document.getElementById('input-neighborhood').value = state.neighborhood;
  }
  if (state.status) {
    const toggles = document.querySelectorAll('#personalization-form .toggle-btn');
    toggles.forEach(btn => {
      const isActive = btn.dataset.value === state.status;
      btn.classList.toggle('toggle-btn--active', isActive);
      btn.setAttribute('aria-checked', isActive);
    });
  }
}

/** Update the sticky demographic bar */
function updateDemoBar() {
  const bar = document.getElementById('demo-bar');
  bar.hidden = false;

  document.getElementById('demo-bar-income').textContent = getLabelFor('income', state.income);
  document.getElementById('demo-bar-race').textContent = getLabelFor('race', state.race);
  document.getElementById('demo-bar-status').textContent = state.status === 'renter' ? 'Renter' : 'Owner/Buyer';
  document.getElementById('demo-bar-neighborhood').textContent = state.neighborhood || 'Boston';
}

/** Announce update to screen readers */
function announceUpdate() {
  const el = document.getElementById('data-announce');
  el.textContent = `Data updated for your selections: ${getLabelFor('income', state.income)}, ${getLabelFor('race', state.race)}, ${state.status === 'renter' ? 'Renter' : 'Owner/Buyer'}, ${state.neighborhood || 'Boston'}`;
}

/** Get human-readable label from schema */
export function getLabelFor(dimension, id) {
  if (!schema || !id) return id || '';

  if (dimension === 'income') {
    const found = schema.dimensions.income_brackets.values.find(v => v.id === id);
    return found ? found.label : id;
  }
  if (dimension === 'race') {
    const found = schema.dimensions.race_ethnicity.values.find(v => v.id === id);
    return found ? found.label : id;
  }
  return id;
}

/** Get the current state */
export function getState() {
  return { ...state };
}

/** Check if state is fully populated */
export function isComplete() {
  return state.income && state.race && state.status && state.neighborhood;
}

/** Subscribe to state changes */
export function subscribe(fn) {
  listeners.push(fn);
}

/** Notify all listeners */
function notifyListeners() {
  const s = { ...state };
  listeners.forEach(fn => fn(s));
}

/** Get the race color for the user's selected race */
export function getUserRaceColor() {
  const raceColorMap = {
    white: 'var(--color-cat-1)',
    black: 'var(--color-cat-2)',
    hispanic_latino: 'var(--color-cat-3)',
    asian: 'var(--color-cat-4)',
    other_multi: 'var(--color-cat-5)',
  };
  return raceColorMap[state.race] || 'var(--color-cat-1)';
}
