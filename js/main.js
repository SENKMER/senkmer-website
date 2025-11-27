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

  // Backend integrasjon (auth, progress, kontakt)
  const API = {
    base: 'http://localhost:3001',
    async csrf(){
      const r = await fetch(`${this.base}/api/csrf`);
      return r.json();
    },
    async register(email, password, display_name){
      const r = await fetch(`${this.base}/api/auth/register`, {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ email, password, display_name })
      });
      return r.json();
    },
    async login(email, password){
      const r = await fetch(`${this.base}/api/auth/login`, {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ email, password })
      });
      return r.json();
    },
    async getProgress(token){
      const r = await fetch(`${this.base}/api/progress`, { headers:{ Authorization:`Bearer ${token}` }});
      return r.json();
    },
    async setProgress(token, xp, streak){
      const csrf = await this.csrf();
      const r = await fetch(`${this.base}/api/progress`, {
        method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}`, 'x-csrf-token': csrf.token },
        body: JSON.stringify({ xp, streak })
      });
      return r.json();
    },
    async sendContact(payload){
      const csrf = await this.csrf();
      const r = await fetch(`${this.base}/api/contact`, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
      return r.json();
    }
  };
  window.SenkmerAPI = API;

  // Oppgaver helpers
  window.SenkmerAPI.tasks = {
    async list(token){
      const r = await fetch(`${API.base}/api/tasks`, { headers:{ Authorization:`Bearer ${token}` }});
      return r.json();
    },
    async create(token, payload){
      const r = await fetch(`${API.base}/api/tasks`, { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify(payload) });
      return r.json();
    },
    async complete(token, id){
      const r = await fetch(`${API.base}/api/tasks/${id}/complete`, { method:'POST', headers:{ Authorization:`Bearer ${token}` }});
      return r.json();
    }
  };

  // Badges helpers
  window.SenkmerAPI.badges = {
    async list(token){
      const r = await fetch(`${API.base}/api/badges`, { headers:{ Authorization:`Bearer ${token}` }});
      return r.json();
    },
    async award(token, payload){
      const csrf = await API.csrf();
      const r = await fetch(`${API.base}/api/badges/award`, { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}`, 'x-csrf-token': csrf.token }, body: JSON.stringify(payload) });
      return r.json();
    }
  };

  // Last inn felles komponenter (header/footer)
  window.loadComponents = async function(){
    try{
      const headerPh = document.getElementById('header-placeholder');
      const footerPh = document.getElementById('footer-placeholder');
      if(headerPh){
        const h = await fetch('/components/header.html');
        headerPh.innerHTML = await h.text();
      }
      if(footerPh){
        const f = await fetch('/components/footer.html');
        footerPh.innerHTML = await f.text();
        const y = document.getElementById('year');
        if(y) y.textContent = new Date().getFullYear();
      }
    }catch(e){
      console.error('Kunne ikke laste komponenter', e);
    }
  };

})();
