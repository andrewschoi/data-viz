/**
 * scroll.js — Intersection Observer scroll controller
 * Manages section enter/exit events and triggers chart animations.
 */

const observers = [];
const sectionCallbacks = new Map();

/** Initialize scroll observation for scrollytelling steps */
export function initScrolly() {
  // Observe scrollytelling steps
  const steps = document.querySelectorAll('.scrolly__step');

  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
        const stepId = entry.target.dataset.step;
        if (stepId && sectionCallbacks.has(stepId)) {
          sectionCallbacks.get(stepId)(entry.target, 'enter');
        }
      } else {
        entry.target.classList.remove('is-active');
      }
    });
  }, {
    rootMargin: '-30% 0px -30% 0px',
    threshold: 0.1,
  });

  steps.forEach(step => {
    stepObserver.observe(step);
  });

  observers.push(stepObserver);
}

/** Initialize observation for screen sections (lazy loading) */
export function initSectionObserver(callback) {
  const sections = document.querySelectorAll('.screen');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target.id, 'enter');
      }
    });
  }, {
    rootMargin: '200px 0px',
    threshold: 0.01,
  });

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  observers.push(sectionObserver);
}

/** Register callback for a specific scroll step */
export function onStep(stepId, callback) {
  sectionCallbacks.set(stepId, callback);
}

/** Smooth scroll to a specific section */
export function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

/** Clean up observers */
export function destroy() {
  observers.forEach(obs => obs.disconnect());
  observers.length = 0;
  sectionCallbacks.clear();
}
