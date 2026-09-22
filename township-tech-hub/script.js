function initFlipCards(root) {
  root = root || document;
  root.querySelectorAll('.flip-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var on = card.classList.toggle('on');
      card.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  });
}

if (typeof document !== 'undefined') {
  initFlipCards();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initFlipCards };
}
