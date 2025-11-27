// XP og spill-system for Senkmer (frontend-only demo, norsk)
(function(){
  'use strict';

  // Quiz-data (norsk)
  const quizData = [
    {q:'Hva er hovedmålet med Senkmer?', opts:['Lære','Spille','Både lære og spille','Shopping'], a:2},
    {q:'Hvordan tjener du XP?', opts:['Ved å fullføre moduler','Ved å kjøpe ting','Ved å dele på sosiale medier','Ved å vente'], a:0},
    {q:'Hva betyr "streak"?', opts:['Antall dager på rad','Totalt antall poeng','Nivå','Antall venner'], a:0}
  ];

  let quizState = {index:0, score:0, active:false};

  const startBtn = document.getElementById('start-quiz');
  const resetBtn = document.getElementById('reset-quiz');
  const qQuestion = document.getElementById('quiz-question');
  const qOptions = document.getElementById('quiz-options');
  const qScore = document.getElementById('quiz-score');

  if(!startBtn) return; // hvis ikke på spill-siden

  startBtn.addEventListener('click', startQuiz);
  resetBtn && resetBtn.addEventListener('click', resetQuiz);

  function startQuiz(){
    quizState = {index:0, score:0, active:true};
    qScore.textContent = 'Poeng: 0';
    renderQuestion();
  }

  function resetQuiz(){
    startQuiz();
  }

  function renderQuestion(){
    if(quizState.index >= quizData.length){
      endQuiz();
      return;
    }
    const cur = quizData[quizState.index];
    qQuestion.textContent = cur.q;
    qOptions.innerHTML = '';
    cur.opts.forEach((opt,idx)=>{
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.addEventListener('click',()=>handleAnswer(idx, btn));
      qOptions.appendChild(btn);
    });
  }

  function handleAnswer(choice, btnEl){
    if(!quizState.active) return;
    const cur = quizData[quizState.index];
    const correct = cur.a === choice;
    qOptions.querySelectorAll('.quiz-option').forEach(b=>b.disabled=true);
    if(correct){
      btnEl.classList.add('correct');
      quizState.score++;
      qScore.textContent = 'Poeng: ' + quizState.score;
    } else {
      btnEl.classList.add('wrong');
      const opts = qOptions.querySelectorAll('.quiz-option');
      if(opts[cur.a]) opts[cur.a].classList.add('correct');
    }
    setTimeout(()=>{
      quizState.index++;
      renderQuestion();
    }, 1200);
  }

  function endQuiz(){
    quizState.active = false;
    qQuestion.textContent = 'Ferdig! Din score: ' + quizState.score + ' / ' + quizData.length;
    qOptions.innerHTML = '';
    if(quizState.score === quizData.length){
      qScore.textContent = 'Perfekt! +50 XP';
    }
  }

  // Simuler XP-oppdatering i dashbordet (hvis elementet finnes)
  const xpTotal = document.getElementById('xp-total');
  if(xpTotal){
    // Simuler litt dynamikk
    setInterval(()=>{
      const current = parseInt(xpTotal.textContent,10)||0;
      if(Math.random()>0.95) xpTotal.textContent = current + Math.floor(Math.random()*10);
    }, 3000);
  }

})();
