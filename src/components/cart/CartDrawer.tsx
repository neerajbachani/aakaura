'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ShoppingBagIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useCart, useClearCart } from '@/hooks/useCart';
import { useAuthStatus } from '@/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { data: cart, isLoading, error } = useCart();
  const clearCart = useClearCart();
  const { isAuthenticated, isLoading: authLoading } = useAuthStatus();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart.mutate();
    }
  };

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-[#191919] border-l border-[#BD9958]/20 shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-6 border-b border-[#BD9958]/20">
                      <Dialog.Title className="font-cormorant text-2xl md:text-3xl text-[#BD9958] font-light">
                        Shopping Cart
                      </Dialog.Title>
                      <button
                        type="button"
                        className="text-[#BD9958]/70 hover:text-[#BD9958] transition-colors p-1"
                        onClick={onClose}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide pb-8" data-lenis-prevent="true">
                      {isLoading || authLoading ? (
                        <div className="flex items-center justify-center h-32">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BD9958]"></div>
                        </div>
                      ) : !isAuthenticated ? (
                        <div className="flex flex-col items-center justify-center h-64 text-[#BD9958]/70 px-6">
                          <LockClosedIcon className="h-16 w-16 mb-4 opacity-50 text-[#BD9958]" />
                          <h3 className="font-cormorant text-2xl mb-2 text-[#BD9958]">Please log in</h3>
                          <p className="text-sm text-center mb-8 font-light text-[#f4f1ea]/70">
                            You must be logged in to view your cart
                          </p>
                          <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="px-8 py-3 rounded-full text-sm uppercase tracking-widest bg-[#BD9958] text-[#27190B] hover:bg-[#A8874D] transition-colors text-center font-medium"
                          >
                            Log In
                          </button>
                        </div>
                      ) : error ? (
                        <div className="flex flex-col items-center justify-center h-32 text-[#BD9958]/70">
                          <p className="font-light">Failed to load cart</p>
                          <button 
                            onClick={() => window.location.reload()} 
                            className="mt-2 text-[#BD9958] hover:text-[#f4f1ea] transition-colors uppercase tracking-widest text-xs"
                          >
                            Try again
                          </button>
                        </div>
                      ) : !cart || cart.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-[#BD9958]/70 px-6">
                          <ShoppingBagIcon className="h-16 w-16 mb-4 opacity-50 text-[#BD9958]" />
                          <h3 className="font-cormorant text-2xl mb-2 text-[#BD9958]">Your cart is empty</h3>
                          <p className="text-sm text-center mb-8 font-light text-[#f4f1ea]/70">
                            Add some products to get started
                          </p>
                          <Link
                            href="/products"
                            onClick={onClose}
                            className="px-8 py-3 rounded-full text-sm uppercase tracking-widest bg-[#BD9958] text-[#27190B] hover:bg-[#A8874D] transition-colors text-center font-medium"
                          >
                            Continue Shopping
                          </Link>
                        </div>
                      ) : (
                        <div className="px-6 py-6">
                          {/* Cart Items */}
                          <div className="space-y-4 mb-6">
                            <AnimatePresence>
                              {cart.items.map((item) => (
                                <CartItem key={item.id} item={item} />
                              ))}
                            </AnimatePresence>
                          </div>

                          {/* Clear Cart Button */}
                          {cart.items.length > 0 && (
                            <button
                              onClick={handleClearCart}
                              disabled={clearCart.isPending}
                              className="w-full flex items-center justify-center mt-6 py-3 rounded-full text-xs uppercase tracking-widest border border-transparent text-[#BD9958]/50 hover:text-[#BD9958] hover:bg-[#BD9958]/10 hover:border-[#BD9958]/30 transition-all disabled:opacity-30"
                            >
                              {clearCart.isPending ? 'Clearing...' : 'Clear Cart'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer with Summary and Actions */}
                    {cart && cart.items.length > 0 && (
                      <div className="border-t border-[#BD9958]/20 px-6 py-6 bg-[#27190b]/50 backdrop-blur-sm">
                        <CartSummary cart={cart} className="!bg-transparent !border-none !p-0 !shadow-none mb-6" />
                        
                        <div className="flex flex-col gap-4">
                          <Link
                            href="/cart"
                            onClick={onClose}
                            className="w-full px-6 py-3 rounded-full text-sm uppercase tracking-widest border border-[#BD9958]/50 text-[#BD9958] hover:bg-[#BD9958]/10 transition-colors text-center"
                          >
                            View Cart
                          </Link>
                          
                          <Link
                            href="/checkout"
                            onClick={onClose}
                            className="w-full px-6 py-3 rounded-full text-sm uppercase tracking-widest bg-[#BD9958] text-[#27190B] hover:bg-[#A8874D] transition-colors text-center font-medium"
                          >
                            Checkout
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
    <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}