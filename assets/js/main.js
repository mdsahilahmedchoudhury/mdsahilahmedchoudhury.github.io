/**
 * Entry point.
 * 1. If the page was not pre-rendered by the build, render it from content/profile.js.
 * 2. Wire up every interaction. No framework, no dependencies.
 */

const root = document.documentElement;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

async function renderIfNeeded() {
  if (root.hasAttribute('data-prerendered')) return;
  const [{ default: data }, { renderSlots, renderJsonLd }] = await Promise.all([
    import('../../content/profile.js'),
    import('./render.js'),
  ]);
  for (const [name, markup] of Object.entries(renderSlots(data))) {
    const slot = $(`[data-slot="${name}"]`);
    if (slot) slot.innerHTML = markup;
  }
  const ld = $('script[data-slot="jsonld"]');
  if (ld) ld.textContent = renderJsonLd(data);
}

/* ── theme ────────────────────────────────────────────────────────────── */

function initTheme() {
  const button = $('[data-theme-toggle]');
  const meta = $$('meta[name="theme-color"]');
  const apply = (theme, persist) => {
    root.dataset.theme = theme;
    if (persist) {
      try {
        localStorage.setItem('theme', theme);
      } catch {
        /* storage unavailable: preference lasts for this visit only */
      }
    }
    const next = theme === 'dark' ? 'light' : 'dark';
    button?.setAttribute('aria-label', `Switch to ${next} theme`);
    const colour = getComputedStyle(root).getPropertyValue('--paper').trim();
    meta.forEach((m) => m.setAttribute('content', colour));
  };
  apply(root.dataset.theme === 'dark' ? 'dark' : 'light', false);

  button?.addEventListener('click', () => {
    root.classList.add('theme-transition');
    apply(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
    window.setTimeout(() => root.classList.remove('theme-transition'), 500);
  });
}

/* ── scroll: progress, header state, active section, back-to-top ──────── */

function initScroll() {
  const header = $('[data-header]');
  const bar = $('[data-progress]');
  const toTop = $('[data-to-top]');
  const footer = $('.site-footer');
  const indicator = $('[data-nav-indicator]');
  const list = $('[data-nav-list]');
  const links = $$('a[data-nav]');
  const sections = $$('main > section[id]');
  let active = null;
  let ticking = false;

  const moveIndicator = () => {
    if (!indicator || !list) return;
    const link = list.querySelector('.nav__link[aria-current="true"]');
    if (!link || !link.offsetParent) {
      indicator.style.opacity = '0';
      return;
    }
    indicator.style.opacity = '1';
    indicator.style.setProperty('--x', `${link.offsetLeft}px`);
    indicator.style.setProperty('--w', `${link.offsetWidth}px`);
  };

  const setActive = (id) => {
    if (id === active) return;
    active = id;
    links.forEach((a) => {
      if (a.dataset.nav === id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    moveIndicator();
  };

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    if (bar) bar.style.transform = `scaleX(${progress})`;
    header?.classList.toggle('is-scrolled', y > 8);
    // Show back-to-top once the visitor has scrolled; hide it again when the footer
    // (which has its own "Back to top" link) comes into view, so it never covers text.
    const footerInView = footer ? footer.getBoundingClientRect().top < window.innerHeight - 40 : false;
    toTop?.classList.toggle('is-visible', y > window.innerHeight * 0.9 && !footerInView);

    // The active section is the last one whose top has passed 35% of the viewport.
    const line = window.innerHeight * 0.35;
    let current = sections[0]?.id;
    for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s.id;
    if (max > 0 && y >= max - 2) current = sections[sections.length - 1]?.id;
    setActive(current);
  };

  const request = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', () => {
    request();
    moveIndicator();
  });
  document.fonts?.ready.then(moveIndicator);
  update();

  toTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
    $('.brand')?.focus({ preventScroll: true });
  });
}

/* ── reveal on scroll ─────────────────────────────────────────────────── */

function initReveal() {
  const items = $$('[data-reveal]');
  if (!('IntersectionObserver' in window) || reducedMotion()) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  items.forEach((el) => io.observe(el));
  root.classList.add('reveal-ready');
}

/* ── experience timeline ──────────────────────────────────────────────── */

function initTimeline() {
  const entries = $$('[data-xp]');
  const all = $('[data-xp-all]');
  const allLabel = $('[data-xp-all-label]');
  if (!entries.length) return;

  const setOpen = (entry, open) => {
    entry.classList.toggle('is-open', open);
    $('[data-xp-trigger]', entry).setAttribute('aria-expanded', String(open));
  };
  const sync = () => {
    const allOpen = entries.every((e) => e.classList.contains('is-open'));
    all?.setAttribute('aria-pressed', String(allOpen));
    if (allLabel) allLabel.textContent = allOpen ? 'Collapse all' : 'Expand all';
  };

  entries.forEach((entry) => {
    $('[data-xp-trigger]', entry).addEventListener('click', () => {
      setOpen(entry, !entry.classList.contains('is-open'));
      sync();
    });
  });
  all?.addEventListener('click', () => {
    const open = !entries.every((e) => e.classList.contains('is-open'));
    entries.forEach((e) => setOpen(e, open));
    sync();
  });

  // Links elsewhere on the page (skills) and URL hashes can open a specific entry.
  const openFromHash = (hash) => {
    const entry = hash && hash.startsWith('#xp-') ? document.getElementById(hash.slice(1)) : null;
    if (!entry || !entry.matches('[data-xp]')) return;
    setOpen(entry, true);
    sync();
    entry.classList.remove('is-flash');
    void entry.offsetWidth; // restart the highlight animation
    entry.classList.add('is-flash');
  };
  $$('[data-xp-open]').forEach((link) => link.addEventListener('click', () => openFromHash(link.getAttribute('href'))));
  window.addEventListener('hashchange', () => openFromHash(location.hash));
  openFromHash(location.hash);
}

/* ── publication filters (shown only when there is more than one type) ─ */

function initFilters() {
  const buttons = $$('[data-filter]');
  const items = $$('[data-pubs] > li');
  buttons.forEach((btn) =>
    btn.addEventListener('click', () => {
      const type = btn.dataset.filter;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      items.forEach((li) => {
        li.hidden = type !== 'all' && li.dataset.type !== type;
      });
    })
  );
}

/* ── clipboard & toast ────────────────────────────────────────────────── */

let toastTimer;
function toast(message) {
  const el = $('[data-toast]');
  if (!el) return;
  $('[data-toast-text]', el).textContent = message;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2600);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers without the async clipboard API (or non-secure contexts).
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {}
    area.remove();
    return ok;
  }
}

function initCopy() {
  document.addEventListener('click', async (event) => {
    const btn = event.target.closest('[data-copy]');
    if (!btn) return;
    const value = btn.dataset.copy;
    const ok = await copyText(value);
    const label = $('[data-copy-text]', btn);
    if (ok) {
      toast(btn.dataset.copyLabel || 'Copied');
      btn.classList.add('is-copied');
      if (label) label.textContent = 'Copied';
      setTimeout(() => {
        btn.classList.remove('is-copied');
        if (label) label.textContent = 'Copy address';
      }, 2200);
    } else {
      toast(`Copy failed — the address is ${value}`);
    }
  });
}

/* ── contact form → mailto ────────────────────────────────────────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Build a RFC 6068 mailto: URL. Line breaks are encoded as CRLF (%0D%0A). */
export function buildMailto(to, { name, email, subject, message }) {
  const crlf = (s) => s.replace(/\r?\n/g, '\r\n');
  const body = crlf(`Name: ${name}\nEmail: ${email}\n\n${message}\n`);
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function initContactForm() {
  const form = $('[data-contact-form]');
  if (!form) return;
  const status = $('[data-form-status]', form);
  const count = $('[data-count]', form);
  const message = form.elements.message;

  const rules = {
    name: (v) => (v ? '' : 'Please enter your name.'),
    email: (v) => (!v ? 'Please enter your email address.' : EMAIL_RE.test(v) ? '' : 'Please enter a valid email address, e.g. name@example.com.'),
    subject: (v) => (v ? '' : 'Please add a subject.'),
    message: (v) => (v ? '' : 'Please write a message.'),
  };

  const validate = (field) => {
    const error = rules[field.name](field.value.trim());
    const out = $(`[data-error-for="${field.name}"]`, form);
    field.setAttribute('aria-invalid', String(Boolean(error)));
    field.closest('.field').classList.toggle('is-invalid', Boolean(error));
    if (out) out.textContent = error;
    return !error;
  };

  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    field.addEventListener('blur', () => field.value && validate(field));
    field.addEventListener('input', () => field.getAttribute('aria-invalid') === 'true' && validate(field));
  });
  const updateCount = () => count && (count.textContent = String(message.value.length));
  message.addEventListener('input', updateCount);
  updateCount();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = Object.keys(rules).map((n) => form.elements[n]);
    const results = fields.map(validate);
    const firstInvalid = fields[results.indexOf(false)];
    if (firstInvalid) {
      firstInvalid.focus();
      status.className = 'compose__status is-error';
      status.textContent = 'Please complete the highlighted fields.';
      return;
    }
    const values = Object.fromEntries(fields.map((f) => [f.name, f.value.trim()]));
    const to = form.dataset.to;
    window.location.href = buildMailto(to, values);
    status.className = 'compose__status is-info';
    status.innerHTML = '';
    const p = document.createElement('p');
    p.textContent =
      'Your email application should now open with this message addressed to me. Nothing has been sent yet — please review it and press Send there. If no email app opened, you can copy my address instead: ';
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'inline-btn';
    copy.dataset.copy = to;
    copy.dataset.copyLabel = 'Email address copied';
    copy.textContent = to;
    p.append(copy, '.');
    status.append(p);
  });
}

/* ── mobile menu (native <dialog>: focus trap & Escape built in) ──────── */

function initMenu() {
  const dialog = $('[data-menu]');
  const openBtn = $('[data-menu-open]');
  if (!dialog || !openBtn || typeof dialog.showModal !== 'function') return;

  const open = () => {
    dialog.showModal();
    openBtn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => dialog.classList.add('is-open'));
  };
  const close = (immediate = false) => {
    openBtn.setAttribute('aria-expanded', 'false');
    dialog.classList.remove('is-open');
    if (immediate || reducedMotion()) dialog.close();
    else setTimeout(() => dialog.open && dialog.close(), 250);
  };

  openBtn.addEventListener('click', open);
  $('[data-menu-close]', dialog)?.addEventListener('click', () => close());
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
  // Close synchronously so the page can scroll to the chosen section.
  $$('a', dialog).forEach((a) => a.addEventListener('click', () => close(true)));
  window.matchMedia('(min-width: 68.01rem)').addEventListener('change', (e) => e.matches && dialog.open && close(true));
}

/* ── boot ─────────────────────────────────────────────────────────────── */

async function boot() {
  await renderIfNeeded();
  const year = $('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
  initTheme();
  initScroll();
  initReveal();
  initTimeline();
  initFilters();
  initCopy();
  initContactForm();
  initMenu();
  window.__portfolioReady = true;
}

boot().catch((error) => {
  console.error(error);
  root.classList.add('reveal-fallback');
});
