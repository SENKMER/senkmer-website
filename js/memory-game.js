// Minnespill for Senkmer (norsk)
(function(){
  'use strict';

  const memoryGame = document.getElementById('memory-game');
  if(!memoryGame) return;

  const symbols = ['🎮','🏆','⭐','🎯','🎨','🎲','🎪','🎭'];
  let cards = [...symbols, ...symbols];
  let flipped = [];
  let matched = [];
  let moves = 0;

  function shuffle(arr){
    for(let i=arr.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]] = [arr[j],arr[i]];
    }
    return arr;
  }

  function createCard(symbol, index){
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.innerHTML = `<div class="card-inner"><div class="card-front">?</div><div class="card-back">${symbol}</div></div>`;
    card.addEventListener('click', ()=>flipCard(card));
    return card;
  }

  function flipCard(card){
    if(flipped.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    flipped.push(card);
    if(flipped.length === 2){
      moves++;
      document.getElementById('memory-moves').textContent = moves;
      checkMatch();
    }
  }

  function checkMatch(){
    const [card1, card2] = flipped;
    if(card1.dataset.symbol === card2.dataset.symbol){
      card1.classList.add('matched');
      card2.classList.add('matched');
      matched.push(card1, card2);
      flipped = [];
      if(matched.length === cards.length){
        setTimeout(()=>{
          alert(`Gratulerer! Du fullførte spillet på ${moves} trekk! +100 XP`);
          if(window.confetti) window.confetti(memoryGame);
        }, 500);
      }
    } else {
      setTimeout(()=>{
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        flipped = [];
      }, 1000);
    }
  }

  function initGame(){
    memoryGame.innerHTML = '';
    cards = shuffle([...symbols, ...symbols]);
    flipped = [];
    matched = [];
    moves = 0;
    document.getElementById('memory-moves').textContent = moves;
    cards.forEach((symbol,index)=>{
      memoryGame.appendChild(createCard(symbol,index));
    });
  }

  const resetBtn = document.getElementById('reset-memory');
  if(resetBtn) resetBtn.addEventListener('click', initGame);

  initGame();

})();
