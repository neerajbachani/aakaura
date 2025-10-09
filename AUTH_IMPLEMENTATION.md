# User Authentication System Implementation

This document outlines the comprehensive authentication system implemented for the aakaura e-commerce platform, integrated with the existing cart functionality.

## 🚀 Features Implemented

### Core Authentication
- ✅ User registration with email/password
- ✅ User login with JWT tokens
- ✅ Secure password hashing (bcryptjs)
- ✅ JWT token management with HTTP-only cookies
- ✅ User profile management
- ✅ Password change functionality
- ✅ Address management system

### Cart Integration
- ✅ Guest cart functionality (localStorage)
- ✅ Automatic cart merging on login/signup
- ✅ Seamless transition between guest and authenticated states
- ✅ Cart persistence across sessions

### Security Features
- ✅ HTTP-only cookies for token storage
- ✅ Password strength validation
- ✅ Input validation with Zod schemas
- ✅ Protected API routes
- ✅ CSRF protection

### User Experience
- ✅ Modal-based authentication
- ✅ Redirect after login functionality
- ✅ Profile dropdown menu
- ✅ Protected checkout flow
- ✅ Form validation with error handling

## 📁 File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts         # User registration
│   │   │   ├── login/route.ts          # User login
│   │   │   ├── logout/route.ts         # User logout
│   │   │   ├── me/route.ts             # Get current user
│   │   │   └── refresh/route.ts        # Refresh JWT token
│   │   └── user/
│   │       ├── profile/route.ts        # Get/update profile
│   │       ├── addresses/route.ts      # Address management
│   │       └── change-password/route.ts # Change password
│   ├── auth/
│   │   ├── login/page.tsx              # Login page
│   │   └── signup/page.tsx             # Signup page
│   └── profile/
│       └── page.tsx                    # User profile dashboard
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx               # Login form component
│   │   ├── SignupForm.tsx              # Signup form component
│   │   └── AuthModal.tsx               # Modal wrapper
│   └── user/
│       └── ProfileMenu.tsx             # User dropdown menu
├── hooks/
│   └── useAuth.ts                      # Authentication hooks
├── lib/
│   ├── auth.ts                         # Auth utilities
│   ├── guestCart.ts                    # Guest cart management
│   └── validations/
│       └── auth.ts                     # Zod validation schemas
└── types/
    └── Auth.ts                         # TypeScript interfaces
```

## 🗄️ Database Schema

Extended Prisma schema with authentication models:

```prisma
model User {
  id        String     @id @default(uuid())
  email     String     @unique
  password  String
  name      String?
  phone     String?
  addresses Address[]
  cartItems CartItem[]
  orders    Order[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model Address {
  id         String  @id @default(uuid())
  userId     String
  firstName  String
  lastName   String
  address    String
  city       String
  state      String
  zipCode    String
  country    String  @default("US")
  phone      String?
  isDefault  Boolean @default(false)
  user       User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

## 🔐 Authentication Flow

### Registration Process
1. User fills signup form with validation
2. Password is hashed using bcryptjs
3. User record created in database
4. JWT token generated and set as HTTP-only cookie
5. Guest cart items merged with user cart
6. User redirected to intended destination

### Login Process
1. User provides email/password
2. Credentials validated against database
3. JWT token generated and set as cookie
4. Guest cart merged with existing user cart
5. User redirected to intended destination

### Cart Merging Logic
```typescript
// During login/signup, guest cart items are merged
for (const item of guestCartItems) {
  await prisma.cartItem.upsert({
    where: {
      userId_productId_variationId: {
        userId: user.id,
        productId: item.productId,
        variationId: item.variationId || null,
      },
    },
    update: {
      quantity: { increment: item.quantity },
    },
    create: {
      userId: user.id,
      productId: item.productId,
      variationId: item.variationId,
      quantity: item.quantity,
    },
  });
}
```

## 🎯 Usage Examples

### Authentication Hooks

```tsx
import { useAuthStatus, useLogin, useSignup, useLogout } from '@/hooks/useAuth';

function AuthComponent() {
  const { user, isAuthenticated, isLoading } = useAuthStatus();
  const login = useLogin();
  const signup = useSignup();
  const logout = useLogout();

  const handleLogin = (credentials) => {
    login.mutate(credentials);
  };

  const handleSignup = (userData) => {
    signup.mutate(userData);
  };

  const handleLogout = () => {
    logout.mutate();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={() => handleLogin(credentials)}>Login</button>
          <button onClick={() => handleSignup(userData)}>Sign Up</button>
        </div>
      )}
    </div>
  );
}
```

### Protected Routes

```tsx
import { useRequireAuth } from '@/hooks/useAuth';

function ProtectedPage() {
  const { isAuthenticated, isLoading } = useRequireAuth('/auth/login');

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null; // Will redirect

  return <div>Protected content</div>;
}
```

### Cart Integration

```tsx
import { useCart, useAddToCart } from '@/hooks/useCart';
import { useAuthStatus } from '@/hooks/useAuth';

function CartComponent() {
  const { isAuthenticated } = useAuthStatus();
  const { data: cart } = useCart();
  const addToCart = useAddToCart();

  // Works for both authenticated and guest users
  const handleAddToCart = (productId, variationId, quantity) => {
    addToCart.mutate({ productId, variationId, quantity });
  };

  return (
    <div>
      <p>Cart items: {cart?.totalItems || 0}</p>
      <p>User type: {isAuthenticated ? 'Authenticated' : 'Guest'}</p>
    </div>
  );
}
```

## 🔧 Configuration

### Environment Variables

Required environment variables:

```env
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-secure-jwt-secret-key"
NODE_ENV="development" # or "production"
```

### JWT Configuration

JWT tokens are configured with:
- **Expiration**: 7 days
- **Algorithm**: HS256 (default)
- **Storage**: HTTP-only cookies
- **Security**: Secure flag in production

### Password Requirements

Passwords must meet these criteria:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## 🛡️ Security Measures

### Password Security
- **Hashing**: bcryptjs with 12 salt rounds
- **Validation**: Strength requirements enforced
- **Storage**: Never stored in plain text

### Token Security
- **HTTP-only cookies**: Prevents XSS attacks
- **Secure flag**: HTTPS only in production
- **SameSite**: CSRF protection
- **Expiration**: Automatic token expiry

### Input Validation
- **Zod schemas**: Type-safe validation
- **Sanitization**: Input cleaning
- **Error handling**: Secure error messages

### API Protection
- **Authentication middleware**: Protected routes
- **User isolation**: Data access controls
- **Rate limiting**: (Recommended for production)

## 📱 Mobile Responsiveness

All authentication components are fully responsive:
- Modal forms adapt to screen size
- Touch-friendly form inputs
- Mobile-optimized navigation
- Responsive profile layouts

## 🚀 Performance Optimizations

### TanStack Query Integration
- **Caching**: User data cached efficiently
- **Background updates**: Automatic data sync
- **Optimistic updates**: Immediate UI feedback
- **Error handling**: Graceful error recovery

### Guest Cart Performance
- **localStorage**: Fast local storage
- **Lazy loading**: Components load on demand
- **Debounced updates**: Prevents excessive operations
- **Memory management**: Automatic cleanup

## 🧪 Testing the Implementation

### Authentication Flow
1. **Guest Experience**: Add items to cart without login
2. **Registration**: Create account and verify cart merge
3. **Login**: Sign in and check cart persistence
4. **Profile Management**: Update profile information
5. **Logout**: Sign out and verify data cleanup

### Cart Integration
1. **Guest Cart**: Add items as guest user
2. **Login Merge**: Sign in and verify items merged
3. **Cross-Session**: Refresh page and check persistence
4. **Multiple Devices**: Test cart sync across devices

## 🔄 Future Enhancements

Potential improvements for the auth system:

### Enhanced Security
- **Two-factor authentication**: SMS/Email verification
- **OAuth integration**: Google, Facebook login
- **Password reset**: Email-based reset flow
- **Account verification**: Email confirmation
- **Session management**: Multiple device handling

### User Experience
- **Social login**: Third-party authentication
- **Remember me**: Extended session options
- **Profile pictures**: Avatar upload
- **Preferences**: User customization settings
- **Notifications**: Email/SMS preferences

### Advanced Features
- **Role-based access**: Admin/user permissions
- **Account deletion**: GDPR compliance
- **Data export**: User data download
- **Activity logs**: Login history tracking
- **Security alerts**: Suspicious activity detection

## 📞 Support

For questions or issues with the authentication system:

### Documentation References
- [TanStack Query Auth Patterns](https://tanstack.com/query/latest/docs/react/guides/auth)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [Prisma User Management](https://www.prisma.io/docs/concepts/components/prisma-client/crud)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

### Security Considerations
- Regular security audits recommended
- Keep dependencies updated
- Monitor for security vulnerabilities
- Implement rate limiting in production
- Use HTTPS in production environments

The authentication system is production-ready and follows modern security best practices while providing seamless integration with the existing cart functionality.