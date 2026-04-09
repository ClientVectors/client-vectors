/* ============================================
   CLIENT VECTORS — animations.js
   V3 Motion Pass — GSAP + ScrollTrigger
   ============================================ */

// --- Setup ---
gsap.registerPlugin(ScrollTrigger, CustomEase);

CustomEase.create('cv.premium', 'M0,0 C0.16,1 0.3,1 1,1');

// --- Reduced Motion: show everything, skip all animation ---
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  gsap.set([
    '.hero__headline', '.hero__sub', '.hero .btn--lg',
    '.nav .btn--sm',
    '.section__title',
    '.card',
    '.step', '.step__arrow',
    '.who__sub', '.tag',
    '.form-wrap', '.form__group', '#submit-btn',
    '.footer__inner > *'
  ], { autoAlpha: 1, y: 0, x: 0, scale: 1 });

} else {

  // Fade + slide an element (or group) into view on scroll
  function scrollReveal(selector, vars, trigger, start) {
    gsap.from(selector, {
      autoAlpha: 0, y: 20, duration: 0.7, ease: 'power2.out',
      ...vars,
      scrollTrigger: { trigger: trigger || selector, start: start || 'top 85%', once: true }
    });
  }

  // --- 1. Hero Entrance (page load) ---
  gsap.timeline()
    .from('.hero__headline', { autoAlpha: 0, y: 28, duration: 1.0, ease: 'cv.premium' }, 0.1)
    .from('.hero__sub',      { autoAlpha: 0, y: 28, duration: 0.9, ease: 'cv.premium' }, 0.35)
    .from('.hero .btn--lg',  { autoAlpha: 0, y: 28, duration: 0.8, ease: 'cv.premium' }, 0.6);

  // --- 2. Nav CTA Entrance (page load, delayed) ---
  gsap.from('.nav .btn--sm', {
    autoAlpha: 0, x: 8, duration: 0.6, ease: 'power2.out', delay: 0.9
  });

  // --- 3. Section Titles ---
  gsap.utils.toArray('.section__title').forEach(title => scrollReveal(title));

  // --- 4. "What We Do" Cards ---
  scrollReveal('.card', { y: 40, ease: 'cv.premium', stagger: 0.15 }, '.cards', 'top 80%');

  // --- 5. "How It Works" Steps (sequential) ---
  const steps  = gsap.utils.toArray('.step');
  const arrows = gsap.utils.toArray('.step__arrow');

  gsap.timeline({
    scrollTrigger: { trigger: '.steps', start: 'top 78%', once: true }
  })
    .from(steps[0],  { autoAlpha: 0, y: 30, duration: 0.65, ease: 'cv.premium' })
    .from(arrows[0], { autoAlpha: 0, x: -8, duration: 0.4,  ease: 'power2.out' }, '-=0.25')
    .from(steps[1],  { autoAlpha: 0, y: 30, duration: 0.65, ease: 'cv.premium' }, '-=0.15')
    .from(arrows[1], { autoAlpha: 0, x: -8, duration: 0.4,  ease: 'power2.out' }, '-=0.25')
    .from(steps[2],  { autoAlpha: 0, y: 30, duration: 0.65, ease: 'cv.premium' }, '-=0.15');

  // --- 6. "Who This Is For" ---
  gsap.timeline({
    scrollTrigger: { trigger: '#who', start: 'top 82%', once: true }
  })
    .from('.who__sub', { autoAlpha: 0, y: 16, duration: 0.6, ease: 'power2.out' })
    .from('.tag', {
      autoAlpha: 0, y: 12, scale: 0.94, duration: 0.5, ease: 'cv.premium', stagger: 0.07
    }, '-=0.3');

  // --- 7. Contact Form ---
  gsap.timeline({
    scrollTrigger: { trigger: '.form-wrap', start: 'top 80%', once: true }
  })
    .from('.form-wrap',   { autoAlpha: 0, y: 36, duration: 0.8, ease: 'cv.premium' })
    .from('.form__group', { autoAlpha: 0, y: 16, duration: 0.5, ease: 'power2.out', stagger: 0.1 }, '-=0.4')
    .from('#submit-btn',  { autoAlpha: 0, y: 12, duration: 0.5, ease: 'power2.out' }, '-=0.1');

  // --- 8. Footer ---
  scrollReveal('.footer__inner > *', { y: 12, duration: 0.5, stagger: 0.12 }, '.footer', 'top 95%');

}
