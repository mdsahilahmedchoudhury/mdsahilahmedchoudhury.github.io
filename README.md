# Md Sahil Ahmed Choudhury — Portfolio

Personal portfolio website · **Law, Policy & Technology**

**Live site:** https://mdsahilahmedchoudhury.github.io/

A hand-built, editorial-style single-page site. It has no framework and no runtime dependencies, so it loads fast and there is little to maintain. Every piece of content lives in one file, [`content/profile.js`](content/profile.js).

---

## Updating the website

Almost every change is an edit to **`content/profile.js`**. You can do it directly on GitHub:

1. Open [`content/profile.js`](content/profile.js) on GitHub and click the ✏️ **Edit** button.
2. Make your change, then click **Commit changes**.
3. The site rebuilds and republishes automatically in about a minute (watch the **Actions** tab).

If something in the file is malformed, the deployment stops before publishing and the Actions log names the exact problem. The live site is never broken by a typo.

### Common edits

| To… | Do this in `content/profile.js` |
| --- | --- |
| **Add an internship** | Copy an entry in `experience`, paste it at the **top** of the list (newest first), and give it a new unique `id`. |
| **Add a publication** | Add an entry to `publications` with `title`, `outlet`, `type`, `date` (`'2026-03-02'`), `dateLabel` and `url`. Leave `url: ''` if no authentic link exists yet; the entry will show "Link to follow". Using a new `type` (e.g. `'Research paper'`) automatically adds filter buttons. |
| **Add a research project** | Add an entry to `research`. Use `status: 'ongoing'` or `'completed'`. |
| **Add an achievement** | Add an entry to `achievements`. |
| **Update CGPA / year** | Edit `education[0].grade`, `gradeNote` and `currentYear` (the programme timeline updates itself). |
| **Add a skill** | Add `{ name: '…' }` to a group in `skills`. Add `ref: '<experience id>'` to link it to the internship where it was used. |
| **Add a portrait** | Put an image in `assets/img/` (e.g. `portrait.jpg`, roughly 4:5 portrait) and set `portrait: { src: 'assets/img/portrait.jpg', alt: 'Portrait of Md Sahil Ahmed Choudhury' }`. |
| **Replace the CV** | Upload the new PDF to `assets/documents/` with the same name (`CV-MdSahilAhmedChoudhury.pdf`), or change `person.cv.file`. |

**Formatting tips:** wrap a phrase in `*asterisks*` to set it in italics (for example a case name). If your text contains an apostrophe, use the typographic ’ or wrap the text in double quotes.

### Page title and link previews

The browser title, search description and social-preview text are in the `<head>` of [`index.html`](index.html). The preview image is `assets/img/og-image.png` (1200 × 630).

---

## Working locally (optional)

Requires [Node.js](https://nodejs.org/) 18 or newer. There is nothing to install.

```bash
npm run dev       # preview the site at http://localhost:5173
npm run build     # validate content and build the production site into dist/
npm run preview   # build, then serve dist/ at http://localhost:5173
npm run validate  # check content/profile.js only
```

---

## How it works

```
content/profile.js        ← all content (edit this)
index.html                ← page shell: <head> metadata, slots for content
assets/js/render.js       ← turns the content into HTML (pure functions)
assets/js/main.js         ← interactions: navigation, theme, timeline, contact form…
assets/js/html.js         ← tiny escaping/templating helper
assets/js/icons.js        ← Lucide icon subset
assets/css/styles.css     ← design system and layout
assets/fonts/             ← self-hosted, subset web fonts (+ licences)
assets/documents/         ← the CV (original, unchanged)
scripts/                  ← build, validation and local server (no dependencies)
.github/workflows/        ← GitHub Pages deployment
```

* **Build:** `scripts/build.mjs` pre-renders every section into `index.html`, so the published page is complete HTML. It is fast to display, readable by search engines, and works without JavaScript. The repository root also works as a site by itself, rendering in the browser.
* **Deployment:** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) validates and builds on every push. Pushes to the default branch are published with GitHub's official Pages actions.
* **Contact form:** GitHub Pages is static hosting with no server, so the form builds a `mailto:` link. The visitor's own email app opens with the recipient, subject and message filled in, and the visitor sends it. Nothing is stored or sent by the website.
* **Theme:** the site opens in its light ivory, navy and brass theme. The moon/sun button offers an optional dark reading mode, which is remembered for that visitor.

### Features

Sticky numbered navigation with active-section highlighting · scroll progress bar · optional dark mode (remembered) · expandable experience timeline with "Expand all" · skills that link to the internship where they were applied · publication list with authentic external links (and automatic type filters) · CV view and download · contact form that opens the visitor's email app · direct-email and copy-address buttons with confirmation · back-to-top button · responsive from 320 px phones to wide desktops · keyboard and screen-reader friendly · reduced-motion support · print styles · SEO, Open Graph and structured data.

---

## Credits

* Typefaces: [Newsreader](https://github.com/productiontype/Newsreader), [Instrument Sans](https://github.com/Instrument/instrument-sans) and [IBM Plex Mono](https://github.com/IBM/plex), all under the SIL Open Font License (see `assets/fonts/`).
* Icons: [Lucide](https://lucide.dev) (ISC License).

Content © Md Sahil Ahmed Choudhury. All rights reserved.
