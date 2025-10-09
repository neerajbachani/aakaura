# E-commerce Cart Implementation with TanStack Query

This document outlines the comprehensive cart functionality implemented for the aakaura e-commerce platform.

## 🚀 Features Implemented

### Core Cart Functionality
- ✅ Add products (with variations) to cart
- ✅ Update quantities with optimistic updates
- ✅ Remove items from cart
- ✅ Clear entire cart
- ✅ Persist cart across sessions (database-backed)
- ✅ Real-time cart count updates

### TanStack Query Integration
- ✅ Automatic background synchronization
- ✅ Optimistic updates for immediate UI feedback
- ✅ Error handling and retry logic
- ✅ Cache invalidation strategies
- ✅ Loading states management

### User Experience
- ✅ Cart icon with item count in navbar
- ✅ Slide-out cart drawer
- ✅ Full cart page
- ✅ Checkout flow
- ✅ Order confirmation
- ✅ Mobile-responsive design

## 📁 File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── cart/
│   │   │   ├── route.ts              # Get cart
│   │   │   ├── add/route.ts          # Add to cart
│   │   │   ├── update/route.ts       # Update quantity
│   │   │   ├── remove/route.ts       # Remove item
│   │   │   └── clear/route.ts        # Clear cart
│   │   └── orders/
│   │       ├── route.ts              # Create/get orders
│   │       └── [id]/route.ts         # Get specific order
│   ├── cart/
│   │   └── page.tsx                  # Full cart page
│   ├── checkout/
│   │   └── page.tsx                  # Checkout page
│   └── orders/
│       └── [id]/page.tsx             # Order confirmation
├── components/
│   └── cart/
│       ├── CartIcon.tsx              # Cart icon with count
│       ├── CartDrawer.tsx            # Slide-out cart
│       ├── CartItem.tsx              # Individual cart item
│       ├── AddToCartButton.tsx       # Add to cart button
│       └── CartSummary.tsx           # Order summary
├── hooks/
│   └── useCart.ts                    # TanStack Query hooks
├── lib/
│   └── queryClient.ts                # Query client config
├── providers/
│   └── QueryProvider.tsx             # React Query provider
└── types/
    └── Cart.ts                       # TypeScript interfaces
```

## 🗄️ Database Schema

The implementation extends the existing Prisma schema with:

```prisma
model User {
  id        String     @id @default(uuid())
  email     String     @unique
  name      String?
  cartItems CartItem[]
  orders    Order[]
  createdAt DateTime   @default(now())
}

model CartItem {
  id          String            @id @default(uuid())
  userId      String
  productId   String
  variationId String?
  quantity    Int               @default(1)
  user        User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  product     Product           @relation(fields: [productId], references: [id], onDelete: Cascade)
  variation   ProductVariation? @relation(fields: [variationId], references: [id], onDelete: SetNull)
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  @@unique([userId, productId, variationId])
}

model Order {
  id        String      @id @default(uuid())
  userId    String
  total     Float
  status    OrderStatus @default(PENDING)
  items     OrderItem[]
  user      User        @relation(fields: [userId], references: [id])
  createdAt DateTime    @default(now())
}

model OrderItem {
  id          String            @id @default(uuid())
  orderId     String
  productId   String
  variationId String?
  quantity    Int
  price       Float
  order       Order             @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product     Product           @relation(fields: [productId], references: [id])
  variation   ProductVariation? @relation(fields: [variationId], references: [id])
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}
```

## 🎯 Usage Examples

### Adding Items to Cart

```tsx
import { AddToCartButton } from '@/components/cart/AddToCartButton';

// Simple add to cart
<AddToCartButton
  productId="product-id"
  quantity={1}
  variant="primary"
  size="lg"
>
  Add to Cart
</AddToCartButton>

// With product variation
<AddToCartButton
  productId="product-id"
  variationId="variation-id"
  quantity={2}
  variant="outline"
  disabled={!inStock}
>
  {inStock ? 'Add to Cart' : 'Out of Stock'}
</AddToCartButton>
```

### Using Cart Hooks

```tsx
import { useCart, useAddToCart, useUpdateCartItem } from '@/hooks/useCart';

function CartComponent() {
  const { data: cart, isLoading } = useCart();
  const addToCart = useAddToCart();
  const updateQuantity = useUpdateCartItem();

  const handleAddToCart = () => {
    addToCart.mutate({
      productId: 'product-id',
      variationId: 'variation-id',
      quantity: 1
    });
  };

  const handleUpdateQuantity = (cartItemId: string, quantity: number) => {
    updateQuantity.mutate({ cartItemId, quantity });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <p>Cart has {cart?.totalItems || 0} items</p>
      {/* Cart items rendering */}
    </div>
  );
}
```

### Cart Icon Integration

```tsx
import { CartIcon } from '@/components/cart/CartIcon';
import { CartDrawer } from '@/components/cart/CartDrawer';

function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <nav>
      {/* Other nav items */}
      <CartIcon onClick={() => setIsCartOpen(true)} />
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </nav>
  );
}
```

## 🔧 Configuration

### Environment Variables

Make sure these are set in your `.env` file:

```env
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-jwt-secret"
```

### TanStack Query Setup

The QueryProvider is already integrated into the root layout:

```tsx
// src/app/layout.tsx
import { QueryProvider } from '@/providers/QueryProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

## 🎨 Styling

The implementation uses:
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Heroicons** for icons
- **Headless UI** for accessible components

## 🔒 Security Features

- JWT-based authentication
- User-specific cart isolation
- Input validation with Zod
- SQL injection protection via Prisma
- CSRF protection through same-origin policy

## 📱 Mobile Responsiveness

All components are fully responsive:
- Cart drawer adapts to mobile screens
- Touch-friendly quantity controls
- Responsive grid layouts
- Mobile-optimized checkout flow

## 🚀 Performance Optimizations

- **Optimistic Updates**: Immediate UI feedback
- **Background Sync**: Automatic data synchronization
- **Debounced Updates**: Prevents excessive API calls
- **Lazy Loading**: Components load on demand
- **Image Optimization**: Next.js Image component

## 🧪 Testing the Implementation

1. **Add Items**: Navigate to `/products` and add items to cart
2. **View Cart**: Click the cart icon to open the drawer
3. **Update Quantities**: Use +/- buttons to modify quantities
4. **Checkout**: Complete the checkout flow
5. **Order Confirmation**: View order details after completion

## 🔄 Future Enhancements

Potential improvements for the cart system:

- **Guest Cart**: Store cart in localStorage for non-authenticated users
- **Cart Abandonment**: Email reminders for incomplete purchases
- **Wishlist Integration**: Save items for later
- **Bulk Operations**: Select multiple items for actions
- **Cart Sharing**: Share cart via URL
- **Inventory Validation**: Real-time stock checking
- **Price Alerts**: Notify users of price changes
- **Recommendations**: Suggest related products in cart

## 📞 Support

For questions or issues with the cart implementation, please refer to:
- TanStack Query documentation
- Prisma documentation
- Next.js App Router guide

The cart system is production-ready and follows modern e-commerce best practices for performance, security, and user experience.