/**
 * @jest-environment jsdom
 */
const { initFlipCards } = require('../script.js');

function renderCard() {
  document.body.innerHTML = `
    <button type="button" class="flip-card" aria-pressed="false">
      <span class="old">before</span>
      <span class="new">after</span>
    </button>
  `;
}

describe('flip card interaction (unit tests)', () => {
  beforeEach(() => {
    renderCard();
    initFlipCards();
  });

  test('starts in the default (off) state', () => {
    const card = document.querySelector('.flip-card');
    expect(card.classList.contains('on')).toBe(false);
    expect(card.getAttribute('aria-pressed')).toBe('false');
  });

  test('click toggles the "on" class and aria-pressed', () => {
    const card = document.querySelector('.flip-card');
    card.click();
    expect(card.classList.contains('on')).toBe(true);
    expect(card.getAttribute('aria-pressed')).toBe('true');

    card.click();
    expect(card.classList.contains('on')).toBe(false);
    expect(card.getAttribute('aria-pressed')).toBe('false');
  });

  test('is a native <button>, so Enter/Space activation is a browser guarantee (no custom key handling needed)', () => {
    const card = document.querySelector('.flip-card');
    expect(card.tagName).toBe('BUTTON');
    expect(card.getAttribute('type')).toBe('button');
  });
});

describe('flip card interaction (exception / negative tests)', () => {
  beforeEach(() => {
    renderCard();
    initFlipCards();
  });

  test('does not throw when there are zero .flip-card elements on the page', () => {
    document.body.innerHTML = '<p>No cards here</p>';
    expect(() => initFlipCards()).not.toThrow();
  });

  test('does not throw when initFlipCards is called twice on the same DOM (double init)', () => {
    expect(() => initFlipCards()).not.toThrow();
    const card = document.querySelector('.flip-card');
    card.click();
    expect(['true', 'false']).toContain(card.getAttribute('aria-pressed'));
  });

  test('falls back to document when no root is passed', () => {
    expect(() => initFlipCards(undefined)).not.toThrow();
  });

  test('scoping to a detached root does not affect cards outside it', () => {
    const outside = document.querySelector('.flip-card');
    const detached = document.createElement('div');
    detached.innerHTML = '<button type="button" class="flip-card" aria-pressed="false"><span class="old">x</span><span class="new">y</span></button>';
    initFlipCards(detached);
    detached.querySelector('.flip-card').click();
    expect(outside.getAttribute('aria-pressed')).toBe('false');
  });
});
