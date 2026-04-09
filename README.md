# Client Vectors

Static landing page for [Client Vectors](https://clientvectors.com) — custom websites for local businesses.

## Stack

- HTML5, CSS3, Vanilla JavaScript
- [GSAP 3.12.5](https://gsap.com/) (animations, ScrollTrigger, CustomEase)
- [Formspree](https://formspree.io/) (contact form submissions)

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure |
| `styles.css` | Styling and layout |
| `script.js` | Nav, smooth scroll, form handling |
| `animations.js` | GSAP scroll-triggered animations |
| `assets/` | Logo files (not tracked in git) |

## Setup

### 1. Add logo assets

Place the following files in the `assets/` directory:

- `assets/logo-horizontal.png` — used in nav and footer
- `assets/logo-mark.png` — used as the favicon

### 2. Configure Formspree

1. Create a form at [formspree.io](https://formspree.io/)
2. Copy your form ID (e.g. `xabcdefg`)
3. In `index.html`, replace `YOUR_FORM_ID` on the `<form>` action attribute:

```html
<form action="https://formspree.io/f/xabcdefg" ...>
```

## Running Locally

No build step required. Open `index.html` directly in a browser, or serve with any static server:

```bash
npx serve .
# or
python3 -m http.server
```

## Deployment

Deploy the root directory to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, etc.).

Checklist before going live:
- [ ] Formspree form ID is set in `index.html`
- [ ] Logo assets exist in `assets/`
- [ ] Test contact form submission end-to-end
