/**
 * Shopify Integration Module
 * Integrates Shopify Buy Button SDK for product purchases
 * 
 * Usage:
 * 1. Include Shopify Buy SDK script in HTML
 * 2. Call ShopifyIntegration.init() with your store config
 * 3. Use data-shopify-product-id on buttons to enable purchase
 */

const ShopifyIntegration = {
  client: null,
  ui: null,
  config: {
    domain: '', // Will be set by init(), e.g., 'your-store.myshopify.com'
    storefrontAccessToken: '', // Will be set by init()
    appId: '6', // Shopify Buy Button app ID
  },

  /**
   * Initialize Shopify client
   * @param {Object} options - Configuration options
   * @param {string} options.domain - Your Shopify store domain
   * @param {string} options.token - Storefront API access token
   */
  init(options = {}) {
    if (!window.ShopifyBuy) {
      console.error('Shopify Buy SDK not loaded. Include <script src="https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js"></script>');
      return false;
    }

    // Update configuration
    this.config.domain = options.domain || this.config.domain;
    this.config.storefrontAccessToken = options.token || this.config.storefrontAccessToken;

    if (!this.config.domain || !this.config.storefrontAccessToken) {
      console.warn('Shopify domain or token not configured. Set via ShopifyIntegration.init({ domain: "...", token: "..." })');
      return false;
    }

    try {
      // Initialize Shopify Buy SDK client
      this.client = window.ShopifyBuy.buildClient({
        domain: this.config.domain,
        storefrontAccessToken: this.config.storefrontAccessToken,
      });

      // Initialize UI for cart and modal
      this.ui = window.ShopifyBuy.UI.init(this.client);

      console.log('✓ Shopify integration initialized');
      this.attachButtonListeners();
      return true;
    } catch (error) {
      console.error('Failed to initialize Shopify:', error);
      return false;
    }
  },

  /**
   * Attach click listeners to all elements with data-shopify-product-id or data-shopify-tier
   */
  attachButtonListeners() {
    const productButtons = document.querySelectorAll('[data-shopify-product-id], [data-shopify-tier]');
    
    productButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Try to get product ID directly or from tier name
        let productId = button.getAttribute('data-shopify-product-id');
        
        if (!productId) {
          const tier = button.getAttribute('data-shopify-tier');
          if (tier) {
            productId = this.getProductId(tier);
          }
        }
        
        if (productId) {
          this.addProductToCart(productId);
        } else {
          console.warn('Product ID not found for button:', button);
          const tier = button.getAttribute('data-shopify-tier');
          if (tier) {
            alert(`Shopify produkt-ID ikke konfigurert for "${tier}" plan. Vennligst kontakt administrator.`);
          }
        }
      });
    });

    console.log(`✓ Attached Shopify listeners to ${productButtons.length} product buttons`);
  },

  /**
   * Add a product to cart and open checkout modal
   * @param {string} productId - Shopify product ID (GID format)
   */
  async addProductToCart(productId) {
    if (!this.client) {
      alert('Shopify ikke konfigurert. Kontakt administrator.');
      return;
    }

    try {
      // Show loading state
      this.showLoading(true);

      // Fetch product details
      const product = await this.client.product.fetch(productId);
      
      if (!product) {
        throw new Error('Product not found');
      }

      // Get first available variant
      const variant = product.variants[0];

      // Create checkout
      const checkout = await this.client.checkout.create();

      // Add line item
      const lineItemsToAdd = [{
        variantId: variant.id,
        quantity: 1
      }];

      const updatedCheckout = await this.client.checkout.addLineItems(checkout.id, lineItemsToAdd);

      // Redirect to Shopify checkout
      window.location.href = updatedCheckout.webUrl;

    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Kunne ikke legge til produkt i handlekurv. Prøv igjen senere.');
    } finally {
      this.showLoading(false);
    }
  },

  /**
   * Create embedded product component
   * @param {string} productId - Shopify product ID
   * @param {HTMLElement} container - Container element to render product
   * @param {Object} options - Customization options
   */
  renderProduct(productId, container, options = {}) {
    if (!this.ui) {
      console.error('Shopify UI not initialized');
      return;
    }

    const defaultOptions = {
      product: {
        buttonDestination: 'checkout',
        contents: {
          img: true,
          title: true,
          price: true,
          description: true,
          button: true,
        },
        text: {
          button: 'Kjøp nå',
        },
        styles: {
          product: {
            '@media (min-width: 601px)': {
              'max-width': 'calc(25% - 20px)',
              'margin-left': '20px',
              'margin-bottom': '50px',
            },
          },
          button: {
            'background-color': '#4f46e5',
            ':hover': {
              'background-color': '#4338ca',
            },
            ':focus': {
              'background-color': '#4338ca',
            },
          },
        },
      },
      cart: {
        text: {
          title: 'Handlekurv',
          empty: 'Din handlekurv er tom.',
          button: 'Gå til kassen',
        },
      },
      toggle: {
        styles: {
          toggle: {
            'background-color': '#4f46e5',
            ':hover': {
              'background-color': '#4338ca',
            },
          },
        },
      },
      ...options,
    };

    this.ui.createComponent('product', {
      id: productId,
      node: container,
      options: defaultOptions,
    });
  },

  /**
   * Show/hide loading indicator
   * @param {boolean} show - Whether to show loading
   */
  showLoading(show) {
    let loader = document.getElementById('shopify-loader');
    
    if (show) {
      if (!loader) {
        loader = document.createElement('div');
        loader.id = 'shopify-loader';
        loader.innerHTML = `
          <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                      background: rgba(0,0,0,0.5); display: flex; align-items: center; 
                      justify-content: center; z-index: 10000;">
            <div style="background: white; padding: 2rem; border-radius: 8px; 
                        box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
              <div style="width: 40px; height: 40px; border: 4px solid #f3f4f6; 
                          border-top-color: #4f46e5; border-radius: 50%; 
                          animation: spin 1s linear infinite; margin: 0 auto;"></div>
              <p style="margin-top: 1rem; color: #374151; font-weight: 500;">
                Behandler...
              </p>
            </div>
          </div>
          <style>
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          </style>
        `;
        document.body.appendChild(loader);
      }
      loader.style.display = 'block';
    } else {
      if (loader) {
        loader.style.display = 'none';
      }
    }
  },

  /**
   * Product ID mapping for pricing tiers
   * Map your pricing plan names to Shopify product IDs
   */
  productIds: {
    // Example mapping - replace with your actual Shopify product IDs
    'gratis': null, // Free tier - no Shopify product
    'starter': 'gid://shopify/Product/REPLACE_WITH_STARTER_PRODUCT_ID',
    'basic': 'gid://shopify/Product/REPLACE_WITH_BASIC_PRODUCT_ID',
    'standard': 'gid://shopify/Product/REPLACE_WITH_STANDARD_PRODUCT_ID',
    'pro': 'gid://shopify/Product/REPLACE_WITH_PRO_PRODUCT_ID',
    'team': 'gid://shopify/Product/REPLACE_WITH_TEAM_PRODUCT_ID',
    'business': 'gid://shopify/Product/REPLACE_WITH_BUSINESS_PRODUCT_ID',
    'business-plus': 'gid://shopify/Product/REPLACE_WITH_BUSINESS_PLUS_PRODUCT_ID',
    'enterprise': 'gid://shopify/Product/REPLACE_WITH_ENTERPRISE_PRODUCT_ID',
    'unlimited': 'gid://shopify/Product/REPLACE_WITH_UNLIMITED_PRODUCT_ID',
  },

  /**
   * Get product ID for a pricing tier
   * @param {string} tier - Pricing tier name
   * @returns {string|null} Shopify product ID or null
   */
  getProductId(tier) {
    const normalizedTier = tier.toLowerCase().trim();
    return this.productIds[normalizedTier] || null;
  },
};

// Auto-initialize if DOM is ready and config is available
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Check if config is in global scope
    if (window.SHOPIFY_CONFIG) {
      ShopifyIntegration.init(window.SHOPIFY_CONFIG);
    }
  });
} else {
  // DOM already loaded
  if (window.SHOPIFY_CONFIG) {
    ShopifyIntegration.init(window.SHOPIFY_CONFIG);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ShopifyIntegration;
}

// Make available globally
window.ShopifyIntegration = ShopifyIntegration;
