'use client';

import { useState, useEffect } from 'react';
import { useAuthStatus, useLogin, useSignup, useLogout } from '@/hooks/useAuth';
import { useCart, useAddToCart } from '@/hooks/useCart';
import { AuthModal } from '@/components/auth/AuthModal';
import { CartDrawer } from '@/components/cart/CartDrawer';

export default function DemoPage() {
  const { user, isAuthenticated, isLoading } = useAuthStatus();
  const { data: cart } = useCart();
  const addToCart = useAddToCart();
  const logout = useLogout();
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [demoProduct, setDemoProduct] = useState<any>(null);

  // Fetch a demo product
  useEffect(() => {
    const fetchDemoProduct = async () => {
      try {
        const response = await fetch('/api/products?limit=1');
        if (response.ok) {
          const data = await response.json();
          if (data.data?.products?.length > 0) {
            setDemoProduct(data.data.products[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching demo product:', error);
      }
    };

    fetchDemoProduct();
  }, []);

  const handleAddDemoItem = () => {
    if (!demoProduct) {
      alert('No demo product available. Please add some products to your database first.');
      return;
    }

    addToCart.mutate({
      productId: demoProduct.id,
      variationId: demoProduct.variations?.[0]?.id, // Use first variation if available
      quantity: 1,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Authentication & Cart Demo
          </h1>
          <p className="text-gray-600">
            Test the authentication system and cart functionality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Authentication Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Authentication Status
            </h2>
            
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-800 font-medium">Authenticated</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p><strong>Name:</strong> {user?.name || 'Not provided'}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
                </div>
                
                <button
                  onClick={() => logout.mutate()}
                  disabled={logout.isPending}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {logout.isPending ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-yellow-800 font-medium">Guest User</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </button>
                  
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Cart Status
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-blue-800 font-medium">
                    Cart Type: {isAuthenticated ? 'Database Cart' : 'Guest Cart (localStorage)'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p><strong>Total Items:</strong> {cart?.totalItems || 0}</p>
                <p><strong>Total Price:</strong> ₹{cart?.totalPrice?.toFixed(2) || '0.00'}</p>
                {cart?.totalOfferPrice && (
                  <p><strong>Offer Price:</strong> ₹{cart.totalOfferPrice.toFixed(2)}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleAddDemoItem}
                  disabled={addToCart.isPending || !demoProduct}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {addToCart.isPending ? 'Adding...' : !demoProduct ? 'No Products Available' : `Add Demo Item (${demoProduct.name})`}
                </button>
                
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                >
                  View Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Test Instructions
          </h2>
          
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900">1. Guest Cart Test</h3>
              <p>Add items to cart as a guest user. Items are stored in localStorage.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">2. Registration Test</h3>
              <p>Sign up for a new account. Guest cart items should merge with your new account.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">3. Login Test</h3>
              <p>Sign out and sign back in. Your cart should persist across sessions.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">4. Cart Merge Test</h3>
              <p>Add items as guest, then login. Guest items should merge with existing cart.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
      
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
}