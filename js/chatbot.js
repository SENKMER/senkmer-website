// Enkelt kundeservice-bot (frontend only) - norsk
(function(){
  'use strict';
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatWindow = document.getElementById('chat-window');

  if(!chatForm) return;

  const responses = [
    {keywords:['xp','poeng'], text:'Du tjener XP ved å fullføre moduler og gjøre spill. Hold på streaks for ekstra belønning.'},
    {keywords:['konto','logg inn','registrer'], text:'Kontoer kommer snart. I demoen er alt klient-side.'},
    {keywords:['pris','betaling'], text:'Senkmer sin grunnfunksjon er gratis i demoen.'},
    {keywords:['bug','feil','problem'], text:'Takk for tilbakemelding. Bruk kontaktskjemaet eller send epost til support@senkmer.example.'},
    {keywords:['kontakt','hjelp','support'], text:'Du kan sende melding i kontaktskjemaet nedenfor. Vi svarer så snart vi kan (demo).'}
  ];

  chatForm.addEventListener('submit', function(e){
    e.preventDefault();
    const raw = chatInput.value.trim();
    if(!raw) return;
    append('user', raw);
    chatInput.value = '';
    setTimeout(()=>{
      const ans = reply(raw);
      append('bot', ans);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 300 + Math.random()*400);
  });

  function append(who, text){
    const div = document.createElement('div');
    div.className = who === 'user' ? 'user' : 'bot';
    div.textContent = text; // safe because we control content
    chatWindow.appendChild(div);
    // begrens lengde
    while(chatWindow.children.length > 100) chatWindow.removeChild(chatWindow.firstChild);
  }

  function reply(input){
    const s = input.toLowerCase();
    for(const r of responses){
      for(const k of r.keywords) if(s.includes(k)) return r.text;
    }
    return 'Jeg lærer fortsatt. Prøv å skrive: "Hvordan tjener jeg XP?" eller bruk kontaktskjemaet.';
  }
})();
