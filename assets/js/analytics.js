/**
 * SENKMER Analytics
 * Privacy-friendly analytics using Plausible
 */

(function() {
  'use strict';
  
  // Configuration
  const ANALYTICS_ENABLED = true;
  const PLAUSIBLE_DOMAIN = 'senkmer.no';
  const PLAUSIBLE_API = 'https://plausible.io/api/event';
  
  // Check if analytics is enabled
  if (!ANALYTICS_ENABLED) {
    console.log('[Analytics] Disabled');
    return;
  }
  
  // Check for Do Not Track
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') {
    console.log('[Analytics] Do Not Track enabled, skipping analytics');
    return;
  }
  
  /**
   * Send event to Plausible
   */
  function trackEvent(eventName, props = {}) {
    if (!ANALYTICS_ENABLED) return;
    
    const data = {
      n: eventName, // event name
      u: window.location.href, // url
      d: PLAUSIBLE_DOMAIN, // domain
      r: document.referrer || null, // referrer
      w: window.innerWidth, // screen width
      h: 1, // hash mode (for SPAs)
      p: props // custom properties
    };
    
    // Send beacon (doesn't block page unload)
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      navigator.sendBeacon(PLAUSIBLE_API, blob);
    } else {
      // Fallback to fetch
      fetch(PLAUSIBLE_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true
      }).catch(err => console.error('[Analytics] Error:', err));
    }
  }
  
  /**
   * Track page view
   */
  function trackPageview() {
    trackEvent('pageview');
  }
  
  /**
   * Track custom event
   */
  function trackCustomEvent(name, props = {}) {
    trackEvent(name, props);
  }
  
  /**
   * Track outbound link clicks
   */
  function trackOutboundLink(url) {
    trackEvent('Outbound Link: Click', { url });
  }
  
  /**
   * Track file downloads
   */
  function trackDownload(filename) {
    trackEvent('File: Download', { filename });
  }
  
  /**
   * Track form submissions
   */
  function trackFormSubmit(formName) {
    trackEvent('Form: Submit', { form: formName });
  }
  
  /**
   * Track button clicks
   */
  function trackButtonClick(buttonName) {
    trackEvent('Button: Click', { button: buttonName });
  }
  
  /**
   * Track scroll depth
   */
  let maxScrollDepth = 0;
  function trackScrollDepth() {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    if (scrollPercent > maxScrollDepth) {
      maxScrollDepth = scrollPercent;
      
      // Track milestones
      if ([25, 50, 75, 100].includes(scrollPercent)) {
        trackEvent('Scroll Depth', { depth: `${scrollPercent}%` });
      }
    }
  }
  
  /**
   * Track time on page
   */
  let timeOnPage = 0;
  let timeInterval = null;
  
  function startTimeTracking() {
    timeInterval = setInterval(() => {
      timeOnPage += 5;
      
      // Track milestones (30s, 1min, 2min, 5min)
      if ([30, 60, 120, 300].includes(timeOnPage)) {
        trackEvent('Time on Page', { seconds: timeOnPage });
      }
    }, 5000);
  }
  
  function stopTimeTracking() {
    if (timeInterval) {
      clearInterval(timeInterval);
      trackEvent('Time on Page', { seconds: timeOnPage });
    }
  }
  
  /**
   * Initialize analytics
   */
  function init() {
    // Track initial pageview
    trackPageview();
    
    // Track scroll depth
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(trackScrollDepth, 500);
    });
    
    // Track time on page
    startTimeTracking();
    
    // Stop tracking on page unload
    window.addEventListener('beforeunload', stopTimeTracking);
    
    // Track outbound links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href) return;
      
      // Check if external link
      if (href.startsWith('http') && !href.includes(window.location.hostname)) {
        trackOutboundLink(href);
      }
      
      // Check if download
      if (link.hasAttribute('download') || /\.(pdf|zip|docx?|xlsx?|pptx?)$/i.test(href)) {
        trackDownload(href.split('/').pop());
      }
    });
    
    // Track forms with data-analytics attribute
    document.querySelectorAll('form[data-analytics]').forEach(form => {
      form.addEventListener('submit', () => {
        trackFormSubmit(form.dataset.analytics || 'unnamed-form');
      });
    });
    
    // Track buttons with data-analytics attribute
    document.querySelectorAll('button[data-analytics], a[data-analytics]').forEach(btn => {
      btn.addEventListener('click', () => {
        trackButtonClick(btn.dataset.analytics || 'unnamed-button');
      });
    });
    
    console.log('[Analytics] Initialized (Privacy-friendly mode)');
  }
  
  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Expose API
  window.senkmerAnalytics = {
    track: trackCustomEvent,
    pageview: trackPageview,
    outboundLink: trackOutboundLink,
    download: trackDownload,
    formSubmit: trackFormSubmit,
    buttonClick: trackButtonClick
  };
  
})();
