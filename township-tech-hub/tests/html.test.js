const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

describe('index.html structure (regression tests)', () => {
  test('links to the external styles.css and script.js', () => {
    expect(html).toMatch(/href="styles\.css"/);
    expect(html).toMatch(/src="script\.js"/);
  });

  test('has exactly one h1 (single clear page heading)', () => {
    const matches = html.match(/<h1[\s>]/g) || [];
    expect(matches.length).toBe(1);
  });

  test('contains exactly 4 mindset flip cards', () => {
    const matches = html.match(/class="flip-card"/g) || [];
    expect(matches.length).toBe(4);
  });

  test('every <section> has a top-level heading (h1 for the hero, h2 elsewhere)', () => {
    const sections = html.match(/<section[\s\S]*?<\/section>/g) || [];
    expect(sections.length).toBeGreaterThan(0);
    sections.forEach((section) => {
      expect(section).toMatch(/<h1|<h2/);
    });
  });

  test('declares a mobile-safe viewport meta tag', () => {
    expect(html).toMatch(/<meta name="viewport" content="[^"]*width=device-width[^"]*"/);
  });

  test('flip cards are native, keyboard-accessible <button> elements', () => {
    const cards = html.match(/<button[^>]*class="flip-card"[^>]*>/g) || [];
    expect(cards.length).toBe(4);
    cards.forEach((tag) => {
      expect(tag).toMatch(/type="button"/);
    });
  });

  test('the hero CTA and journey section are linked by anchor id', () => {
    expect(html).toMatch(/href="#learn"/);
    expect(html).toMatch(/id="learn"/);
  });
});
