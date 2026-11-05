/**
 * Page renderer — turns content/profile.js into HTML.
 *
 * Every function here is pure (data in, markup out) so the exact same code
 * pre-renders the page at build time (scripts/build.mjs) and, as a fallback,
 * renders it in the browser (assets/js/main.js).
 */
import { html, inline, raw, slug } from './html.js';
import { icon } from './icons.js';

/** Section registry: drives the navigation, numbering and contents table. */
export const SECTIONS = [
  { id: 'home', num: '00', label: 'Home' },
  { id: 'about', num: '01', label: 'About' },
  { id: 'experience', num: '02', label: 'Experience' },
  { id: 'research', num: '03', label: 'Research' },
  { id: 'publications', num: '04', label: 'Publications' },
  { id: 'education', num: '05', label: 'Education' },
  { id: 'contact', num: '06', label: 'Contact' },
];
const section = (id) => SECTIONS.find((s) => s.id === id);

/* ── helpers ──────────────────────────────────────────────────────────── */

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

const capitalise = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const countWord = (n) => (n < WORDS.length ? WORDS[n] : String(n));
const plural = (n, one, many) => `${capitalise(countWord(n))} ${n === 1 ? one : many}`;
const monthYear = (iso) => {
  const [y, m] = iso.split('-').map(Number);
  return { y, label: MONTHS[m - 1] };
};
const external = { target: '_blank', rel: 'noopener noreferrer' };
const newTab = html`<span class="sr-only"> (opens in a new tab)</span>`;

function dateSpan(entries) {
  const dates = entries.map((e) => e.date).filter(Boolean).sort();
  if (!dates.length) return '';
  const a = monthYear(dates[0]);
  const b = monthYear(dates[dates.length - 1]);
  if (dates[0] === dates[dates.length - 1]) return `${a.label} ${a.y}`;
  return a.y === b.y ? `${a.label} – ${b.label} ${b.y}` : `${a.label} ${a.y} – ${b.label} ${b.y}`;
}

const sectionHead = (id, title, kicker) => {
  const s = section(id);
  return html`
    <header class="section-head" data-reveal>
      <p class="section-head__index"><span class="sr-only">Section </span><span aria-hidden="true">§</span> ${s.num}</p>
      <h2 class="section-head__title" id="${id}-title">${title}</h2>
      ${kicker ? html`<p class="section-head__kicker">${kicker}</p>` : ''}
    </header>`;
};

const ongoingResearch = (data) => (data.research || []).find((r) => r.status === 'ongoing');

/* ── header & menu ────────────────────────────────────────────────────── */

export function renderHeader(data) {
  const { person } = data;
  return html`
    <header class="site-header" data-header>
      <div class="container site-header__inner">
        <a class="brand" href="#home" aria-label="${person.name} — back to top">
          <span class="brand__mark" aria-hidden="true">${person.monogram}</span>
          <span class="brand__name">${person.name}</span>
        </a>
        <nav class="nav" aria-label="Primary">
          <ul class="nav__list" data-nav-list>
            ${SECTIONS.map(
              (s) => html`<li><a class="nav__link" href="#${s.id}" data-nav="${s.id}"><span class="nav__num" aria-hidden="true">${s.num}</span>${s.label}</a></li>`
            )}
          </ul>
          <span class="nav__indicator" aria-hidden="true" data-nav-indicator></span>
        </nav>
        <div class="site-header__actions">
          <a class="btn btn--outline btn--small header-cv" href="${person.cv.file}" download="${person.cv.downloadName}">
            ${icon('download', { size: 16 })}<span>CV</span><span class="sr-only"> — download PDF</span>
          </a>
          <button class="icon-btn theme-toggle" type="button" data-theme-toggle aria-label="Switch to dark theme">
            ${icon('sun', { className: 'theme-toggle__sun' })}${icon('moon', { className: 'theme-toggle__moon' })}
          </button>
          <button class="icon-btn menu-toggle" type="button" data-menu-open aria-haspopup="dialog" aria-controls="mobile-menu" aria-expanded="false" aria-label="Open menu">
            ${icon('menu', { size: 20 })}
          </button>
        </div>
      </div>
      <div class="progress" aria-hidden="true"><span class="progress__bar" data-progress></span></div>
    </header>`;
}

export function renderMenu(data) {
  const { person } = data;
  return html`
    <dialog class="mobile-menu" id="mobile-menu" aria-label="Site menu" data-menu>
      <div class="mobile-menu__inner">
        <div class="mobile-menu__top">
          <span class="label">Contents</span>
          <button class="icon-btn" type="button" data-menu-close aria-label="Close menu">${icon('x', { size: 20 })}</button>
        </div>
        <ol class="mobile-menu__list">
          ${SECTIONS.map(
            (s, i) => html`<li style="--i:${i}"><a href="#${s.id}" data-nav="${s.id}"><span class="mobile-menu__num">§ ${s.num}</span><span class="mobile-menu__label">${s.label}</span></a></li>`
          )}
        </ol>
        <div class="mobile-menu__foot">
          <a class="link" href="mailto:${person.email}">${person.email}</a>
          <a class="btn btn--primary" href="${person.cv.file}" download="${person.cv.downloadName}">${icon('download', { size: 16 })} Download CV</a>
        </div>
      </div>
    </dialog>`;
}

/* ── hero ─────────────────────────────────────────────────────────────── */

function renderContents(data) {
  const ongoing = ongoingResearch(data);
  const notes = {
    about: 'Profile',
    experience: plural(data.experience.length, 'internship', 'internships'),
    research: ongoing ? 'Ongoing' : plural(data.research.length, 'project', 'projects'),
    publications: plural(data.publications.length, 'publication', 'publications'),
    education: 'Degree & achievements',
    contact: 'Write to me',
  };
  return html`
    <nav class="contents" aria-label="Contents">
      <p class="label contents__title">Contents</p>
      <ol class="contents__list">
        ${SECTIONS.filter((s) => s.id !== 'home').map(
          (s, i) => html`
            <li style="--i:${i}">
              <a href="#${s.id}">
                <span class="contents__num">${s.num}</span>
                <span class="contents__label">${s.label}</span>
                <span class="contents__leader" aria-hidden="true"></span>
                <span class="contents__note">${notes[s.id]}</span>
              </a>
            </li>`
        )}
      </ol>
    </nav>`;
}

function renderHero(data) {
  const { person } = data;
  const ongoing = ongoingResearch(data);
  return html`
    <section class="hero" id="home" aria-labelledby="hero-name">
      <div class="container">
        <div class="hero__meta">
          <p class="label">Portfolio <span aria-hidden="true">·</span> ${person.tagline}</p>
          ${ongoing
            ? html`<p class="status"><span class="status__dot" aria-hidden="true"></span><span class="status__key">Currently</span> ${ongoing.role}, ${ongoing.institution}</p>`
            : ''}
        </div>

        <h1 class="hero__name" id="hero-name">
          <span class="sr-only">${person.name}</span>
          ${person.nameLines.map(
            (line, i) => html`<span class="hero__line" aria-hidden="true"><span style="--i:${i}">${line}</span></span>`
          )}
        </h1>
        <div class="hero__rule" aria-hidden="true"></div>

        <div class="hero__grid">
          <div class="hero__main">
            <p class="hero__headline">${inline(person.headline)}</p>
            <p class="hero__intro">${person.intro}</p>
            <div class="hero__actions">
              <a class="btn btn--primary" href="#experience">Explore my work ${icon('arrow-down', { size: 16 })}</a>
              <a class="btn btn--outline" href="${person.cv.file}" ${raw(`target="${external.target}" rel="${external.rel}"`)}>View CV ${icon('arrow-up-right', { size: 16 })}${newTab}</a>
              <a class="btn btn--outline" href="mailto:${person.email}">${icon('mail', { size: 16 })} Email me</a>
              <a class="link-arrow hero__about" href="#about">About me ${icon('arrow-right', { size: 16 })}</a>
            </div>
            <ul class="tags hero__tags" aria-label="Areas of interest">
              ${person.interests.map((t, i) => html`<li class="tag" style="--i:${i}">${t}</li>`)}
            </ul>
          </div>
          <aside class="hero__aside">
            ${person.portrait
              ? html`<figure class="hero__portrait"><img src="${person.portrait.src}" alt="${person.portrait.alt}" decoding="async"></figure>`
              : ''}
            ${renderContents(data)}
          </aside>
        </div>
      </div>
    </section>`;
}

/* ── about ────────────────────────────────────────────────────────────── */

function renderAbout(data) {
  const { about, person } = data;
  return html`
    <section class="section" id="about" aria-labelledby="about-title">
      <div class="container section__grid">
        <span class="section__rule" aria-hidden="true" data-reveal></span>
        ${sectionHead('about', 'About', 'Profile & focus')}
        <div class="section__body">
          <p class="statement" data-reveal>${inline(about.statement)}</p>
          <div class="about">
            <div class="prose about__prose" data-reveal>
              ${about.paragraphs.map((p, i) => html`<p${i === 0 ? raw(' class="dropcap"') : ''}>${inline(p)}</p>`)}
            </div>
            <aside class="about__aside" data-reveal aria-label="Key facts">
              <dl class="facts">
                ${about.facts.map((f) => html`<div class="facts__row"><dt>${f.label}</dt><dd>${f.value}</dd></div>`)}
              </dl>
              <div class="about__links">
                <a class="link-arrow" href="${person.cv.file}" download="${person.cv.downloadName}">Download CV ${icon('download', { size: 16 })}</a>
                ${person.linkedin
                  ? html`<a class="link-arrow" href="${person.linkedin}" ${raw(`target="${external.target}" rel="${external.rel}"`)}>LinkedIn ${icon('arrow-up-right', { size: 16 })}${newTab}</a>`
                  : ''}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>`;
}

/* ── experience ───────────────────────────────────────────────────────── */

function renderExperience(data) {
  const items = data.experience;
  return html`
    <section class="section section--alt" id="experience" aria-labelledby="experience-title">
      <div class="container section__grid">
        <span class="section__rule" aria-hidden="true" data-reveal></span>
        ${sectionHead('experience', 'Experience', 'Practice, research & reporting')}
        <div class="section__body">
          <div class="xp-toolbar" data-reveal>
            <p class="xp-toolbar__summary">
              <span class="xp-toolbar__count">${plural(items.length, 'internship', 'internships')}</span>
              <span class="xp-toolbar__dates">${dateSpan(items)}</span>
            </p>
            <button class="text-btn" type="button" data-xp-all aria-pressed="false">
              <span data-xp-all-label>Expand all</span> ${icon('plus', { size: 16 })}
            </button>
          </div>
          <ol class="timeline">
            ${items.map((x, i) => {
              const id = `xp-${x.id}`;
              return html`
                <li class="xp" id="${id}" data-xp data-reveal style="--i:${i}">
                  <p class="xp__date"><time datetime="${x.date}">${x.period}</time></p>
                  <span class="xp__node" aria-hidden="true"></span>
                  <div class="xp__content">
                    <h3 class="xp__heading">
                      <button class="xp__trigger" type="button" id="${id}-trigger" aria-expanded="false" aria-controls="${id}-panel" data-xp-trigger>
                        <span class="xp__org">${x.organisation}</span>
                        <span class="xp__role">${x.role}<span class="xp__area"><span class="xp__sep" aria-hidden="true">·</span>${x.area}</span></span>
                        <span class="xp__icon" aria-hidden="true">${icon('plus', { size: 18 })}</span>
                      </button>
                    </h3>
                    <p class="xp__summary">${inline(x.summary)}</p>
                    <div class="xp__panel" id="${id}-panel" role="region" aria-labelledby="${id}-trigger" data-xp-panel>
                      <div class="xp__panel-inner">
                        <ul class="xp__list">${x.highlights.map((h) => html`<li>${inline(h)}</li>`)}</ul>
                        ${x.tags?.length ? html`<ul class="tags tags--quiet" aria-label="Focus areas">${x.tags.map((t) => html`<li class="tag">${t}</li>`)}</ul>` : ''}
                      </div>
                    </div>
                  </div>
                </li>`;
            })}
          </ol>
        </div>
      </div>
    </section>`;
}

/* ── research ─────────────────────────────────────────────────────────── */

function headnoteFigure() {
  // Decorative: an abstract law-report page whose headnote block "summarises" the judgment.
  const body = [236, 226, 244, 210, 238, 120, 0, 232, 246, 218, 240, 196];
  let y = 238;
  const lines = body
    .map((w, i) => {
      if (!w) {
        y += 8;
        return '';
      }
      const l = `<rect class="ln" style="--d:${i}" x="24" y="${y}" width="${w}" height="3" rx="1.5"/>`;
      y += 11;
      return l;
    })
    .join('');
  return raw(`
    <svg class="headnote-figure" viewBox="0 0 300 400" role="presentation" focusable="false">
      <rect class="pg" x="0.5" y="0.5" width="299" height="399" rx="2"/>
      <text class="tx" x="24" y="32">LAW REPORT</text>
      <rect class="ln ln--title" style="--d:0" x="60" y="52" width="180" height="5" rx="2.5"/>
      <rect class="ln ln--title" style="--d:1" x="90" y="64" width="120" height="5" rx="2.5"/>
      <g class="hn">
        <rect class="hn__bg" x="16" y="88" width="268" height="104" rx="2"/>
        <rect class="hn__bar" x="16" y="88" width="2" height="104"/>
        <text class="tx tx--accent" x="30" y="110">HEADNOTE</text>
        <rect class="ln ln--hn" style="--d:4" x="30" y="124" width="232" height="3" rx="1.5"/>
        <rect class="ln ln--hn" style="--d:5" x="30" y="136" width="244" height="3" rx="1.5"/>
        <rect class="ln ln--hn" style="--d:6" x="30" y="148" width="210" height="3" rx="1.5"/>
        <rect class="ln ln--hn" style="--d:7" x="30" y="160" width="226" height="3" rx="1.5"/>
        <rect class="ln ln--hn" style="--d:8" x="30" y="172" width="140" height="3" rx="1.5"/>
      </g>
      <line class="rl" x1="24" y1="208" x2="276" y2="208"/>
      <text class="tx" x="24" y="228">JUDGMENT</text>
      ${lines}
    </svg>`);
}

function renderResearch(data) {
  const items = data.research || [];
  return html`
    <section class="section section--band" id="research" aria-labelledby="research-title">
      <div class="container section__grid">
        <span class="section__rule" aria-hidden="true" data-reveal></span>
        ${sectionHead('research', 'Research', 'Projects & research engagements')}
        <div class="section__body">
          ${items.map((p, i) => {
            const ongoing = p.status === 'ongoing';
            return html`
              <article class="project${i === 0 ? ' project--feature' : ''}" data-reveal aria-labelledby="${p.id}-title">
                <div class="project__main">
                  <p class="status${ongoing ? '' : ' status--done'}">
                    <span class="status__dot" aria-hidden="true"></span>
                    <span class="status__key">${ongoing ? 'Ongoing' : 'Completed'}</span> ${p.period}
                  </p>
                  <h3 class="project__title" id="${p.id}-title">${p.title}</h3>
                  <p class="project__inst">${p.institution}${p.unit ? html` <span>— ${p.unit}</span>` : ''}</p>
                  ${p.description ? html`<p class="project__desc">${inline(p.description)}</p>` : ''}
                  <dl class="facts project__meta">
                    <div class="facts__row"><dt>Role</dt><dd>${p.role}</dd></div>
                    ${p.supervisor ? html`<div class="facts__row"><dt>Supervisor</dt><dd>${p.supervisor}</dd></div>` : ''}
                    <div class="facts__row"><dt>Duration</dt><dd>${p.period}</dd></div>
                  </dl>
                  ${p.link
                    ? html`<a class="link-arrow" href="${p.link}" ${raw(`target="${external.target}" rel="${external.rel}"`)}>Project page ${icon('arrow-up-right', { size: 16 })}${newTab}</a>`
                    : ''}
                </div>
                ${i === 0 && /headnote/i.test(p.title) ? html`<div class="project__figure" aria-hidden="true">${headnoteFigure()}</div>` : ''}
              </article>
              ${p.glossary
                ? html`
                  <aside class="glossary" data-reveal aria-label="Glossary">
                    <p class="label">Glossary</p>
                    <p class="glossary__term"><dfn>${p.glossary.term}</dfn> <span class="glossary__pos">${p.glossary.partOfSpeech}</span></p>
                    <p class="glossary__def">${inline(p.glossary.definition)}</p>
                  </aside>`
                : ''}`;
          })}
        </div>
      </div>
    </section>`;
}

/* ── publications ─────────────────────────────────────────────────────── */

function renderPublications(data) {
  const items = [...data.publications].sort((a, b) => (a.date < b.date ? 1 : -1));
  const types = [...new Set(items.map((p) => p.type))];
  const fmt = (iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    return `${d ? `${d} ` : ''}${MONTHS[m - 1].slice(0, 3)} ${y}`;
  };
  return html`
    <section class="section" id="publications" aria-labelledby="publications-title">
      <div class="container section__grid">
        <span class="section__rule" aria-hidden="true" data-reveal></span>
        ${sectionHead('publications', 'Publications', 'Writing & legal reporting')}
        <div class="section__body">
          ${types.length > 1
            ? html`
              <div class="filters" role="group" aria-label="Filter publications by type" data-reveal>
                <button class="filter" type="button" aria-pressed="true" data-filter="all">All</button>
                ${types.map((t) => html`<button class="filter" type="button" aria-pressed="false" data-filter="${slug(t)}">${t}</button>`)}
              </div>`
            : ''}
          <ol class="pubs" data-pubs>
            ${items.map(
              (p, i) => html`
                <li class="pub${p.url ? ' pub--link' : ''}" data-type="${slug(p.type)}" data-reveal style="--i:${i}">
                  <p class="pub__date"><time datetime="${p.date}" title="${p.dateLabel}">${fmt(p.date)}</time></p>
                  <div class="pub__body">
                    <p class="pub__meta"><span class="pub__outlet">${p.outlet}</span><span aria-hidden="true"> · </span>${p.type}</p>
                    <h3 class="pub__title">
                      ${p.url
                        ? html`<a href="${p.url}" ${raw(`target="${external.target}" rel="${external.rel}"`)}>${inline(p.title)}${newTab}</a>`
                        : inline(p.title)}
                    </h3>
                  </div>
                  <p class="pub__cta" aria-hidden="true">
                    ${p.url ? html`<span>Read</span>${icon('arrow-up-right', { size: 18 })}` : html`<span class="pub__pending">Link to follow</span>`}
                  </p>
                </li>`
            )}
          </ol>
        </div>
      </div>
    </section>`;
}

/* ── education, honours & skills ──────────────────────────────────────── */

function renderProgramme(e) {
  const years = e.endYear - e.startYear;
  if (!years || years > ROMAN.length) return '';
  const current = Math.min(Math.max(e.currentYear || 0, 0), years);
  return html`
    <figure class="programme" aria-label="Programme timeline: ${e.startYear} to ${e.endYear}, currently in year ${current} of ${years}.">
      <div class="programme__track" style="--n:${years}">
        ${Array.from({ length: years }, (_, i) => {
          const state = i + 1 < current ? 'done' : i + 1 === current ? 'current' : 'ahead';
          return html`<span class="programme__seg programme__seg--${state}" style="--i:${i}"><span class="programme__yr">Year ${ROMAN[i]}</span></span>`;
        })}
      </div>
      <div class="programme__ticks" aria-hidden="true" style="--n:${years}">
        ${Array.from({ length: years + 1 }, (_, i) => html`<span>${e.startYear + i}</span>`)}
      </div>
      <figcaption class="programme__caption">Year ${ROMAN[current - 1] || current} of ${ROMAN[years - 1]}</figcaption>
    </figure>`;
}

function renderEducation(data) {
  const kindIcon = (k = '') => (/research/i.test(k) ? 'scroll-text' : /moot/i.test(k) ? 'award' : 'medal');
  const n = data.achievements.length;
  const honourCols = n === 1 ? 1 : n % 3 === 0 ? 3 : 2;
  return html`
    <section class="section section--alt" id="education" aria-labelledby="education-title">
      <div class="container section__grid">
        <span class="section__rule" aria-hidden="true" data-reveal></span>
        ${sectionHead('education', 'Education', 'Degree, achievements & skills')}
        <div class="section__body">
          ${data.education.map((e) => {
            const [whole, frac] = String(e.grade).match(/[\d.]+/)?.[0].split('.') || [];
            return html`
              <div class="edu" data-reveal>
                <div class="edu__main">
                  <p class="label">Degree</p>
                  <h3 class="edu__inst">${e.institution}</h3>
                  <p class="edu__degree">${e.degree}</p>
                </div>
                <dl class="edu__meta">
                  <div><dt>Duration</dt><dd class="edu__figure">${e.period}</dd></div>
                  ${e.grade
                    ? html`<div><dt>CGPA</dt><dd class="edu__figure">${whole ? html`${whole}<span class="edu__frac">.${frac}</span><span class="edu__of"> / 10</span>` : e.grade}${e.gradeNote ? html`<small>${e.gradeNote}</small>` : ''}</dd></div>`
                    : ''}
                </dl>
                ${renderProgramme(e)}
              </div>`;
          })}

          <div class="subsection" data-reveal>
            <h3 class="subsection__title"><span class="label">Moots &amp; achievements</span></h3>
            <ul class="honours" style="--cols:${honourCols}">
              ${data.achievements.map(
                (a, i) => html`
                  <li class="honour" style="--i:${i}">
                    <span class="honour__icon" aria-hidden="true">${icon(kindIcon(a.kind), { size: 20 })}</span>
                    <p class="honour__title">${a.title}</p>
                    <p class="honour__event">${a.event}</p>
                    <p class="honour__host">${a.host}</p>
                  </li>`
              )}
            </ul>
          </div>

          <div class="subsection" data-reveal>
            <h3 class="subsection__title"><span class="label">Skills &amp; interests</span></h3>
            <div class="skills">
              ${data.skills.map(
                (g, gi) => html`
                  <div class="skill-group" style="--i:${gi}">
                    <h4 class="skill-group__title"><span class="skill-group__num" aria-hidden="true">${ROMAN[gi].toLowerCase()}.</span> ${g.group}</h4>
                    <ul class="chips">
                      ${g.items.map((s) => {
                        const ref = s.ref && data.experience.find((x) => x.id === s.ref);
                        return ref
                          ? html`<li><a class="chip chip--link" href="#xp-${ref.id}" data-xp-open="${ref.id}" title="Applied at ${ref.organisation}">${s.name}${icon('arrow-up-right', { size: 14 })}<span class="sr-only"> — see experience at ${ref.organisation}</span></a></li>`
                          : html`<li><span class="chip">${s.name}</span></li>`;
                      })}
                    </ul>
                  </div>`
              )}
            </div>
            ${data.skills.some((g) => g.items.some((s) => s.ref))
              ? html`<p class="skills__note">${icon('arrow-up-right', { size: 14 })} Linked skills open the experience in which they were applied.</p>`
              : ''}
          </div>
        </div>
      </div>
    </section>`;
}

/* ── contact ──────────────────────────────────────────────────────────── */

function renderContact(data) {
  const { person, contact } = data;
  return html`
    <section class="section section--contact" id="contact" aria-labelledby="contact-title">
      <div class="container section__grid">
        <span class="section__rule" aria-hidden="true" data-reveal></span>
        ${sectionHead('contact', 'Contact', 'Correspondence')}
        <div class="section__body">
          <p class="statement statement--large" data-reveal>${inline(contact.heading)}</p>
          <div class="contact">
            <div class="contact__direct" data-reveal>
              <p class="contact__text">${inline(contact.text)}</p>
              <div class="email-block">
                <p class="label">Email</p>
                <a class="email-block__address" href="mailto:${person.email}">${person.email}</a>
                <div class="email-block__actions">
                  <a class="btn btn--primary" href="mailto:${person.email}">${icon('mail', { size: 16 })} Email directly</a>
                  <button class="btn btn--outline" type="button" data-copy="${person.email}" data-copy-label="Email address copied">
                    <span class="copy-icon">${icon('copy', { size: 16 })}${icon('check', { size: 16 })}</span><span data-copy-text>Copy address</span>
                  </button>
                </div>
              </div>
              <ul class="contact__links">
                ${person.linkedin
                  ? html`<li><a class="link-arrow" href="${person.linkedin}" ${raw(`target="${external.target}" rel="${external.rel}"`)}>LinkedIn ${icon('arrow-up-right', { size: 16 })}${newTab}</a></li>`
                  : ''}
                <li><a class="link-arrow" href="${person.cv.file}" ${raw(`target="${external.target}" rel="${external.rel}"`)}>View CV ${icon('arrow-up-right', { size: 16 })}${newTab}</a></li>
                <li><a class="link-arrow" href="${person.cv.file}" download="${person.cv.downloadName}">Download CV ${icon('download', { size: 16 })}</a></li>
              </ul>
            </div>

            <form class="compose" data-contact-form data-to="${person.email}" action="mailto:${person.email}" method="post" enctype="text/plain" novalidate data-reveal aria-labelledby="compose-title">
              <div class="compose__head">
                <p class="compose__title" id="compose-title">${icon('pen-line', { size: 16 })} Compose a message</p>
                <p class="compose__to"><span class="label">To</span> ${person.email}</p>
              </div>
              <div class="compose__body">
                <div class="compose__row">
                  <div class="field">
                    <label for="cf-name">Your name</label>
                    <input id="cf-name" name="name" type="text" autocomplete="name" required maxlength="100" aria-describedby="cf-name-error">
                    <p class="field__error" id="cf-name-error" data-error-for="name"></p>
                  </div>
                  <div class="field">
                    <label for="cf-email">Your email</label>
                    <input id="cf-email" name="email" type="email" autocomplete="email" inputmode="email" required maxlength="160" aria-describedby="cf-email-error">
                    <p class="field__error" id="cf-email-error" data-error-for="email"></p>
                  </div>
                </div>
                <div class="field">
                  <label for="cf-subject">Subject</label>
                  <input id="cf-subject" name="subject" type="text" required maxlength="150" aria-describedby="cf-subject-error">
                  <p class="field__error" id="cf-subject-error" data-error-for="subject"></p>
                </div>
                <div class="field">
                  <label for="cf-message">Message</label>
                  <textarea id="cf-message" name="message" rows="6" required maxlength="1500" aria-describedby="cf-message-error cf-message-count"></textarea>
                  <div class="field__foot">
                    <p class="field__error" id="cf-message-error" data-error-for="message"></p>
                    <p class="field__count" id="cf-message-count"><span data-count>0</span> / 1500</p>
                  </div>
                </div>
              </div>
              <div class="compose__foot">
                <button class="btn btn--primary btn--large" type="submit">${icon('send', { size: 16 })} Open in my email app</button>
                <p class="compose__note">
                  This opens your own email application with the message addressed to me and ready to send. Nothing is sent or stored by this website.
                </p>
              </div>
              <div class="compose__status" role="status" aria-live="polite" data-form-status></div>
            </form>
          </div>
        </div>
      </div>
    </section>`;
}

/* ── footer ───────────────────────────────────────────────────────────── */

export function renderFooter(data) {
  const { person, site } = data;
  const year = new Date().getFullYear();
  return html`
    <footer class="site-footer">
      <div class="container">
        <div class="site-footer__top">
          <p class="site-footer__name">${person.name}</p>
          <p class="site-footer__tag">${person.tagline}</p>
        </div>
        <div class="site-footer__grid">
          <nav aria-label="Footer">
            <p class="label">Sections</p>
            <ul class="site-footer__list">
              ${SECTIONS.filter((s) => s.id !== 'home').map((s) => html`<li><a class="link" href="#${s.id}">${s.label}</a></li>`)}
            </ul>
          </nav>
          <div>
            <p class="label">Elsewhere</p>
            <ul class="site-footer__list">
              <li><a class="link" href="mailto:${person.email}">${person.email}</a></li>
              ${person.linkedin ? html`<li><a class="link" href="${person.linkedin}" ${raw(`target="${external.target}" rel="${external.rel}"`)}>LinkedIn${newTab}</a></li>` : ''}
              <li><a class="link" href="${person.cv.file}" download="${person.cv.downloadName}">Download CV</a></li>
            </ul>
          </div>
          <div class="colophon">
            <p class="label">Colophon</p>
            <p>Set in Newsreader, Instrument Sans and IBM Plex Mono. Hand-built and published on GitHub Pages.</p>
          </div>
        </div>
        <div class="site-footer__bottom">
          <p>© <span data-year>${year}</span> ${person.name}${site.updated ? html` <span aria-hidden="true">·</span> Last updated ${site.updated}` : ''}</p>
          <a class="link-arrow" href="#home">Back to top ${icon('arrow-up', { size: 16 })}</a>
        </div>
      </div>
    </footer>`;
}

/* ── page ─────────────────────────────────────────────────────────────── */

export function renderMain(data) {
  return html`${renderHero(data)}${renderAbout(data)}${renderExperience(data)}${renderResearch(data)}${renderPublications(data)}${renderEducation(data)}${renderContact(data)}`;
}

export function renderJsonLd(data) {
  const { person, site, education } = data;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    url: site.url,
    email: `mailto:${person.email}`,
    description: person.intro,
    affiliation: education[0] ? { '@type': 'CollegeOrUniversity', name: education[0].institution } : undefined,
    knowsAbout: person.interests,
    sameAs: person.linkedin ? [person.linkedin] : undefined,
  };
  return JSON.stringify(ld).replace(/</g, '\\u003c');
}

/** All page slots, keyed by the data-slot attribute they fill in index.html. */
export function renderSlots(data) {
  return {
    header: String(renderHeader(data)),
    main: String(renderMain(data)),
    footer: String(renderFooter(data)),
    menu: String(renderMenu(data)),
  };
}
