/* SENKMER Shopify Theme JavaScript */

// Import hovedprosjekt JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Shopify-spesifikk funksjonalitet
  // Mobilmeny toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
  
  // Handlekurv oppdatering
  const cartForm = document.querySelector('form[action="/cart"]');
  if (cartForm) {
    cartForm.addEventListener('submit', function(e) {
      if (e.submitter && e.submitter.name === 'update') {
        e.preventDefault();
        updateCart(new FormData(cartForm));
      }
    });
  }
  
  // Produktbilder gallery
  const productImages = document.querySelectorAll('.product-images img');
  productImages.forEach(img => {
    img.addEventListener('click', function() {
      // Implementer bildegalleri
    });
  });
});

function updateCart(formData) {
  fetch('/cart/update.js', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    window.location.reload();
  })
  .catch(error => {
    console.error('Feil ved oppdatering av handlekurv:', error);
  });
}
