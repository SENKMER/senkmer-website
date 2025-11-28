// src chatbot.js - Norwegian FAQ bot
(function(){
  const btn = document.getElementById('chatbot-toggle');
  const win = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  const msgs = document.getElementById('chatbot-messages');
  const input = document.getElementById('chatbot-input');
  const send = document.getElementById('chatbot-send');

  const faq = [
    { q: /opprette.*konto|registrere/i, a: 'Klikk på "Kom i gang" øverst, fyll ut skjemaet med e-post og passord. Du får en bekreftelseslenke på e-post.' },
    { q: /kontakte.*support|hjelp|kundeservice/i, a: 'Send e-post til kontakt@senkmer.no eller bruk kontaktskjemaet vårt. Vi svarer innen 24 timer.' },
    { q: /pris|kostnad|abonnement/i, a: 'Se vår prisside for pakker fra 990,- til skreddersydde Enterprise-løsninger.' },
    { q: /tilbakestill.*passord|glemt.*passord/i, a: 'Klikk "Glemt passord" på innloggingssiden. Du får en tilbakestillingslenke på e-post.' },
    { q: /xp|nivå|poeng/i, a: 'Du tjener XP ved å fullføre oppgaver. Hvert nivå gir bonuser og nye funksjoner.' },
    { q: /lagre.*data|server|skylagring/i, a: 'Dataene dine lagres sikkert i Norge med kryptering i transitt og i ro.' },
    { q: /trygg|sikker|personvern/i, a: 'Vi følger GDPR, bruker TLS 1.3, 2FA, og gjennomfører regelmessige sikkerhetsrevisjoner.' },
    { q: /tilbakemelding|feedback|forslag/i, a: 'Send din tilbakemelding til kontakt@senkmer.no – vi setter pris på alle innspill!' },
    { q: /mobil|app|ios|android/i, a: 'Ja! Nettsiden er responsiv og fungerer på mobil. Native apper kommer snart.' },
    { q: /slette.*konto|avslutt/i, a: 'Gå til Innstillinger > Konto > Slett konto. Alle data slettes permanent innen 30 dager.' }
  ];

  function addMsg(text, isBot) {
    const div = document.createElement('div');
    div.className = isBot ? 'chatbot-message bot' : 'chatbot-message user';
    const content = document.createElement('div');
    content.className = 'message-content';
    content.textContent = text;
    div.appendChild(content);
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function answer(userInput) {
    for (const { q, a } of faq) {
      if (q.test(userInput)) return a;
    }
    return 'Beklager, jeg forstår ikke helt. Prøv å omformulere eller kontakt kontakt@senkmer.no for hjelp.';
  }

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, false);
    input.value = '';
    setTimeout(() => addMsg(answer(text), true), 400);
  }

  if (btn && win) btn.onclick = () => win.hidden = !win.hidden;
  if (closeBtn && win) closeBtn.onclick = () => win.hidden = true;
  if (send) send.onclick = handleSend;
  if (input) input.onkeydown = (e) => { if (e.key === 'Enter') handleSend(); };
})();
