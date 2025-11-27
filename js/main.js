// Hovedskript for Senkmer (norsk)
// Ansvar: navigasjon, enkel klient-logikk, sikkerhetsnotater

(function(){
  'use strict';
  // Enkel DOM hjelper
  const qs = (s, c=document) => c.querySelector(s);
  const qsa = (s,c=document) => Array.from(c.querySelectorAll(s));

  // mobilnav
  const toggle = qs('.hamburger');
  const nav = qs('.nav');
  if (toggle){
    toggle.addEventListener('click', ()=>{
      nav.classList.toggle('open');
    });
  }

  // skjemaer: forebygge XSS ved å alltid escape når vi viser input
  window.escapeHtml = function(str=''){
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  };

  // enklere smooth scroll for lokal lenker
  document.addEventListener('click', function(e){
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    const href = a.getAttribute('href');
    if(href === '#') return;
    const target = document.querySelector(href);
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });

  // eksponer noen funksjoner for debugging
  window.Senkmer = window.Senkmer || {};
  window.Senkmer.escapeHtml = window.escapeHtml;

})();
