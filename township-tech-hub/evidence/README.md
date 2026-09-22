# Evidence — Township Tech Learning Hub QA

Screenshots referenced from `QA_TESTING.md`. Each one is real output from actually running the site/tests, not a mockup.

| File | What it shows | Ties to |
|---|---|---|
| `01-site-desktop-full.png` | Full page, rendered at desktop width (1280px), current build | Manual visual check |
| `02-site-mobile-full.png` | Full page, rendered at mobile width (390px) — confirms responsive layout | Manual visual check |
| `03-flip-card-toggled-state.png` | The first mindset card in its "flipped" state (`.on` class active, shows the empowering line in gold) next to the other three still in their default state | Proves the interactive JS behavior actually works, ties to unit tests in `tests/flipCards.test.js` |
| `04-terminal-tests-passing.png` | `npm test` output — 2 test suites, 14 tests, all passing | QA_TESTING.md §3 (all test tables) |
| `05-terminal-lint-clean.png` | `npx html-validate index.html` on the current build — 0 errors | QA_TESTING.md §3.1 |
| `06-terminal-lint-BEFORE-fix.png` | The same lint command run against the *original* markup (`<div role="button">` cards), reproduced separately without touching the delivered files — 4 errors | QA_TESTING.md finding **F-001** |

## Note on fonts

Screenshots 01–03 were rendered in a sandboxed environment with no internet access to Google Fonts, so they show the system fallback fonts rather than Fraunces/IBM Plex Sans. Layout, color, spacing and interactivity are otherwise exactly what a browser with normal internet access renders. Worth grabbing a real-browser screenshot too if your demo wants the fonts visible.
