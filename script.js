/* ============================================
   CLIENT VECTORS — script.js
   ============================================ */

// --- Nav: add backdrop on scroll ---
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });


// --- Smooth scroll for all anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


// --- Contact form (Formspree AJAX) ---
const form      = document.getElementById('contact-form');
const statusEl  = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

if (form) {
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

    submitBtn.disabled     = true;
    submitBtn.textContent  = 'Sending…';
    setStatus('', '');

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        body:    data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.reset();
        setStatus("Thanks! I'll be in touch with your free website concept shortly.", 'success');
        submitBtn.textContent = 'Sent ✓';
      } else {
        const json = await res.json().catch(() => ({}));
        const msg  = json?.errors?.[0]?.message || 'Something went wrong. Please try again.';
        setStatus(msg, 'error');
        resetBtn();
      }
    } catch {
      setStatus('Something went wrong. Please try again or email us directly at louis@clientvectors.com.', 'error');
      resetBtn();
    }
  });
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
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
