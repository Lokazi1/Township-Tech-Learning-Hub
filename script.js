document.querySelectorAll('.flip-card').forEach(function(card){
  function toggle(){
    var on = card.classList.toggle('on');
    card.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  card.addEventListener('click', toggle);
  card.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(); }
  });
});
