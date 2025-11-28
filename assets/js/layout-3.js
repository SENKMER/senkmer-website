// Layout 3 JavaScript - Shopify-inspirert interaksjon

document.addEventListener('DOMContentLoaded', function() {
  
  // Reveal on scroll animations
  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
  });
  
  document.querySelectorAll('.reveal-on-scroll').forEach(element => {
    revealObserver.observe(element);
  });
  
  // Header shadow on scroll
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 20) {
        header.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.06)';
      } else {
        header.style.boxShadow = '0 1px 0 rgba(0, 0, 0, 0.05)';
      }
    });
  }
  
  // Form validation styling
  document.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('blur', function() {
      if (this.required && !this.value) {
        this.style.borderColor = 'var(--danger)';
      } else {
        this.style.borderColor = '';
      }
    });
    
    field.addEventListener('input', function() {
      this.style.borderColor = '';
    });
  });
  
  // Table row hover effect
  document.querySelectorAll('tbody tr').forEach(row => {
    row.style.cursor = 'pointer';
  });
  
});
