// src animations.js
export function fadeIn(el){ el.style.opacity=0; requestAnimationFrame(()=>{ el.style.transition='opacity .4s'; el.style.opacity=1; }); }
