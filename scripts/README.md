# Aamvaraah Muffler - Product Addition Guide

## Overview

This script adds the **Aamvaraah Muffler** product to three chakra journeys:

- 🔴 **Root Chakra** (grounding)
- 💚 **Heart Chakra** (love)
- 💙 **Third Eye Chakra** (insight)

Each chakra receives **2 versions**: Soul-Luxury (₹4,500) and Energy-Curious (₹5,500)

## Product Details

### Aamvaraah Muffler

Premium winter muffler woven in the Himalayas with felt wool blend.

**Specifications:**

- **Dimensions**: 75 inches (& tassels) × 6 inches
- **Weight**: 250 gms (lightweight)
- **Material**: Premium wool blend
- **Warmth Level**: High – suitable for cold winter weather
- **Care**: Dry clean recommended

**Key Features:**

- Dense, insulating texture
- Soft contact with skin
- Unisex design
- Even insulation for all-day comfort

## Usage Methods

### Option 1: Run the Script (Automated) ⚡

```bash
cd d:\coding\aakaura\aakaura\scripts
node add-muffler-products.js
```

**Prerequisites:**

1. Make sure your dev server is running (`npm run dev`)
2. You must be logged in as admin
3. The script uses session cookies automatically

**What it does:**

- Adds 2 products per chakra (6 total)
- Shows progress for each addition
- Reports success/failure statistics

### Option 2: Admin Panel (Manual) 🖱️

1. Go to `http://localhost:3000/admin/products-settings`
2. Select chakra (grounding, love, or insight)
3. Select client type (soul-luxury or energy-curious)
4. Click "Add Product"
5. Copy/paste data from the script file

### Option 3: API Calls (Advanced) 🔧

Use the product data exported from the script:

```javascript
const {
  MUFFLER_SOUL_LUXURY,
  MUFFLER_ENERGY_CURIOUS,
} = require("./add-muffler-products.js");

// Use with fetch, axios, or your preferred HTTP client
```

## Authentication

The script requires admin authentication. Two ways to handle this:

**Method 1: Browser Session (Easiest)**

- Log into admin panel in your browser
- Keep browser open
- Run script (will use your session)

**Method 2: Session Token**

- Get session token from browser cookies
- Add to script headers:
  ```javascript
  'Cookie': 'next-auth.session-token=your-token-here'
  ```

## Product Differences

### Soul-Luxury Version (₹4,500)

- Focus on craftsmanship and quality
- Traditional artisan techniques
- Practical warmth and comfort
- Thoughtful design philosophy

### Energy-Curious Version (₹5,500)

- All Soul-Luxury features PLUS:
- Energetically cleansed and blessed
- Pranic Healer treatment
- Throat chakra alignment
- Auric integrity support

## Image Requirements

Make sure this image exists:

```
/public/images/aamvaraah-muffler.jpeg
```

If missing, add your muffler product image to this location.

## Verification

After running the script, verify products by:

1. **Visit each chakra page:**
   - `/journeys/grounding`
   - `/journeys/love`
   - `/journeys/insight`

2. **Toggle client types:**
   - Switch between Soul-Luxury and Energy-Curious
   - Verify both versions appear

3. **Check product details:**
   - Specifications display correctly
   - Images load properly
   - Descriptions are complete

## Troubleshooting

**❌ Authentication Error (401)**

- Log in to admin panel
- Session may have expired
- Add session cookie to script

**❌ Product Not Showing**

- Clear browser cache
- Check database for product entry
- Verify chakra slug is correct

**❌ Image Not Loading**

- Check `/public/images/aamvaraah-muffler.jpeg` exists
- Verify image path in product data
- Try hard refresh (Ctrl+F5)

## Script Output

Successful run looks like:

```
🚀 Starting Aamvaraah Muffler product addition...

📍 Adding to Root Chakra (grounding)...
  ✅ Added soul-luxury version
  ✅ Added energy-curious version
  ✨ Completed Root Chakra

📍 Adding to Heart Chakra (love)...
  ✅ Added soul-luxury version
  ✅ Added energy-curious version
  ✨ Completed Heart Chakra

📍 Adding to Third Eye Chakra (insight)...
  ✅ Added soul-luxury version
  ✅ Added energy-curious version
  ✨ Completed Third Eye Chakra

✨ Product addition complete!
   Success: 6 products
```

## Next Steps

After adding products:

1. ✅ Verify on frontend
2. 📸 Add product images if missing
3. 🎨 Adjust variant colors if needed
4. 📝 Update product descriptions via admin panel if required
