# Township Tech Learning Hub

A single-page website concept for **Township Tech Learning Hub** — a non-profit idea for giving Black children in township communities a way through technology education to imagine, and build, a life beyond the system that townships in South Africa were designed to keep people confined to.

## About the project

Township Tech Learning Hub isn't just an online-learning platform. It's built around a simple belief: **where you start doesn't have to determine where you finish.**

Townships were never designed for Black people to flourish. This project is one small way of pushing back against that — by giving young people in those communities real access to technology, real skills, and a way to see themselves as builders and creators, not just consumers, of the digital world. It's about helping people let go of the idea that they're bound to stay in the place the system placed them, and start believing in a life beyond it.

The focus for now is tech education — computers, the web, programming, cybersecurity. Longer-term, the idea extends beyond tech alone, into other kinds of skills-based programs (business included) that help people build a way out and a way forward.

This repository holds the front-end prototype of that idea, plus the QA process (tests, lint, CI) built around it.

## Files

```
index.html                    Page structure and content
styles.css                    All visual styling
script.js                     Interactive "mindset" flip cards
package.json                  Test/lint scripts and dependencies
tests/html.test.js            Structure & regression tests
tests/flipCards.test.js       Unit + exception tests for the flip-card logic
QA_TESTING.md                 QA test plan, results and findings
.github/workflows/ci.yml      CI pipeline (runs lint + tests on every push/PR)
```

## Running it

No build step or server needed. Keep all three files in the same folder, then open `index.html` in any browser (double-click it, or drag it into a browser window).

If you want to serve it locally instead (e.g. to test on your phone over local wifi):

```bash
# from the folder containing index.html
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in a browser.

## Page sections

1. **Hero** — headline, sub-line, and an SVG illustration of township rooftops transitioning into circuit lines.
2. **Why We Exist** — the gap the hub addresses, framed as "what's missing" vs. "what's already here."
3. **Break the Cycle** — four click-to-flip cards that turn a limiting belief into an empowering one.
4. **Your Journey** — the five-stage learner progression (Computer Explorer → Technology Creator).
5. **Curriculum** — the six learning modules, from computer basics through to a final portfolio project.
6. **Call to action / footer** — closing motto and a link back to the journey section.

## Customizing

- **Colors, type, spacing** — all defined in `styles.css`; the core palette is set as CSS custom properties (`--night`, `--gold`, `--coral`, `--paper`) at the top of the file, so changing those four values re-themes the whole page.
- **Copy** — all text lives directly in `index.html`; edit it in place.
- **Flip cards** — each card's "before" and "after" text is in the `.flip-card` blocks in `index.html`; the flip behavior itself is in `script.js` and needs no changes to add more cards, as long as they keep the `.flip-card` / `.old` / `.new` structure.

## QA: tests & pipeline

This project is tested before anything is pushed:

```bash
npm install
npm run lint:html   # HTML lint (html-validate)
npm test            # Jest: structure/regression + unit + exception tests
```

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs both automatically on every push and pull request to `main` — so a broken build shows up as a failed check, not a surprise later. Full test plan, individual test cases, and findings (including one accessibility issue found and fixed during this pass) are documented in [`QA_TESTING.md`](./QA_TESTING.md).

## Notes

This is a front-end-only prototype (no backend, no database, no real course content or accounts). It's meant as a visual and messaging foundation to build on — next steps would typically include real learner sign-in, actual lesson content, and the progress/badge tracking described in the original concept but not yet built here.


WTC-VBLZWR6A
