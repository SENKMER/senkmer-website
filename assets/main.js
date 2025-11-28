/* SENKMER Theme Main JS */
(function(){
  // Mobile menu toggle
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('nav-menu');
  if (toggle && menu) toggle.addEventListener('click', ()=> menu.classList.toggle('active'));
})();
