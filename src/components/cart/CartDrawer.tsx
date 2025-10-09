'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart, useClearCart } from '@/hooks/useCart';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { data: cart, isLoading, error } = useCart();
  const clearCart = useClearCart();

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart.mutate();
    }
  };

  return (
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        Shopping Cart
                      </Dialog.Title>
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={onClose}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-32">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      ) : error ? (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                          <p>Failed to load cart</p>
                          <button 
                            onClick={() => window.location.reload()} 
                            className="mt-2 text-blue-600 hover:text-blue-700"
                          >
                            Try again
                          </button>
                        </div>
                      ) : !cart || cart.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                          <ShoppingBagIcon className="h-16 w-16 mb-4" />
                          <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                          <p className="text-sm text-center mb-4">
                            Add some products to get started
                          </p>
                          <Link
                            href="/products"
                            onClick={onClose}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Continue Shopping
                          </Link>
                        </div>
                      ) : (
                        <div className="px-4 py-6">
                          {/* Cart Items */}
                          <div className="space-y-4 mb-6">
                            <AnimatePresence>
                              {cart.items.map((item) => (
                                <CartItem key={item.id} item={item} compact />
                              ))}
                            </AnimatePresence>
                          </div>

                          {/* Clear Cart Button */}
                          {cart.items.length > 0 && (
                            <button
                              onClick={handleClearCart}
                              disabled={clearCart.isPending}
                              className="w-full text-sm text-red-600 hover:text-red-700 py-2 disabled:opacity-50"
                            >
                              {clearCart.isPending ? 'Clearing...' : 'Clear Cart'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer with Summary and Actions */}
                    {cart && cart.items.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6">
                        <CartSummary cart={cart} />
                        
                        <div className="mt-6 space-y-3">
                          <Link
                            href="/cart"
                            onClick={onClose}
                            className="w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-md text-center font-medium hover:bg-gray-200 transition-colors block"
                          >
                            View Cart
                          </Link>
                          
                          <Link
                            href="/checkout"
                            onClick={onClose}
                            className="w-full bg-blue-600 text-white px-4 py-3 rounded-md text-center font-medium hover:bg-blue-700 transition-colors block"
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
  );
}