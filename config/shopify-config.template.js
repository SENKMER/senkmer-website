/**
 * Shopify Configuration Template
 * 
 * IMPORTANT: 
 * 1. Copy this file to /config/shopify-config.js
 * 2. Replace placeholder values with your actual Shopify credentials
 * 3. Add /config/shopify-config.js to .gitignore for security
 * 
 * DO NOT commit the real config file with credentials to version control!
 */

window.SHOPIFY_CONFIG = {
  // Your Shopify store domain (without https://)
  // Example: 'senkmer-store.myshopify.com'
  domain: 'YOUR-STORE.myshopify.com',
  
  // Storefront API access token
  // Get this from: Shopify Admin > Settings > Apps and sales channels > Develop apps
  // Format: shpat_ followed by 32 alphanumeric characters
  token: 'YOUR_STOREFRONT_ACCESS_TOKEN_HERE',
};

// To get your Shopify credentials:
// 1. Log in to your Shopify admin
// 2. Go to Settings > Apps and sales channels
// 3. Click "Develop apps"
// 4. Create a new app (e.g., "Senkmer Website Integration")
// 5. Configure Storefront API with these scopes:
//    - unauthenticated_read_product_listings
//    - unauthenticated_write_checkouts
//    - unauthenticated_read_checkouts
// 6. Go to API credentials tab
// 7. Copy your Storefront access token
// 8. Your domain is: YOUR-STORE-NAME.myshopify.com
