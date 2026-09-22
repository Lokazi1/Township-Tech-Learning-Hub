# QA Test Plan & Findings — Township Tech Learning Hub

**Project:** Township Tech Learning Hub (marketing/concept site)
**Type:** Static front-end (HTML/CSS/JS, no backend)
**Tester:** [your name]
**Last run:** results below were captured from a real local run of the suite, not projected.

## 1. Scope

What's under test:
- `index.html` — page structure, semantics, accessibility markers
- `styles.css` — not directly unit-tested (visual output is reviewed manually), but exercised indirectly by structure tests
- `script.js` — the one piece of interactive logic on the site: the "mindset" flip cards

Out of scope for this pass: cross-browser visual regression, performance/Lighthouse budget, real backend (there isn't one yet).

## 2. Test strategy

| Layer | Tool | What it catches |
|---|---|---|
| Static HTML lint | `html-validate` | Invalid markup, bad practice (e.g. wrong element for the job), broken semantics |
| Structure / regression tests | Jest + string/DOM assertions on `index.html` | Someone accidentally deleting a section, breaking the CSS/JS link, breaking the CTA anchor, losing accessibility attributes |
| Unit tests | Jest + jsdom | The flip-card toggle logic in isolation |
| Exception / negative tests | Jest + jsdom | Behavior when inputs are missing or malformed: no cards on the page, no root passed, double-initialization, irrelevant input |

Reasoning for including exception tests specifically: a script that only works in the "happy path" (exactly 4 cards, initialized once, on the real `document`) is a bug waiting to happen the next time this template gets reused or duplicated for another page. Testing the boundaries first (TDD-style) is what caught issue **F-001** below.

## 3. Test cases and results

### 3.1 HTML lint (`npm run lint:html`)

| Case | Expected | Result |
|---|---|---|
| Run `html-validate` against `index.html` | Zero errors | **Pass** (after fix, see Findings) |

### 3.2 Structure / regression tests (`tests/html.test.js`)

| Case | Expected | Result |
|---|---|---|
| Page links to external `styles.css` and `script.js` | Both `<link>`/`<script>` tags present | Pass |
| Exactly one `<h1>` on the page | 1 | Pass |
| Exactly 4 mindset flip cards present | 4 | Pass |
| Every `<section>` has a top-level heading | h1 for hero, h2 elsewhere | Pass |
| Viewport meta tag declared for mobile | Present, `width=device-width` | Pass |
| Flip cards are native `<button>` elements | `type="button"` on all 4 | Pass |
| Hero CTA anchor (`#learn`) matches the journey section's `id` | Match | Pass |

### 3.3 Unit tests — flip card logic (`tests/flipCards.test.js`)

| Case | Expected | Result |
|---|---|---|
| Card starts un-toggled | `aria-pressed="false"`, no `.on` class | Pass |
| Click toggles on, click again toggles off | State flips both ways | Pass |
| Card is a native `<button>` | Browser handles Enter/Space for free | Pass |

### 3.4 Exception / negative tests

| ID | Case | Expected | Result |
|---|---|---|---|
| — | `initFlipCards()` called against a page with zero `.flip-card` elements | No error thrown | Pass |
| — | `initFlipCards()` called twice on the same DOM (double init) | No error; `aria-pressed` still a valid boolean string | Pass |
| — | `initFlipCards()` called with no `root` argument | Falls back to `document`, no error | Pass |
| — | `initFlipCards(scopedElement)` on a detached subtree | Only cards inside that subtree are affected | Pass |

**All 14 automated tests passing** as of this run (`Test Suites: 2 passed, 2 total · Tests: 14 passed, 14 total`).

## 4. Findings

### F-001 — Flip cards used `<div role="button" tabindex="0">` instead of a native `<button>`
- **Severity:** Medium (accessibility)
- **Tool:** `html-validate`, rule `prefer-native-element`
- **Detail:** The interactive mindset cards were built as `<div>`s with ARIA and manual `keydown` handling for Enter/Space, duplicating behavior a native `<button>` gives for free — and more fragile (easy to miss a key case, as seen when the div version needed explicit `e.preventDefault()` on Space to stop the page from scrolling).
- **Fix:** Replaced with native `<button type="button">`. Removed the manual `keydown` listener from `script.js` entirely, since real browsers handle Enter/Space activation on buttons natively. Re-styled via CSS (`border:none`, `width:100%`, `text-align:left`, `font:inherit`) to keep the same visual card.
- **Status:** Fixed and covered by regression test (`html.test.js`) and lint (now 0 errors).

## 5. Known gaps / backlog

- No automated cross-browser or visual regression testing yet (manual check in Chrome/Firefox/Safari recommended before each release).
- No accessibility audit beyond `html-validate`'s structural rules — a full `axe-core`/`pa11y` pass would be the natural next addition.
- `styles.css` has no automated tests; visual changes are reviewed by eye.
- No performance/Lighthouse budget defined yet.

## 6. How to run this locally

```bash
npm install
npm run lint:html   # static HTML lint
npm test            # Jest unit + regression + exception tests
```

CI (`.github/workflows/ci.yml`) runs both of the above automatically on every push and pull request to `main`, so nothing merges without passing lint and tests.
