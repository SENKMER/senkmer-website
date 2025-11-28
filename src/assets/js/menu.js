// src menu.js
(function(){
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('nav-menu');
  if(toggle && menu){ toggle.addEventListener('click',()=> menu.classList.toggle('is-open')); }
})();
