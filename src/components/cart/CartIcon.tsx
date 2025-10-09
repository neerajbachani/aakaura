'use client';

import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';

interface CartIconProps {
  onClick?: () => void;
  className?: string;
}

export function CartIcon({ onClick, className = '' }: CartIconProps) {
  const { data: cart, isLoading } = useCart();

  const itemCount = cart?.totalItems || 0;

  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-gray-600 hover:text-gray-900 transition-colors ${className}`}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingCartIcon className="h-6 w-6" />
      
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.span>
        )}
      </AnimatePresence>

      {isLoading && (
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-gray-300 rounded-full animate-pulse" />
      )}
    </button>
  );
}