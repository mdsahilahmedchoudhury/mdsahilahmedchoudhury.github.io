#!/usr/bin/env node
/**
 * Production build (no dependencies).
 *
 *   node scripts/build.mjs
 *
 * 1. Pre-renders every section from content/profile.js into index.html, so the
 *    published page is complete HTML (fast first paint, crawlable, works
 *    without JavaScript).
 * 2. Copies the public files into dist/ and generates sitemap.xml.
 *
 * The repository root is itself a working site (rendered in the browser), so
 * GitHub Pages can also serve it directly from a branch if ever needed.
 */
import { cp, mkdir, readFile, rm, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

const { default: data } = await import(pathToFileURL(join(ROOT, 'content/profile.js')).href);
const { renderSlots, renderJsonLd } = await import(pathToFileURL(join(ROOT, 'assets/js/render.js')).href);

const PUBLIC = [
  'assets',
  'content',
  '404.html',
  'favicon.ico',
  'favicon.svg',
  'apple-touch-icon.png',
  'site.webmanifest',
  'robots.txt',
  '.nojekyll',
];

const fill = (page, name, markup) => {
  const marker = new RegExp(`(<(div|main)\\b[^>]*data-slot="${name}"[^>]*>)(</\\2>)`);
  if (!marker.test(page)) throw new Error(`Slot "${name}" not found in index.html`);
  return page.replace(marker, (_, open, _tag, close) => `${open}${markup}${close}`);
};

async function hashOf(path) {
  return createHash('sha256').update(await readFile(path)).digest('hex').slice(0, 10);
}

async function main() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  for (const entry of PUBLIC) {
    const from = join(ROOT, entry);
    try {
      await stat(from);
    } catch {
      throw new Error(`Missing public file: ${entry}`);
    }
    await cp(from, join(DIST, entry), { recursive: true });
  }

  let page = await readFile(join(ROOT, 'index.html'), 'utf8');
  const slots = renderSlots(data);
  for (const [name, markup] of Object.entries(slots)) page = fill(page, name, markup);

  page = page
    // Mark the document as pre-rendered so the browser skips client rendering.
    .replace('<html lang="en-IN">', '<html lang="en-IN" data-prerendered>')
    .replace(
      /<script type="application\/ld\+json" data-slot="jsonld"><\/script>/,
      `<script type="application/ld+json">${renderJsonLd(data)}</script>`
    )
    // The no-JavaScript notice is unnecessary once the content is in the HTML.
    .replace(/\s*<!--noscript:start-->[\s\S]*?<!--noscript:end-->/, '');

  // Cache-bust the stylesheet and entry script.
  const cssHash = await hashOf(join(ROOT, 'assets/css/styles.css'));
  const jsHash = await hashOf(join(ROOT, 'assets/js/main.js'));
  page = page
    .replace('href="assets/css/styles.css"', `href="assets/css/styles.css?v=${cssHash}"`)
    .replace('src="assets/js/main.js"', `src="assets/js/main.js?v=${jsHash}"`);

  await writeFile(join(DIST, 'index.html'), page);

  const today = new Date().toISOString().slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${data.site.url}</loc>
    <lastmod>${today}</lastmod>
  </url>
</urlset>
`;
  await writeFile(join(DIST, 'sitemap.xml'), sitemap);

  const kb = (Buffer.byteLength(page) / 1024).toFixed(1);
  console.log(`✓ Built dist/ — index.html ${kb} KB, ${Object.keys(slots).length} slots pre-rendered.`);
}

main().catch((error) => {
  console.error(`✗ Build failed: ${error.message}`);
  process.exit(1);
});
