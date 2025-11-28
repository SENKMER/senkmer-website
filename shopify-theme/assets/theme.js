/* SENKMER Shopify Theme JavaScript */

// Import hovedprosjekt JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Shopify-spesifikk funksjonalitet
  
  // Handlekurv oppdatering
  const cartForm = document.querySelector('form[action="/cart"]');
  if (cartForm) {
    cartForm.addEventListener('submit', function(e) {
      if (e.submitter && e.submitter.name === 'update') {
        e.preventDefault();
        updateCart(new FormData(cartForm));
      }
    });
  }
  
  // Produktbilder gallery
  const productImages = document.querySelectorAll('.product-images img');
  productImages.forEach(img => {
    img.addEventListener('click', function() {
      // Implementer bildegalleri
    });
  });

  // Chatbot logikk (enkel FAQ)
  (function(){
    const btn = document.getElementById('chatbot-toggle');
    const win = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close');
    const msgs = document.getElementById('chatbot-messages');
    const input = document.getElementById('chatbot-input');
    const send = document.getElementById('chatbot-send');
    const suggestions = document.getElementById('chatbot-suggestions');

    if (!btn || !win || !msgs) return; // ikke vises på alle sider

    const faq = [
      { q: /opprette.*konto|registrere/i, a: 'Klikk på «Opprett konto», fyll ut e-post og passord. Du får en bekreftelseslenke på e-post.' },
      { q: /kontakte.*support|hjelp|kundeservice/i, a: 'Send e-post til kontakt@senkmer.no eller bruk kontaktskjemaet. Vi svarer innen 24 timer.' },
      { q: /pris|kostnad|abonnement/i, a: 'Se prissiden for pakker fra 990,- per måned og oppover.' },
      { q: /tilbakestill.*passord|glemt.*passord/i, a: 'Bruk «Glemt passord» på innloggingssiden for å få en tilbakestillingslenke.' },
      { q: /xp|nivå|poeng/i, a: 'Du tjener XP ved å fullføre oppgaver. Hvert nivå låser opp fordeler.' },
      { q: /lagre.*data|server|skylagring/i, a: 'Data lagres sikkert i Norge med kryptering i transitt og i ro.' },
      { q: /trygg|sikker|personvern|gdpr/i, a: 'Vi følger GDPR, bruker TLS 1.3, tilbyr 2FA og kjører jevnlige revisjoner.' },
      { q: /tilbakemelding|feedback|forslag/i, a: 'Del gjerne tilbakemeldinger på kontakt@senkmer.no – vi setter pris på det!' },
      { q: /mobil|app|ios|android/i, a: 'Nettsiden fungerer på mobil. Native apper er på veikartet.' },
      { q: /slette.*konto|avslutt/i, a: 'Gå til Innstillinger → Konto → Slett konto. Data slettes innen 30 dager.' }
    ];

    function addMsg(text, isBot) {
      const wrap = document.createElement('div');
      wrap.className = isBot ? 'chatbot-message bot' : 'chatbot-message user';
      const content = document.createElement('div');
      content.className = 'message-content';
      content.textContent = text;
      wrap.appendChild(content);
      msgs.appendChild(wrap);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function answer(userInput) {
      for (const { q, a } of faq) {
        if (q.test(userInput)) return a;
      }
      return 'Beklager, jeg forstår ikke helt. Prøv å omformulere eller kontakt kontakt@senkmer.no.';
    }

    function handleSend() {
      const text = (input && input.value || '').trim();
      if (!text) return;
      addMsg(text, false);
      if (input) input.value = '';
      setTimeout(() => addMsg(answer(text), true), 350);
    }

    btn.addEventListener('click', () => { win.hidden = !win.hidden; });
    if (closeBtn) closeBtn.addEventListener('click', () => { win.hidden = true; });
    if (send) send.addEventListener('click', handleSend);
    if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });
    if (suggestions) suggestions.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.matches('button.chip') && input) {
        input.value = t.getAttribute('data-question') || '';
        handleSend();
      }
    });
  })();
});

function updateCart(formData) {
  fetch('/cart/update.js', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    window.location.reload();
  })
  .catch(error => {
    console.error('Feil ved oppdatering av handlekurv:', error);
  });
}
