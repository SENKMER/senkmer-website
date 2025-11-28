// src chatbot.js
(function(){
  const btn = document.getElementById('chatbot-toggle');
  const win = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  if(btn && win){ btn.onclick = ()=> win.hidden = !win.hidden; }
  if(closeBtn && win){ closeBtn.onclick = ()=> win.hidden = true; }
})();
