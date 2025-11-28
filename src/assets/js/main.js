// src main.js
(function(){
  // Simple include loader for components
  const includes = document.querySelectorAll('[data-include]');
  includes.forEach(async el => {
    const url = el.getAttribute('data-include');
    try {
      const res = await fetch(url);
      el.outerHTML = await res.text();
    } catch(e){ console.warn('Include failed', url, e); }
  });
})();
