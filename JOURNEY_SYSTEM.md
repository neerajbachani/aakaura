# Chakra Journey System Documentation

## Overview
The Chakra Journey system provides a dynamic, reusable template for creating individual chakra journey pages with consistent design and functionality.

## Structure

### 1. Data Layer (`src/data/chakras.ts`)
Contains all chakra information in a centralized, type-safe structure:

```typescript
interface ChakraData {
  slug: string;              // URL slug (e.g., "grounding", "flow")
  name: string;              // Display name (e.g., "Root Chakra")
  sanskritName: string;      // Sanskrit name (e.g., "Muladhara")
  tone: string;              // Journey theme (e.g., "Grounding")
  colors: {
    primary: string;         // Main color
    dark: string;            // Dark variant
    light: string;           // Light variant
    gradient: string;        // Tailwind gradient classes
  };
  location: string;          // Physical location
  element: string;           // Associated element
  mantra: string;            // Seed mantra
  crystals: string[];        // Associated crystals
  description: string;       // Main description
  benefits: string[];        // List of benefits
  products: ChakraProduct[]; // 5 products per journey
  symbol: string;            // Emoji/symbol
}
```

### 2. Template Component (`src/components/journey/ChakraJourneyTemplate.tsx`)
Reusable React component that renders any chakra journey page with:

#### Sections:
1. **Hero Section**
   - Chakra name, Sanskrit name, symbol
   - Description and call-to-action buttons
   - Metrics grid (location, element, mantra, crystals)
   - Dynamic gradient background based on chakra colors

2. **Introduction Section**
   - Expandable cards for benefits and crystals
   - Interactive click-to-expand functionality
   - Color-themed borders and backgrounds

3. **Products Showcase**
   - Horizontal scrolling product cards
   - 5 products per journey
   - Step numbers and descriptions
   - Color-themed styling

4. **Call to Action**
   - Journey-specific messaging
   - Link to products page

### 3. Dynamic Routes (`src/app/journey/[slug]/page.tsx`)
Next.js dynamic routing with:
- Static generation for all chakra pages
- SEO-optimized metadata
- 404 handling for invalid slugs

### 4. Journey Hub (`src/app/journey/page.tsx`)
Main landing page showing all 7 chakra journeys in a grid layout.

## Available Routes

| Route | Chakra | Theme | Color |
|-------|--------|-------|-------|
| `/journey/grounding` | Root Chakra | Grounding | Red |
| `/journey/flow` | Sacral Chakra | Flow | Orange |
| `/journey/power` | Solar Plexus Chakra | Power | Yellow |
| `/journey/love` | Heart Chakra | Love | Green |
| `/journey/expression` | Throat Chakra | Expression | Blue |
| `/journey/insight` | Third Eye Chakra | Insight | Indigo |
| `/journey/expansion` | Crown Chakra | Expansion | Purple |

## Adding a New Chakra Journey

1. Add chakra data to `src/data/chakras.ts`:
```typescript
export const chakrasData: Record<string, ChakraData> = {
  // ... existing chakras
  newchakra: {
    slug: "newchakra",
    name: "New Chakra",
    sanskritName: "Sanskrit Name",
    tone: "Theme",
    colors: {
      primary: "#HEX",
      dark: "#HEX",
      light: "#HEX",
      gradient: "from-color-600 via-color-500 to-color-400",
    },
    // ... rest of the data
  },
};
```

2. The route will be automatically generated at `/journey/newchakra`

## Customization

### Colors
Each chakra has a color scheme that's applied throughout:
- Hero gradient background
- Button colors
- Border colors
- Card backgrounds
- Text accents

### Products
Each journey displays 5 products in a horizontal scroll:
- Product name
- Description
- Step number (1-5)
- Themed styling

To update products, modify the `products` array in the chakra data.

### Content
All text content is managed in `src/data/chakras.ts`:
- Description
- Benefits list
- Crystals list
- Product information

## Features

### Responsive Design
- Mobile-first approach
- Horizontal scroll on mobile for products
- Grid layouts adapt to screen size

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus states

### SEO
- Dynamic metadata generation
- Descriptive titles and descriptions
- Keyword optimization
- Static generation for fast loading

### Interactive Elements
- Expandable information cards
- Smooth scroll navigation
- Hover effects
- Click interactions

## Styling

Uses:
- Tailwind CSS for utility classes
- Custom fonts from `@/config/fonts`
- Dynamic inline styles for chakra-specific colors
- CSS custom properties for smooth transitions

## Performance

- Static generation at build time
- Optimized images (when integrated)
- Minimal JavaScript
- CSS-based animations
- Horizontal scroll with native browser performance

## Future Enhancements

Potential additions:
- Integration with actual product database
- User progress tracking
- Meditation timers
- Audio/video content
- Community features
- Personalized recommendations
- Chakra assessment quiz
