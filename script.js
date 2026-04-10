/* ============================================
   CLIENT VECTORS — script.js
   ============================================ */

// Prevent browser from restoring scroll position on reload —
// prelude always plays at the top of the page
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const CONFIG = {
  NAV_SCROLL_THRESHOLD: 20,
  NAV_OFFSET_PADDING:   16,
  BTN_RESET_DELAY:      3000
};

// --- Nav: add backdrop on scroll ---
const nav = document.getElementById('nav');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > CONFIG.NAV_SCROLL_THRESHOLD);
  }, { passive: true });
}


// --- Smooth scroll for all anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = nav ? nav.offsetHeight + CONFIG.NAV_OFFSET_PADDING : CONFIG.NAV_OFFSET_PADDING;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


// --- Contact form (Formspree AJAX) ---
const form      = document.getElementById('contact-form');
const statusEl  = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

if (form && statusEl && submitBtn) {
  let formAbortController = null;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const data     = new FormData(form);
    const name     = (data.get('name')     || '').trim();
    const business = (data.get('business') || '').trim();
    const email    = (data.get('email')    || '').trim();

    // Basic validation
    if (!name || !business || !email) {
      setStatus('Please fill in your name, business name, and email.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      setStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Cancel any in-flight request before starting a new one
    if (formAbortController) {
      formAbortController.abort();
    }
    formAbortController = new AbortController();

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';
    setStatus('', '');

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        body:    data,
        headers: { 'Accept': 'application/json' },
        signal:  formAbortController.signal
      });

      if (res.ok) {
        form.reset();
        setStatus("Thanks! Our team will be in touch with your free website concept shortly.", 'success');
        submitBtn.textContent = 'Sent ✓';
        setTimeout(() => resetBtn(), CONFIG.BTN_RESET_DELAY);
      } else {
        const json = await res.json().catch(() => ({}));
        const msg  = json?.errors?.[0]?.message || 'Something went wrong. Please try again.';
        setStatus(msg, 'error');
        resetBtn();
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Form submission failed:', error);
      setStatus('Something went wrong. Please try again or email us directly at contact@clientvectors.com.', 'error');
      resetBtn();
    }
  });
} else {
  console.warn('Contact form elements missing from DOM');
}

function setStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className   = 'form__status' + (type ? ` form__status--${type}` : '');
}

function resetBtn() {
  submitBtn.disabled    = false;
  submitBtn.textContent = 'Get a Free Website Concept';
}

function isValidEmail(email) {
  const emailInput = document.getElementById('email');
  if (emailInput?.validity !== undefined) {
    return emailInput.validity.valid;
  }
  // Fallback for environments without HTML5 constraint validation
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
}
