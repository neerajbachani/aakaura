# Chakra Journey System Architecture

## System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     User Navigation                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   /journey       │
                    │  (Journey Hub)   │
                    └──────────────────┘
                              │
                    Displays all 7 chakras
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  User clicks on a chakra card           │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │     /journey/[slug]                     │
        │  (Dynamic Chakra Journey Page)          │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Next.js matches slug to chakra data    │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  ChakraJourneyTemplate renders with     │
        │  chakra-specific data and colors        │
        └─────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    chakras.ts (Data Layer)                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  chakrasData = {                                       │  │
│  │    grounding: { name, colors, products, ... },        │  │
│  │    flow: { name, colors, products, ... },             │  │
│  │    power: { name, colors, products, ... },            │  │
│  │    love: { name, colors, products, ... },             │  │
│  │    expression: { name, colors, products, ... },       │  │
│  │    insight: { name, colors, products, ... },          │  │
│  │    expansion: { name, colors, products, ... }         │  │
│  │  }                                                     │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ Import
                              ▼
┌──────────────────────────────────────────────────────────────┐
│              [slug]/page.tsx (Route Handler)                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  1. Receives slug from URL                            │  │
│  │  2. Looks up chakra in chakrasData                    │  │
│  │  3. Returns 404 if not found                          │  │
│  │  4. Passes chakra data to template                    │  │
│  │  5. Generates SEO metadata                            │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ Props
                              ▼
┌──────────────────────────────────────────────────────────────┐
│         ChakraJourneyTemplate.tsx (Presentation)              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Receives: { chakra: ChakraData }                     │  │
│  │                                                        │  │
│  │  Renders:                                             │  │
│  │  ├─ Hero (with chakra.colors gradient)               │  │
│  │  ├─ Metrics (location, element, mantra)              │  │
│  │  ├─ Benefits (expandable card)                       │  │
│  │  ├─ Crystals (expandable card)                       │  │
│  │  ├─ Products (horizontal scroll)                     │  │
│  │  └─ CTA (themed buttons)                             │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
└── journey/
    ├── page.tsx (Journey Hub)
    │   └── Renders all chakras in grid
    │       └── Links to individual journeys
    │
    └── [slug]/
        └── page.tsx (Dynamic Route)
            └── ChakraJourneyTemplate
                ├── Hero Section
                │   ├── Chakra Info
                │   ├── Symbol
                │   ├── Description
                │   └── Metrics Grid
                │
                ├── Learn More Section
                │   ├── Benefits Card (expandable)
                │   └── Crystals Card (expandable)
                │
                ├── Products Section
                │   └── Horizontal Scroll
                │       └── Product Cards (5)
                │
                └── CTA Section
                    └── Shop Link
```

## Route Generation

```
Build Time:
┌─────────────────────────────────────────────────────────┐
│  Next.js calls generateStaticParams()                   │
│  ↓                                                       │
│  Returns: [                                             │
│    { slug: 'grounding' },                               │
│    { slug: 'flow' },                                    │
│    { slug: 'power' },                                   │
│    { slug: 'love' },                                    │
│    { slug: 'expression' },                              │
│    { slug: 'insight' },                                 │
│    { slug: 'expansion' }                                │
│  ]                                                       │
│  ↓                                                       │
│  Generates 7 static pages at build time                 │
└─────────────────────────────────────────────────────────┘

Result:
/journey/grounding    → Root Chakra page
/journey/flow         → Sacral Chakra page
/journey/power        → Solar Plexus Chakra page
/journey/love         → Heart Chakra page
/journey/expression   → Throat Chakra page
/journey/insight      → Third Eye Chakra page
/journey/expansion    → Crown Chakra page
```

## Color Theming System

```
Each chakra has a colors object:
┌─────────────────────────────────────────────────────────┐
│  colors: {                                              │
│    primary: "#DC2626",    ← Main brand color           │
│    dark: "#991B1B",       ← Darker shade               │
│    light: "#FEE2E2",      ← Light background           │
│    gradient: "from-red-600 via-red-500 to-red-400"    │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
Applied dynamically throughout the page:
├─ Hero background gradient
├─ Button colors
├─ Border colors
├─ Card backgrounds
├─ Text accents
└─ Hover states
```

## State Management

```
ChakraJourneyTemplate Component:
┌─────────────────────────────────────────────────────────┐
│  State:                                                 │
│  └─ expandedCard: number | null                        │
│                                                         │
│  User clicks Benefits card                             │
│  ↓                                                      │
│  setExpandedCard(1)                                    │
│  ↓                                                      │
│  Benefits card expands, Crystals card collapses        │
│                                                         │
│  User clicks Crystals card                             │
│  ↓                                                      │
│  setExpandedCard(2)                                    │
│  ↓                                                      │
│  Crystals card expands, Benefits card collapses        │
└─────────────────────────────────────────────────────────┘
```

## Type Safety

```
TypeScript Interfaces:
┌─────────────────────────────────────────────────────────┐
│  ChakraProduct                                          │
│  ├─ name: string                                        │
│  ├─ description: string                                 │
│  └─ step: number                                        │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│  ChakraData                                             │
│  ├─ slug: string                                        │
│  ├─ name: string                                        │
│  ├─ sanskritName: string                                │
│  ├─ tone: string                                        │
│  ├─ colors: { primary, dark, light, gradient }         │
│  ├─ location: string                                    │
│  ├─ element: string                                     │
│  ├─ mantra: string                                      │
│  ├─ crystals: string[]                                  │
│  ├─ description: string                                 │
│  ├─ benefits: string[]                                  │
│  ├─ products: ChakraProduct[]                           │
│  └─ symbol: string                                      │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
        Ensures type safety across:
        ├─ Data definition
        ├─ Component props
        ├─ Route handlers
        └─ Template rendering
```

## Performance Optimizations

```
1. Static Generation
   └─ All pages pre-rendered at build time
   └─ Fast page loads, no server requests

2. CSS-based Animations
   └─ No JavaScript for transitions
   └─ Smooth, performant animations

3. Minimal JavaScript
   └─ Only for expandable cards
   └─ Small bundle size

4. Native Scroll
   └─ Browser-native horizontal scroll
   └─ No custom scroll libraries

5. Optimized Images (when integrated)
   └─ Next.js Image component
   └─ Automatic optimization
```

## Extensibility Points

```
Easy to extend:
├─ Add new chakras → Update chakras.ts
├─ Change layout → Edit ChakraJourneyTemplate.tsx
├─ Add sections → Modify template component
├─ Integrate products → Connect to product API
├─ Add animations → Use Framer Motion
├─ Add audio → Embed audio players
└─ Add tracking → Add analytics events
```
