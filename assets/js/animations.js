// ============================================
// SENKMER - Animations
// Advanced animations and interactions
// ============================================

// Parallax effect for hero section
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    
    if (scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
  });
}

// Stagger animation for feature cards
function staggerAnimation() {
  const cards = document.querySelectorAll('.feature-card, .service-card, .value-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(card);
  });
}

// Cursor follow effect for buttons
function initCursorEffect() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
  
  buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      button.style.setProperty('--mouse-x', `${x}px`);
      button.style.setProperty('--mouse-y', `${y}px`);
    });
  });
  
  // Add ripple effect CSS
  const style = document.createElement('style');
  style.textContent = `
    .btn-primary, .btn-secondary {
      position: relative;
      overflow: hidden;
    }
    
    .btn-primary::before, .btn-secondary::before {
      content: '';
      position: absolute;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%) scale(0);
      transition: transform 0.5s ease;
      left: var(--mouse-x, 50%);
      top: var(--mouse-y, 50%);
    }
    
    .btn-primary:hover::before, .btn-secondary:hover::before {
      transform: translate(-50%, -50%) scale(2);
    }
  `;
  document.head.appendChild(style);
}

// Floating animation for elements
function initFloatingAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }
    
    .floating {
      animation: float 6s ease-in-out infinite;
    }
    
    .floating-delayed {
      animation: float 6s ease-in-out infinite;
      animation-delay: 2s;
    }
  `;
  document.head.appendChild(style);
}

// Gradient animation for text
function initGradientAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes gradientShift {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    
    .gradient-text-animated {
      background: linear-gradient(90deg, #4F46E5, #7C3AED, #EC4899, #4F46E5);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradientShift 3s ease infinite;
    }
  `;
  document.head.appendChild(style);
}

// Typewriter effect
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Initialize typewriter for hero subtitle
function initTypewriter() {
  const subtitle = document.querySelector('.hero-subtitle');
  if (subtitle) {
    const originalText = subtitle.textContent;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          typeWriter(subtitle, originalText, 40);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(subtitle);
  }
}

// Reveal animation on scroll
function initRevealOnScroll() {
  const style = document.createElement('style');
  style.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(50px);
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .reveal.active {
      opacity: 1;
      transform: translateY(0);
    }
    
    .reveal-left {
      opacity: 0;
      transform: translateX(-50px);
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .reveal-left.active {
      opacity: 1;
      transform: translateX(0);
    }
    
    .reveal-right {
      opacity: 0;
      transform: translateX(50px);
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .reveal-right.active {
      opacity: 1;
      transform: translateX(0);
    }
  `;
  document.head.appendChild(style);
  
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  reveals.forEach(reveal => observer.observe(reveal));
}

// Mouse trail effect (subtle)
function initMouseTrail() {
  let mouseX = 0;
  let mouseY = 0;
  let trails = [];
  const maxTrails = 10;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function createTrail() {
    if (trails.length >= maxTrails) {
      const oldTrail = trails.shift();
      if (oldTrail && oldTrail.parentNode) {
        oldTrail.remove();
      }
    }
    
    const trail = document.createElement('div');
    trail.style.cssText = `
      position: fixed;
      width: 4px;
      height: 4px;
      background: radial-gradient(circle, rgba(79, 70, 229, 0.5), transparent);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      left: ${mouseX}px;
      top: ${mouseY}px;
      transform: translate(-50%, -50%);
      animation: trailFade 0.5s ease-out forwards;
    `;
    
    document.body.appendChild(trail);
    trails.push(trail);
  }
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes trailFade {
      to {
        opacity: 0;
        transform: translate(-50%, -50%) scale(2);
      }
    }
  `;
  document.head.appendChild(style);
  
  // Create trail every 50ms when mouse is moving
  let lastMove = 0;
  document.addEventListener('mousemove', () => {
    const now = Date.now();
    if (now - lastMove > 50) {
      createTrail();
      lastMove = now;
    }
  });
}

// Initialize all animations
function initAnimations() {
  initParallax();
  staggerAnimation();
  initCursorEffect();
  initFloatingAnimation();
  initGradientAnimation();
  // initTypewriter(); // Uncomment if you want typewriter effect
  initRevealOnScroll();
  // initMouseTrail(); // Uncomment for mouse trail effect (can be distracting)
  
  console.log('🎨 Animations initialized');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}
