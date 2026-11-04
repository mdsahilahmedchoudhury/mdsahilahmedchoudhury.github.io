/**
 * Tiny, dependency-free HTML templating.
 *
 *   html`<p>${text}</p>`   – interpolated values are HTML-escaped
 *   raw(markup)            – marks a string as trusted markup (no escaping)
 *   inline(text)           – escapes text, then renders *asterisks* as <em>
 *
 * Pure functions only: the same templates run in the browser and in the
 * Node build script that pre-renders the page.
 */

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escape = (value) => String(value).replace(/[&<>"']/g, (ch) => ESCAPES[ch]);

class SafeHtml {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

export const raw = (value) => new SafeHtml(String(value));

const serialise = (value) => {
  if (value == null || value === false || value === true) return '';
  if (Array.isArray(value)) return value.map(serialise).join('');
  if (value instanceof SafeHtml) return value.value;
  return escape(value);
};

export const html = (strings, ...values) =>
  raw(strings.reduce((out, chunk, i) => out + chunk + (i < values.length ? serialise(values[i]) : ''), ''));

export const inline = (text = '') => raw(escape(text).replace(/\*([^*]+)\*/g, '<em>$1</em>'));

/** URL-safe slug, e.g. "Legal journalism" -> "legal-journalism". */
export const slug = (text) =>
  String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-');
