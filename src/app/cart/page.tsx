'use client';

import { useCart, useClearCart } from '@/hooks/useCart';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { ShoppingBagIcon, ArrowLeftIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStatus } from '@/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';
import { useState } from 'react';

export default function CartPage() {
  const { data: cart, isLoading, error } = useCart();
  const clearCart = useClearCart();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useAuthStatus();

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart.mutate();
    }
  };

  const handleContinueShopping = () => {
    if (typeof window !== 'undefined' && window.sessionStorage.getItem('returnFromCheckout') === 'true') {
      window.sessionStorage.removeItem('returnFromCheckout');
      router.push('/products');
    } else if (window.history.length > 2) {
      router.back();
    } else {
      router.push('/products');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#27190B] py-8 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BD9958]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#27190B] py-8 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-64 text-[#BD9958]/80">
            <p className="text-lg mb-4 font-cormorant text-2xl">Failed to load cart</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-[#BD9958] text-[#27190B] px-6 py-2 rounded-md font-medium hover:bg-[#FFD700] transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#27190B] py-8 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-[#191919] rounded-2xl border border-[#BD9958]/20 shadow-2xl"
          >
            <LockClosedIcon className="h-24 w-24 text-[#BD9958]/40 mb-6" />
            <h2 className="text-3xl font-semibold text-[#BD9958] font-cormorant mb-3 tracking-wide">Please log in</h2>
            <p className="text-[#BD9958]/70 mb-8 text-center max-w-md text-lg">
              You must be logged in to view your cart.
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-[#BD9958] text-[#27190B] px-10 py-4 rounded-md font-semibold hover:bg-[#FFD700] transition-all transform hover:scale-105 duration-300 tracking-wide"
            >
              Log In
            </button>
          </motion.div>
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#27190B] py-8 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleContinueShopping}
            className="inline-flex items-center text-[#BD9958] hover:text-[#FFD700] mb-4 transition-colors font-cormorant text-lg"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Continue Shopping
          </button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-bold text-[#BD9958] font-cormorant tracking-wide">Shopping Cart</h1>
            {cart && cart.items.length > 0 && (
              <button
                onClick={handleClearCart}
                disabled={clearCart.isPending}
                className="text-red-400 hover:text-red-300 font-medium transition-colors disabled:opacity-50"
              >
                {clearCart.isPending ? 'Clearing...' : 'Clear Cart'}
              </button>
            )}
          </div>
        </div>

        {!cart || cart.items.length === 0 ? (
          /* Empty Cart */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-[#191919] rounded-2xl border border-[#BD9958]/20 shadow-2xl"
          >
            <ShoppingBagIcon className="h-24 w-24 text-[#BD9958]/40 mb-6" />
            <h2 className="text-3xl font-semibold text-[#BD9958] font-cormorant mb-3 tracking-wide">Your cart is empty</h2>
            <p className="text-[#BD9958]/70 mb-8 text-center max-w-md text-lg">
              Looks like you haven&apos;t added any items to your cart yet. Start your journey below.
            </p>
            <Link
              href="/products"
              className="bg-[#BD9958] text-[#27190B] px-10 py-4 rounded-md font-semibold hover:bg-[#FFD700] transition-all transform hover:scale-105 duration-300 tracking-wide"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          /* Cart with Items */
          <div className="lg:grid lg:grid-cols-12 lg:gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-[#191919] rounded-2xl shadow-2xl border border-[#BD9958]/20 p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-[#BD9958] font-cormorant mb-8 tracking-wide">
                  Cart Items ({cart.totalItems})
                </h2>
                
                <div className="space-y-6">
                  <AnimatePresence>
                    {cart.items.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="sticky top-24">
                <CartSummary cart={cart} className="mb-6" />
                
                <div className="space-y-4">
                  <Link
                    href="/checkout"
                    className="w-full bg-[#BD9958] text-[#27190B] px-6 py-4 rounded-md font-semibold hover:bg-[#FFD700] transition-all text-center block text-lg tracking-wide hover:shadow-[0_0_15px_rgba(255,215,0,0.4)]"
                  >
                    Proceed to Checkout
                  </Link>
                  
                  <button
                    onClick={handleContinueShopping}
                    className="w-full bg-transparent border border-[#BD9958]/50 text-[#BD9958] px-6 py-4 rounded-md font-medium hover:bg-[#BD9958]/10 transition-colors text-center block"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Security Badge */}
                <div className="mt-8 p-5 bg-[#BD9958]/5 rounded-xl border border-[#BD9958]/20">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-[#BD9958]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-[#BD9958]/90">
                        Secure checkout with SSL encryption
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    </div>
  );
}