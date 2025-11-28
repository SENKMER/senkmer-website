# Shopify Integration Guide

## Setup Instructions

### 1. Create Shopify Account
1. Go to https://www.shopify.com/no
2. Sign up for a Shopify account (14-day free trial available)
3. Complete store setup with your business information

### 2. Create Products for Each Pricing Tier

Create subscription products in Shopify for each pricing tier:

- **Starter** - 99 kr/month
- **Basic** - 199 kr/month  
- **Standard** - 399 kr/month
- **Pro** - 699 kr/month
- **Team** - 1,499 kr/month
- **Business** - 2,999 kr/month
- **Business Plus** - 4,999 kr/month
- **Enterprise** - 9,999 kr/month
- **Unlimited** - 19,999 kr/month

#### Product Setup Steps:
1. In Shopify admin, go to **Products** > **Add product**
2. Enter product name (e.g., "Senkmer Starter Plan")
3. Set price (e.g., 99.00 NOK)
4. For subscriptions, install **Shopify Subscriptions** app
5. Note the Product ID for each tier

### 3. Get Storefront API Access Token

1. In Shopify admin, go to **Settings** > **Apps and sales channels**
2. Click **Develop apps**
3. Click **Create an app** (name it "Senkmer Website")
4. Go to **Configuration** tab
5. Under **Storefront API**, click **Configure**
6. Enable the following scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
7. Click **Save**
8. Go to **API credentials** tab
9. Copy your **Storefront access token**

### 4. Configure Your Website

Create a file `/config/shopify-config.js`:

```javascript
// Shopify Configuration
// DO NOT commit this file with real credentials to public repositories
window.SHOPIFY_CONFIG = {
  domain: 'your-store.myshopify.com', // Replace with your Shopify store domain
  token: 'your-storefront-access-token', // Replace with your Storefront API token
};
```

### 5. Update Product IDs

Edit `/js/shopify-integration.js` and update the `productIds` object with your actual Shopify product IDs:

```javascript
productIds: {
  'gratis': null, // Free tier
  'starter': 'gid://shopify/Product/1234567890', // Replace with actual ID
  'basic': 'gid://shopify/Product/1234567891',
  'standard': 'gid://shopify/Product/1234567892',
  // ... etc
}
```

#### How to Find Product IDs:
1. In Shopify admin, go to Products
2. Click on a product
3. Look at the URL: `https://admin.shopify.com/store/YOUR-STORE/products/1234567890`
4. The number at the end is the product ID
5. Format it as: `gid://shopify/Product/1234567890`

### 6. Add Scripts to HTML Pages

Add these script tags before `</body>` in your pricing page (`/pages/priser/priser.html`):

```html
<!-- Shopify Buy Button SDK -->
<script src="https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js"></script>

<!-- Shopify Configuration (create this file) -->
<script src="/config/shopify-config.js"></script>

<!-- Shopify Integration Module -->
<script src="/js/shopify-integration.js"></script>
```

### 7. Update Pricing Page Buttons

Update your pricing buttons to use Shopify product IDs:

**Before:**
```html
<a href="/pages/logg-inn.html" class="pricing-cta">Velg Starter</a>
```

**After:**
```html
<a href="#" 
   data-shopify-product-id="gid://shopify/Product/1234567890" 
   class="pricing-cta">
  Kjøp Starter
</a>
```

Or use the tier name (defined in productIds mapping):
```html
<button data-shopify-tier="starter" class="pricing-cta">
  Kjøp Starter
</button>
```

### 8. Test Integration

1. Start your local server: `python3 -m http.server 8000`
2. Open pricing page: http://localhost:8000/pages/priser/priser.html
3. Open browser console (F12)
4. You should see: `✓ Shopify integration initialized`
5. Click a pricing button
6. Should redirect to Shopify checkout

## Alternative: Embedded Buy Buttons

For a more integrated experience, use embedded products:

```html
<div id="product-component-starter"></div>

<script>
  // Render embedded product
  ShopifyIntegration.renderProduct(
    'gid://shopify/Product/1234567890',
    document.getElementById('product-component-starter')
  );
</script>
```

## Security Best Practices

### For Production:
1. **Never commit** `shopify-config.js` with real credentials
2. Add to `.gitignore`:
   ```
   /config/shopify-config.js
   ```
3. Use environment variables or server-side config
4. Consider using Shopify Private Apps for enhanced security

### Storefront API Scopes:
- Only enable `unauthenticated_read_product_listings`
- Enable checkout scopes only if needed
- Regularly rotate access tokens

## Troubleshooting

### "Shopify Buy SDK not loaded"
- Ensure Shopify SDK script is loaded before `shopify-integration.js`
- Check browser console for script loading errors

### "Product not found"
- Verify product ID format: `gid://shopify/Product/123456`
- Ensure product is published to "Online Store" sales channel
- Check Storefront API permissions

### Checkout redirect not working
- Verify `unauthenticated_write_checkouts` scope is enabled
- Check browser console for errors
- Test with different browser/incognito mode

### CORS Errors
- Shopify API should handle CORS automatically
- If issues persist, ensure domain is added to Shopify app settings

## Testing Checklist

- [ ] Shopify store created
- [ ] Products created for all tiers
- [ ] Storefront API token generated
- [ ] `shopify-config.js` configured
- [ ] Product IDs updated in `shopify-integration.js`
- [ ] Scripts added to HTML pages
- [ ] Buttons updated with `data-shopify-product-id`
- [ ] Tested purchase flow
- [ ] Checkout redirects correctly
- [ ] Cart functionality working

## Resources

- [Shopify Buy Button SDK Documentation](https://shopify.dev/docs/api/custom-storefronts/2024-01/storefront-api)
- [Shopify Storefront API Reference](https://shopify.dev/docs/api/storefront)
- [Shopify Subscriptions App](https://apps.shopify.com/subscriptions)

## Support

For Shopify-specific issues:
- Shopify Help Center: https://help.shopify.com/
- Shopify Community: https://community.shopify.com/

For integration issues:
- Check browser console for errors
- Review this guide's troubleshooting section
- Contact Senkmer development team
