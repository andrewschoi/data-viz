/**
 * scales.js — Shared color scales and utility functions
 * Reads CSS custom property values for consistent styling.
 */

/** Check if user prefers reduced motion */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Get duration respecting reduced motion */
export function getDuration(ms) {
  return prefersReducedMotion() ? 0 : ms;
}

/** Read a CSS custom property value */
export function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Sequential color scale for choropleth (7 bins) */
export function getSequentialColors() {
  return [
    getCSSVar('--color-seq-1'),
    getCSSVar('--color-seq-2'),
    getCSSVar('--color-seq-3'),
    getCSSVar('--color-seq-4'),
    getCSSVar('--color-seq-5'),
    getCSSVar('--color-seq-6'),
    getCSSVar('--color-seq-7'),
  ];
}

/** Categorical colors mapped to demographic groups */
export function getCategoricalColors() {
  return {
    white: getCSSVar('--color-cat-1'),
    black: getCSSVar('--color-cat-2'),
    hispanic_latino: getCSSVar('--color-cat-3'),
    asian: getCSSVar('--color-cat-4'),
    other_multi: getCSSVar('--color-cat-5'),
  };
}

/** Race label to color mapping */
export const RACE_COLORS = {
  'White': '--color-cat-1',
  'Black': '--color-cat-2',
  'Hispanic/Latino': '--color-cat-3',
  'Asian': '--color-cat-4',
  'Other/Multiracial': '--color-cat-5',
};

/** Get YOU highlight color */
export function getYouColor() {
  return getCSSVar('--color-you');
}

/** Format number with commas */
export function formatNumber(n) {
  if (n === null || n === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US').format(Math.round(n));
}

/** Format percentage */
export function formatPercent(n, decimals = 1) {
  if (n === null || n === undefined) return 'N/A';
  return `${(n * 100).toFixed(decimals)}%`;
}

/** Format currency */
export function formatCurrency(n) {
  if (n === null || n === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

/** Standard chart margins */
export function getMargins(size = 'default') {
  const margins = {
    default: { top: 40, right: 30, bottom: 50, left: 60 },
    compact: { top: 30, right: 20, bottom: 40, left: 50 },
    wide: { top: 40, right: 40, bottom: 60, left: 80 },
  };
  return margins[size] || margins.default;
}

/** Get responsive dimensions for a container */
export function getChartDimensions(containerId, margins) {
  const container = document.getElementById(containerId);
  if (!container) return { width: 600, height: 400, innerWidth: 500, innerHeight: 300 };

  const rect = container.getBoundingClientRect();
  const width = Math.min(rect.width || 600, 960);
  const height = Math.min(width * 0.6, 500);
  const m = margins || getMargins();

  return {
    width,
    height,
    innerWidth: width - m.left - m.right,
    innerHeight: height - m.top - m.bottom,
    margin: m,
  };
}
