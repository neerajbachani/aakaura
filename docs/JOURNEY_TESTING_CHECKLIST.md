# Chakra Journey System - Testing Checklist

## 🧪 Pre-Launch Testing Checklist

### Build & Development
- [ ] Run `npm run dev` successfully
- [ ] No console errors in terminal
- [ ] No TypeScript compilation errors
- [ ] Hot reload works when editing files

### Route Testing
- [ ] `/journey` loads correctly
- [ ] `/journey/grounding` loads (Root Chakra)
- [ ] `/journey/flow` loads (Sacral Chakra)
- [ ] `/journey/power` loads (Solar Plexus Chakra)
- [ ] `/journey/love` loads (Heart Chakra)
- [ ] `/journey/expression` loads (Throat Chakra)
- [ ] `/journey/insight` loads (Third Eye Chakra)
- [ ] `/journey/expansion` loads (Crown Chakra)
- [ ] `/journey/invalid-slug` shows 404

### Journey Hub Page (`/journey`)
- [ ] All 7 chakra cards display
- [ ] Each card shows correct symbol
- [ ] Each card shows correct colors
- [ ] Hover effects work on cards
- [ ] Click on card navigates to journey page
- [ ] Hero section displays correctly
- [ ] Info section displays correctly
- [ ] "Explore All Products" button works

### Individual Journey Pages
Test each of the 7 pages for:

#### Hero Section
- [ ] Gradient background displays with correct colors
- [ ] Chakra name displays correctly
- [ ] Sanskrit name displays correctly
- [ ] Symbol animates (pulse effect)
- [ ] Description text is readable
- [ ] "Explore Products" button scrolls to products
- [ ] "Learn More" button scrolls to info section
- [ ] Metrics grid shows all 4 items:
  - [ ] Location
  - [ ] Element
  - [ ] Mantra
  - [ ] Crystals count

#### Learn More Section
- [ ] Section title displays correctly
- [ ] Benefits card displays
- [ ] Crystals card displays
- [ ] Click Benefits card to expand
- [ ] Benefits list shows all items
- [ ] Click Benefits card again to collapse
- [ ] Click Crystals card to expand
- [ ] Crystals grid shows all 4 crystals
- [ ] Click Crystals card again to collapse
- [ ] Border color changes when expanded
- [ ] Only one card expanded at a time

#### Products Section
- [ ] Section displays with correct background color
- [ ] All 5 product cards display
- [ ] Horizontal scroll works
- [ ] Step numbers (1-5) display correctly
- [ ] Product names display
- [ ] Product descriptions display
- [ ] "Explore Product" buttons display
- [ ] Cards have correct border color

#### Call to Action Section
- [ ] Section displays correctly
- [ ] Journey-specific text displays
- [ ] "Shop All Products" button displays
- [ ] Button has correct color
- [ ] Button links to `/products`

### Color Theming
Verify each chakra has unique colors:
- [ ] Root (Red) - #DC2626
- [ ] Sacral (Orange) - #EA580C
- [ ] Solar Plexus (Yellow) - #EAB308
- [ ] Heart (Green) - #16A34A
- [ ] Throat (Blue) - #2563EB
- [ ] Third Eye (Indigo) - #4F46E5
- [ ] Crown (Purple) - #9333EA

### Responsive Design

#### Desktop (1920px+)
- [ ] Journey hub grid shows 3 columns
- [ ] Journey page hero shows 2 columns
- [ ] Products scroll horizontally
- [ ] All text is readable
- [ ] No layout breaks

#### Tablet (768px - 1919px)
- [ ] Journey hub grid shows 2 columns
- [ ] Journey page hero shows 2 columns
- [ ] Products scroll horizontally
- [ ] All text is readable
- [ ] No layout breaks

#### Mobile (< 768px)
- [ ] Journey hub grid shows 1 column
- [ ] Journey page hero stacks vertically
- [ ] Products scroll horizontally
- [ ] All text is readable
- [ ] No layout breaks
- [ ] Touch interactions work
- [ ] Buttons are easily tappable

### Typography
- [ ] Headings use Merriweather font
- [ ] Body text uses Mulish font
- [ ] Font sizes are appropriate
- [ ] Line heights are readable
- [ ] Text contrast is sufficient

### Interactions
- [ ] Hover effects work on buttons
- [ ] Hover effects work on cards
- [ ] Click interactions work
- [ ] Smooth scroll works (anchor links)
- [ ] Expandable cards animate smoothly
- [ ] No janky animations

### Accessibility
- [ ] All images have alt text (when added)
- [ ] Buttons have proper labels
- [ ] Color contrast meets WCAG standards
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Screen reader friendly markup

### Performance
- [ ] Pages load quickly
- [ ] No layout shift on load
- [ ] Smooth scrolling
- [ ] No lag on interactions
- [ ] Images load efficiently (when added)

### SEO
- [ ] Each page has unique title
- [ ] Each page has meta description
- [ ] Keywords are relevant
- [ ] URLs are clean and descriptive
- [ ] Headings hierarchy is correct (h1, h2, h3)

### Browser Testing
Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Content Verification
For each chakra, verify:
- [ ] Name is correct
- [ ] Sanskrit name is correct
- [ ] Symbol is appropriate
- [ ] Description is accurate
- [ ] Benefits list is complete (5 items)
- [ ] Crystals list is complete (4 items)
- [ ] Products list is complete (5 items)
- [ ] Location is correct
- [ ] Element is correct
- [ ] Mantra is correct

### Edge Cases
- [ ] Very long chakra names display correctly
- [ ] Very long descriptions wrap properly
- [ ] Empty states handled (if any)
- [ ] Loading states work (if any)
- [ ] Error states work (if any)

### Integration Points
- [ ] Links to `/products` work
- [ ] Navigation from hub to journeys works
- [ ] Back button works correctly
- [ ] Browser history works correctly

### Production Build
- [ ] `npm run build` completes successfully
- [ ] No build errors
- [ ] No build warnings (or acceptable ones)
- [ ] Static pages generated correctly
- [ ] `npm start` serves pages correctly

## 🐛 Common Issues to Check

### Layout Issues
- [ ] No horizontal scroll on body (unless intended)
- [ ] No overlapping elements
- [ ] Proper spacing between sections
- [ ] Consistent padding/margins

### Color Issues
- [ ] Colors match design
- [ ] Sufficient contrast
- [ ] Gradients render smoothly
- [ ] No color flickering

### Content Issues
- [ ] No typos
- [ ] No placeholder text
- [ ] All content is meaningful
- [ ] Consistent tone and voice

### Technical Issues
- [ ] No console errors
- [ ] No console warnings (or acceptable ones)
- [ ] No 404 errors for assets
- [ ] No CORS errors

## ✅ Sign-Off

### Developer Checklist
- [ ] All code is committed
- [ ] Documentation is complete
- [ ] Tests pass
- [ ] No known bugs
- [ ] Ready for review

### QA Checklist
- [ ] All features tested
- [ ] All devices tested
- [ ] All browsers tested
- [ ] Accessibility verified
- [ ] Performance verified

### Product Owner Checklist
- [ ] Meets requirements
- [ ] Content is accurate
- [ ] Design is approved
- [ ] Ready for production

---

## 📝 Testing Notes

**Date Tested:** _______________

**Tested By:** _______________

**Browser/Device:** _______________

**Issues Found:** 
- 
- 
- 

**Status:** 
- [ ] Pass
- [ ] Pass with minor issues
- [ ] Fail - needs fixes

**Next Steps:**
- 
- 
- 

---

## 🚀 Launch Checklist

Before going live:
- [ ] All tests passed
- [ ] Production build tested
- [ ] Analytics configured (if needed)
- [ ] Monitoring set up (if needed)
- [ ] Backup plan ready
- [ ] Team notified
- [ ] Documentation shared

**Ready to Launch:** [ ] Yes [ ] No
