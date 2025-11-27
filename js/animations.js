// Animasjoner og effekter for Senkmer (norsk)
(function(){
  'use strict';

  // Konfetti-effekt når bruker fullfører noe
  window.confetti = function(element){
    if(!element) return;
    element.style.position = 'relative';
    for(let i=0; i<15; i++){
      const particle = document.createElement('div');
      particle.style.cssText = `
        position:absolute;
        width:8px;
        height:8px;
        background:${['#10b981','#60a5fa','#f59e0b'][Math.floor(Math.random()*3)]};
        border-radius:50%;
        pointer-events:none;
        left:50%;
        top:50%;
        animation: confetti-${i} 0.8s ease-out forwards;
      `;
      element.appendChild(particle);
      setTimeout(()=>particle.remove(), 900);
    }
  };

  // Legg til konfetti-animasjoner i CSS (dynamisk)
  const style = document.createElement('style');
  let keyframes = '';
  for(let i=0; i<15; i++){
    const angle = (360/15)*i;
    const distance = 50 + Math.random()*50;
    keyframes += `
      @keyframes confetti-${i} {
        to {
          transform: translate(${Math.cos(angle*Math.PI/180)*distance}px, ${Math.sin(angle*Math.PI/180)*distance}px) scale(0);
          opacity:0;
        }
      }
    `;
  }
  style.textContent = keyframes;
  document.head.appendChild(style);

  // Smooth reveal for cards
  const observeCards = () => {
    const cards = document.querySelectorAll('.card');
    if(!cards.length) return;
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(20px)';
          entry.target.style.transition = 'all 0.5s ease';
          setTimeout(()=>{
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, 50);
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:0.1});
    cards.forEach(card=>observer.observe(card));
  };

  // Kjør når siden er klar
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', observeCards);
  } else {
    observeCards();
  }

  // Legg til pulse-effekt på viktige knapper
  const pulseButtons = document.querySelectorAll('.btn-primary');
  pulseButtons.forEach(btn=>{
    btn.addEventListener('mouseenter', function(){
      this.style.animation = 'pulse 0.5s ease';
    });
    btn.addEventListener('animationend', function(){
      this.style.animation = '';
    });
  });

  // Pulse keyframe
  const pulseStyle = document.createElement('style');
  pulseStyle.textContent = `
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `;
  document.head.appendChild(pulseStyle);

})();
