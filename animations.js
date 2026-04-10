/* ============================================
   CLIENT VECTORS — animations.js
   V3 Motion Pass — GSAP + ScrollTrigger
   ============================================ */

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create('cv.premium', 'M0,0 C0.16,1 0.3,1 1,1');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile             = window.matchMedia('(max-width: 768px)').matches;


// ============================================
// HERO ENTRANCE — runs after prelude exits
// ============================================
function runHeroEntrance() {

  const headlineEl = document.querySelector('.hero__headline');

  // Restore container visibility before splitting —
  // autoAlpha: 0 on the parent suppresses child animations even when children animate in
  gsap.set(headlineEl, { autoAlpha: 1 });

  // Split into word spans for clip reveal
  headlineEl.innerHTML = headlineEl.textContent.trim().split(/\s+/).map(w =>
    `<span class="word-outer"><span class="word-inner">${w}</span></span>`
  ).join(' ');

  const s = document.createElement('style');
  s.textContent = `.word-outer{display:inline-block;overflow:hidden;vertical-align:bottom}.word-inner{display:inline-block}`;
  document.head.appendChild(s);

  // Set words to clipped starting position, then animate up
  gsap.set('.word-inner', { y: '115%' });

  gsap.timeline()
    .to('.word-inner',    { y: '0%', duration: 0.75, ease: 'cv.premium', stagger: 0.055 })
    .fromTo('.hero__sub',
      { autoAlpha: 0, filter: 'blur(10px)', y: 16 },
      { autoAlpha: 1, filter: 'blur(0px)',  y: 0, duration: 0.85, ease: 'power3.out' }, 0.5)
    .fromTo('.nav .btn--sm',
      { autoAlpha: 0, x: 8 },
      { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power2.out' }, 0.8)
    .fromTo('.hero .btn--lg',
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.4, ease: 'cv.premium' }, 1.5)
    .fromTo('.hero__visual',
      isMobile ? { autoAlpha: 0, y: 16 }              : { autoAlpha: 0, y: 16, filter: 'blur(8px)' },
      isMobile ? { autoAlpha: 1, y: 0, duration: 0.85, ease: 'cv.premium' } : { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.85, ease: 'cv.premium' }, 1.55);
}


// ============================================
// REDUCED MOTION — skip everything, show all
// ============================================
if (prefersReducedMotion) {
  document.getElementById('prelude').style.display = 'none';
  document.body.style.overflow = '';
  gsap.set([
    '.hero__headline', '.hero__sub', '.hero .btn--lg', '.nav .btn--sm',
    '.hero__visual', '.showcase__label', '.showcase__headline', '.showcase__sub',
    '.showcase__caption', '.showcase__devices',
    '.problem-band__headline', '.problem-band__body',
    '.section__title', '.card', '.step', '.step__arrow',
    '#who .section__sub', '.audience-card', '.form-wrap', '.form__group', '#submit-btn',
    '.footer__inner > *'
  ], { autoAlpha: 1, y: 0, x: 0, scale: 1, filter: 'none' });

} else {

  // Hide hero elements immediately — prevents flash before prelude exits
  gsap.set(['.hero__headline', '.hero__sub', '.hero .btn--lg', '.nav .btn--sm', '.hero__visual'], { autoAlpha: 0 });

  // Explicitly hide all scroll-animated elements before first paint.
  // gsap.from() immediateRender is not guaranteed to beat the browser paint on mobile —
  // this gsap.set() ensures elements are invisible from the start on all devices.
  gsap.set([
    '.section__title', '.card', '.step', '.step__arrow',
    '.showcase__label', '.showcase__headline', '.showcase__sub', '.showcase__caption', '.showcase__devices',
    '.problem-band__headline', '.problem-band__body',
    '#who .section__sub', '.audience-card',
    '.form-wrap', '.form__group',
    '.footer__inner > *'
  ], { autoAlpha: 0 });

  // Lock scroll during prelude
  document.body.style.overflow = 'hidden';


  // ============================================
  // STAR FIELD — built and animated in JS
  // ============================================
  const starsEl   = document.querySelector('.prelude__stars');
  const cx        = window.innerWidth  / 2;
  const cy        = window.innerHeight / 2;
  const starCount = 70;

  const stars = Array.from({ length: starCount }, () => {
    const el     = document.createElement('span');
    const size   = gsap.utils.random(1, 3.5, true)();
    const x      = gsap.utils.random(0, window.innerWidth,  true)();
    const y      = gsap.utils.random(0, window.innerHeight, true)();
    const isBlue = Math.random() > 0.35;

    gsap.set(el, {
      position: 'absolute',
      width: size, height: size,
      borderRadius: '50%',
      x, y,
      autoAlpha: 0,
      backgroundColor: isBlue
        ? `rgba(77,126,255,${gsap.utils.random(0.5, 1, true)()})`
        : `rgba(220,220,255,${gsap.utils.random(0.3, 0.7, true)()})`,
      boxShadow: isBlue
        ? `0 0 ${size * 3}px rgba(77,126,255,0.9)`
        : `0 0 ${size * 2}px rgba(200,200,255,0.6)`,
    });

    starsEl.appendChild(el);
    return { el, x, y };
  });


  // ============================================
  // PRELUDE TIMELINE
  // ============================================
  const preludeTl = gsap.timeline({
    onComplete: () => {
      document.body.style.overflow = '';
      document.getElementById('prelude').style.display = 'none';
      // rAF lets the browser settle the layout change (prelude removal) before
      // ScrollTrigger recalculates all trigger positions — critical on mobile
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        runHeroEntrance();
      });
    }
  });

  preludeTl
    // Logo fades up into center
    .from('.prelude__logo', {
      autoAlpha: 0, y: 28, duration: 1.0, ease: 'cv.premium'
    }, 0.5)
    // Accent bar draws outward from center
    .to('.prelude__bar', {
      scaleX: 1, duration: 0.7, ease: 'power3.inOut'
    }, 1.2)
    // Stars drift in — staggered from random positions
    .to(stars.map(s => s.el), {
      autoAlpha: 1, duration: 0.6,
      stagger: { each: 0.018, from: 'random' },
      ease: 'power2.out'
    }, 1.6)
    // Hold — let the scene breathe
    // Snap scroll to top while panels still cover the viewport — invisible to the user
    .call(() => window.scrollTo(0, 0), [], 3.3)
    // Curtain panels split apart
    .to('.prelude__panel--top',    { yPercent: -100, duration: 1.05, ease: 'power3.inOut' }, 3.3)
    .to('.prelude__panel--bottom', { yPercent:  100, duration: 1.05, ease: 'power3.inOut' }, 3.3)
    // Center fades as panels leave
    .to('.prelude__center', { autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, 3.4);

  // Stars dissipate radially outward — added as separate tweens at t=3.3
  stars.forEach(({ el, x, y }) => {
    const dx    = x - cx;
    const dy    = y - cy;
    const dist  = Math.sqrt(dx * dx + dy * dy) || 100;
    const reach = gsap.utils.random(120, 260, true)();
    preludeTl.to(el, {
      x:        x + (dx / dist) * reach,
      y:        y + (dy / dist) * reach,
      autoAlpha: 0,
      duration:  gsap.utils.random(0.5, 0.95, true)(),
      ease:      'power2.out'
    }, 3.3);
  });


  // ============================================
  // SCROLL REVEALS
  // ============================================

  // Section titles — blur-snap on desktop, clean y-reveal on mobile
  gsap.utils.toArray('.section__title').forEach(title => {
    gsap.fromTo(title,
      isMobile ? { autoAlpha: 0, y: 12 } : { autoAlpha: 0, filter: 'blur(3px)' },
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'cv.premium',
        scrollTrigger: { trigger: title, start: 'top 85%', once: true } }
    );
  });

  // "What We Do" cards
  gsap.from('.card', {
    autoAlpha: 0, y: 10, duration: 0.65, ease: 'power2.out', stagger: 0.1,
    scrollTrigger: { trigger: '.cards', start: isMobile ? 'top 90%' : 'top 82%', once: true }
  });

  // "The Work" showcase
  gsap.timeline({
    scrollTrigger: { trigger: '.showcase', start: isMobile ? 'top 90%' : 'top 78%', once: true }
  })
    .from('.showcase__label',    { autoAlpha: 0, y: 10, duration: 0.45, ease: 'power2.out' })
    .fromTo('.showcase__headline',
      isMobile ? { autoAlpha: 0, y: 12 } : { autoAlpha: 0, filter: 'blur(3px)' },
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'cv.premium' }, '-=0.15')
    .from('.showcase__sub',      { autoAlpha: 0, y: 10, duration: 0.45, ease: 'power2.out' }, '-=0.15')
    .from('.showcase__caption',  { autoAlpha: 0, duration: 0.35, ease: 'power2.out' }, '-=0.1')
    .fromTo('.showcase__devices',
      isMobile ? { autoAlpha: 0, y: 24 } : { autoAlpha: 0, y: 24, filter: 'blur(4px)' },
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'cv.premium' }, '-=0.6');

  // Problem Statement Band
  gsap.timeline({
    scrollTrigger: { trigger: '.problem-band__headline', start: 'top 85%', once: true }
  })
    .fromTo('.problem-band__headline',
      isMobile ? { autoAlpha: 0, y: 12 } : { autoAlpha: 0, filter: 'blur(3px)' },
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'cv.premium' })
    .from('.problem-band__body',     { autoAlpha: 0, y: 10, duration: 0.45, ease: 'power2.out' }, '-=0.1');

  // "How It Works"
  const steps  = gsap.utils.toArray('.step');
  const arrows = gsap.utils.toArray('.step__arrow');

  if (isMobile) {
    // On mobile arrows are display:none — skip them and stagger steps cleanly
    gsap.from(steps, {
      autoAlpha: 0, y: 24, duration: 0.6, ease: 'cv.premium', stagger: 0.18,
      scrollTrigger: { trigger: '.steps', start: 'top 90%', once: true }
    });
  } else {
    gsap.timeline({
      scrollTrigger: { trigger: '.steps', start: 'top 78%', once: true }
    })
      .from(steps[0],  { autoAlpha: 0, y: 30, duration: 0.65, ease: 'cv.premium' })
      .from(arrows[0], { autoAlpha: 0, x: -8, duration: 0.4,  ease: 'power2.out' }, '-=0.25')
      .from(steps[1],  { autoAlpha: 0, y: 30, duration: 0.65, ease: 'cv.premium' }, '-=0.15')
      .from(arrows[1], { autoAlpha: 0, x: -8, duration: 0.4,  ease: 'power2.out' }, '-=0.25')
      .from(steps[2],  { autoAlpha: 0, y: 30, duration: 0.65, ease: 'cv.premium' }, '-=0.15');
  }

  // "Who This Is For"
  gsap.timeline({
    scrollTrigger: { trigger: '#who', start: isMobile ? 'top 90%' : 'top 80%', once: true }
  })
    .from('#who .section__sub', { autoAlpha: 0, y: 16, duration: 0.6, ease: 'power2.out' })
    .from('.audience-card', {
      autoAlpha: 0, y: 30, scale: 0.97, duration: 0.7, ease: 'cv.premium', stagger: 0.12
    }, '-=0.25');

  // Contact form
  gsap.timeline({
    scrollTrigger: { trigger: '.form-wrap', start: isMobile ? 'top 90%' : 'top 80%', once: true }
  })
    .from('.form-wrap',   { autoAlpha: 0, y: 36, duration: 0.8, ease: 'cv.premium' })
    .from('.form__group', { autoAlpha: 0, y: 16, duration: 0.5, ease: 'power2.out', stagger: 0.1 }, '-=0.4');

  // Footer
  gsap.from('.footer__inner > *', {
    autoAlpha: 0, y: 12, duration: 0.5, ease: 'power2.out', stagger: 0.12,
    scrollTrigger: { trigger: '.footer', start: 'top 95%', once: true }
  });

}
