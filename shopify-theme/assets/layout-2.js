// Layout 2 JavaScript - Duolingo-inspirert interaksjon

document.addEventListener('DOMContentLoaded', function() {
  
  // Bounce in animations on scroll
  const bounceObserver = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.animationDelay = `${index * 0.1}s`;
          entry.target.classList.add('bounce-on-scroll');
        }, index * 100);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });
  
  document.querySelectorAll('.card, .btn, h2, h3').forEach(element => {
    bounceObserver.observe(element);
  });
  
  // Button click animation
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
  
  // Progress bars animation
  document.querySelectorAll('.progress-bar').forEach(bar => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = bar.getAttribute('data-width') || '100';
          bar.style.width = width + '%';
        }
      });
    });
    observer.observe(bar);
  });
  
});
