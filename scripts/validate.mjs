#!/usr/bin/env node
/**
 * Content validation — run before every build and deployment.
 *
 *   node scripts/validate.mjs
 *
 * Catches the common mistakes made while editing content/profile.js:
 * missing fields, malformed dates or links, duplicate ids, a missing CV file,
 * and skills that point to an experience entry that does not exist.
 */
import { access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (where, message) => errors.push(`${where}: ${message}`);

let data;
try {
  ({ default: data } = await import(pathToFileURL(join(ROOT, 'content/profile.js')).href));
} catch (error) {
  console.error('✗ content/profile.js could not be read. This is usually a missing comma, quote or bracket.\n');
  console.error(error.message);
  process.exit(1);
}

const isText = (v) => typeof v === 'string' && v.trim().length > 0;
const isUrl = (v) => {
  try {
    return ['https:', 'http:'].includes(new URL(v).protocol);
  } catch {
    return false;
  }
};
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const DAY = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

const require = (obj, fields, where) => {
  if (!obj || typeof obj !== 'object') return fail(where, 'is missing');
  for (const f of fields) if (!isText(obj[f])) fail(where, `"${f}" is required`);
};

// person
const p = data.person;
require(p, ['name', 'tagline', 'headline', 'intro', 'email'], 'person');
if (p) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email || '')) fail('person.email', 'is not a valid email address');
  if (!Array.isArray(p.nameLines) || !p.nameLines.length) fail('person.nameLines', 'must list at least one line');
  if (p.linkedin && !isUrl(p.linkedin)) fail('person.linkedin', 'must be a full https:// link (or empty)');
  if (!p.cv?.file) fail('person.cv.file', 'is required');
  else {
    try {
      await access(join(ROOT, p.cv.file));
    } catch {
      fail('person.cv.file', `file not found: ${p.cv.file}`);
    }
  }
  if (p.portrait) {
    if (!isText(p.portrait.alt)) fail('person.portrait.alt', 'describe the image for screen-reader users');
    try {
      await access(join(ROOT, p.portrait.src));
    } catch {
      fail('person.portrait.src', `file not found: ${p.portrait.src}`);
    }
  }
}

// about
require(data.about, ['statement'], 'about');
if (!Array.isArray(data.about?.paragraphs) || !data.about.paragraphs.length) fail('about.paragraphs', 'add at least one paragraph');

// experience
const ids = new Set();
(data.experience || []).forEach((x, i) => {
  const where = `experience[${i}]${x?.organisation ? ` (${x.organisation})` : ''}`;
  require(x, ['id', 'organisation', 'role', 'period', 'date', 'area', 'summary'], where);
  if (x?.id && !/^[a-z0-9-]+$/.test(x.id)) fail(where, '"id" may only contain lowercase letters, numbers and hyphens');
  if (x?.id && ids.has(x.id)) fail(where, `duplicate id "${x.id}"`);
  ids.add(x?.id);
  if (x?.date && !MONTH.test(x.date)) fail(where, '"date" must look like 2026-06');
  if (!Array.isArray(x?.highlights) || !x.highlights.length) fail(where, 'add at least one highlight');
});

// research
(data.research || []).forEach((r, i) => {
  const where = `research[${i}]${r?.title ? ` (${r.title})` : ''}`;
  require(r, ['id', 'status', 'title', 'institution', 'role', 'period'], where);
  if (r && !['ongoing', 'completed'].includes(r.status)) fail(where, '"status" must be "ongoing" or "completed"');
  if (r?.link && !isUrl(r.link)) fail(where, '"link" must be a full https:// link (or empty)');
});

// publications
(data.publications || []).forEach((pub, i) => {
  const where = `publications[${i}]${pub?.title ? ` ("${pub.title.slice(0, 40)}…")` : ''}`;
  require(pub, ['title', 'outlet', 'type', 'date', 'dateLabel'], where);
  if (pub?.date && !(DAY.test(pub.date) || MONTH.test(pub.date))) fail(where, '"date" must look like 2026-03-02');
  if (pub?.url && !isUrl(pub.url)) fail(where, '"url" must be a full https:// link (or empty)');
});

// education
(data.education || []).forEach((e, i) => {
  require(e, ['institution', 'degree', 'period'], `education[${i}]`);
  if (e && !(e.endYear > e.startYear)) fail(`education[${i}]`, '"endYear" must be after "startYear"');
});

// achievements
(data.achievements || []).forEach((a, i) => require(a, ['title', 'event'], `achievements[${i}]`));

// skills
(data.skills || []).forEach((g, i) => {
  require(g, ['group'], `skills[${i}]`);
  (g?.items || []).forEach((s, j) => {
    if (!isText(s?.name)) fail(`skills[${i}].items[${j}]`, '"name" is required');
    if (s?.ref && !ids.has(s.ref)) fail(`skills[${i}].items[${j}] (${s.name})`, `"ref" points to unknown experience id "${s.ref}"`);
  });
});

require(data.contact, ['heading', 'text'], 'contact');

if (errors.length) {
  console.error(`✗ content/profile.js has ${errors.length} problem${errors.length === 1 ? '' : 's'}:\n`);
  errors.forEach((e) => console.error(`  • ${e}`));
  process.exit(1);
}
console.log(
  `✓ Content valid — ${data.experience.length} experience, ${data.research.length} research, ` +
    `${data.publications.length} publications, ${data.achievements.length} achievements.`
);
