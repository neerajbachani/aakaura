# Chakra Journey System - Quick Start Guide

## What Was Created

A complete dynamic routing system for chakra journey pages with:

✅ **7 Chakra Journey Pages** - Each with unique colors, content, and products
✅ **Reusable Template** - One component powers all journey pages
✅ **Dynamic Routing** - Automatic route generation for `/journey/[slug]`
✅ **Journey Hub** - Main page showing all chakras at `/journey`
✅ **Type-Safe Data** - Centralized chakra information with TypeScript
✅ **Responsive Design** - Mobile-friendly with horizontal scroll
✅ **SEO Optimized** - Dynamic metadata for each page

## File Structure

```
aakaura/
├── src/
│   ├── data/
│   │   └── chakras.ts                    # All chakra data
│   ├── components/
│   │   └── journey/
│   │       └── ChakraJourneyTemplate.tsx # Reusable template
│   └── app/
│       └── journey/
│           ├── page.tsx                  # Journey hub (/journey)
│           └── [slug]/
│               └── page.tsx              # Dynamic routes
└── JOURNEY_SYSTEM.md                     # Full documentation
```

## Available Routes

Visit these URLs in your app:

- `/journey` - Main hub showing all 7 chakras
- `/journey/grounding` - Root Chakra (Red)
- `/journey/flow` - Sacral Chakra (Orange)
- `/journey/power` - Solar Plexus Chakra (Yellow)
- `/journey/love` - Heart Chakra (Green)
- `/journey/expression` - Throat Chakra (Blue)
- `/journey/insight` - Third Eye Chakra (Indigo)
- `/journey/expansion` - Crown Chakra (Purple)

## Page Sections

Each journey page includes:

1. **Hero Section**
   - Chakra name and Sanskrit name
   - Animated symbol
   - Description
   - Metrics (location, element, mantra, crystals)
   - CTA buttons

2. **Learn More Section**
   - Expandable benefits card
   - Expandable crystals card
   - Click to expand/collapse

3. **Products Showcase**
   - 5 products in horizontal scroll
   - Step-by-step journey items
   - Themed styling

4. **Call to Action**
   - Journey-specific messaging
   - Link to shop

## How to Update Content

### Change Chakra Information
Edit `src/data/chakras.ts`:

```typescript
export const chakrasData: Record<string, ChakraData> = {
  grounding: {
    name: "Root Chakra",
    description: "Your new description...",
    benefits: ["Benefit 1", "Benefit 2"],
    // ... update any field
  },
};
```

### Add/Update Products
In the same file, update the `products` array:

```typescript
products: [
  {
    name: "Product Name",
    description: "Product description",
    step: 1,
  },
  // ... 5 products total
],
```

### Change Colors
Update the `colors` object:

```typescript
colors: {
  primary: "#DC2626",    // Main color
  dark: "#991B1B",       // Dark variant
  light: "#FEE2E2",      // Light background
  gradient: "from-red-600 via-red-500 to-red-400", // Tailwind classes
},
```

## Customization Tips

### Add More Chakras
1. Add new entry to `chakrasData` in `src/data/chakras.ts`
2. Route automatically generates at `/journey/[your-slug]`

### Modify Template Layout
Edit `src/components/journey/ChakraJourneyTemplate.tsx`
- All pages update automatically
- Maintains consistent design

### Update Journey Hub
Edit `src/app/journey/page.tsx`
- Change grid layout
- Update hero section
- Modify card design

## Integration with Products

To connect with your actual product database:

1. Replace mock product data with real product IDs
2. Fetch products in the template component
3. Use existing `ProductCard` component
4. Link to actual product pages

Example:
```typescript
// In ChakraJourneyTemplate.tsx
const productIds = chakra.products.map(p => p.id);
const products = await fetchProducts(productIds);

// Then render with ProductCard
{products.map(product => (
  <ProductCard key={product.id} product={product} />
))}
```

## Testing

1. Start your dev server: `npm run dev`
2. Visit `/journey` to see the hub
3. Click any chakra card to visit its journey page
4. Test expandable cards
5. Test horizontal scroll on mobile
6. Check responsive design

## Next Steps

Consider adding:
- [ ] Real product integration
- [ ] User progress tracking
- [ ] Meditation timers
- [ ] Audio guides
- [ ] Chakra assessment quiz
- [ ] Personalized recommendations
- [ ] Social sharing
- [ ] Print-friendly versions

## Support

For detailed documentation, see `JOURNEY_SYSTEM.md`

For questions about:
- Data structure → Check `src/data/chakras.ts`
- Template design → Check `src/components/journey/ChakraJourneyTemplate.tsx`
- Routing → Check `src/app/journey/[slug]/page.tsx`
