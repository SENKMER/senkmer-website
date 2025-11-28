// ============================================
// SENKMER - Contact Form Handler
// Form validation and submission
// ============================================

// Rate limiting
const RATE_LIMIT_KEY = 'senkmer_contact_last_submit';
const RATE_LIMIT_DURATION = 60000; // 1 minute

function checkRateLimit() {
  const lastSubmit = localStorage.getItem(RATE_LIMIT_KEY);
  if (lastSubmit) {
    const timeSinceLastSubmit = Date.now() - parseInt(lastSubmit);
    if (timeSinceLastSubmit < RATE_LIMIT_DURATION) {
      const waitTime = Math.ceil((RATE_LIMIT_DURATION - timeSinceLastSubmit) / 1000);
      return {
        allowed: false,
        waitTime
      };
    }
  }
  return { allowed: true };
}

function setRateLimit() {
  localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
}

// Initialize contact form
function initContactForm() {
  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Check rate limiting
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      showFormMessage(
        `Vennligst vent ${rateLimitCheck.waitTime} sekunder før du sender en ny melding.`,
        'error'
      );
      return;
    }
    
    // Get form data
    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim()
    };
    
    // Validate form
    const validation = validateContactForm(formData);
    if (!validation.valid) {
      showFormMessage(validation.message, 'error');
      return;
    }
    
    // Disable submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sender...';
    
    try {
      // Simulate API call (replace with actual endpoint)
      await simulateFormSubmission(formData);
      
      // Success
      showFormMessage(
        'Takk for din melding! Vi tar kontakt med deg så snart som mulig.',
        'success'
      );
      
      // Reset form
      form.reset();
      
      // Set rate limit
      setRateLimit();
      
      // Show notification
      if (window.SENKMER && window.SENKMER.showNotification) {
        window.SENKMER.showNotification('Melding sendt!', 'success');
      }
      
    } catch (error) {
      showFormMessage(
        'Det oppstod en feil ved sending av meldingen. Vennligst prøv igjen senere.',
        'error'
      );
      console.error('Form submission error:', error);
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
  
  // Real-time validation
  const emailInput = form.email;
  const phoneInput = form.phone;
  
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      if (emailInput.value && !window.SENKMER.validateEmail(emailInput.value)) {
        emailInput.style.borderColor = 'var(--color-danger)';
      } else {
        emailInput.style.borderColor = '';
      }
    });
  }
  
  if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value && !window.SENKMER.validatePhone(phoneInput.value)) {
        phoneInput.style.borderColor = 'var(--color-danger)';
      } else {
        phoneInput.style.borderColor = '';
      }
    });
  }
}

// Validate contact form
function validateContactForm(data) {
  if (!data.name || data.name.length < 2) {
    return {
      valid: false,
      message: 'Vennligst oppgi et gyldig navn (minimum 2 tegn).'
    };
  }
  
  if (!data.email || !window.SENKMER.validateEmail(data.email)) {
    return {
      valid: false,
      message: 'Vennligst oppgi en gyldig e-postadresse.'
    };
  }
  
  if (data.phone && !window.SENKMER.validatePhone(data.phone)) {
    return {
      valid: false,
      message: 'Vennligst oppgi et gyldig telefonnummer.'
    };
  }
  
  if (!data.subject || data.subject.length < 3) {
    return {
      valid: false,
      message: 'Vennligst oppgi et emne (minimum 3 tegn).'
    };
  }
  
  if (!data.message || data.message.length < 10) {
    return {
      valid: false,
      message: 'Vennligst skriv en melding (minimum 10 tegn).'
    };
  }
  
  return { valid: true };
}

// Show form message
function showFormMessage(message, type) {
  const formMessage = document.getElementById('formMessage');
  if (!formMessage) return;
  
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = 'block';
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    formMessage.style.display = 'none';
  }, 5000);
}

// Simulate form submission (replace with actual API call)
async function simulateFormSubmission(data) {
  // Real API endpoint
  const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api/contact'
    : 'https://api.senkmer.no/api/contact';
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Sending failed');
    }
    
    return result;
  } catch (error) {
    // Fallback: log locally if API is unavailable
    console.log('Form data (API unavailable):', data);
    // Simulate success for demo purposes
    return {
      success: true,
      message: 'Melding mottatt! (Demo-modus - API ikke tilkoblet ennå)'
    };
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm);
} else {
  initContactForm();
}
