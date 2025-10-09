'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { CartItem as CartItemType } from '@/types/Cart';
import { useUpdateCartItem, useRemoveFromCart } from '@/hooks/useCart';
import { motion } from 'framer-motion';

interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
}

export function CartItem({ item, compact = false }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > 99) return;
    
    setQuantity(newQuantity);
    updateCartItem.mutate({
      cartItemId: item.id,
      quantity: newQuantity,
    });
  };

  const handleRemove = () => {
    removeFromCart.mutate({ cartItemId: item.id });
  };

  const currentPrice = item.variation?.offerPrice || item.variation?.price || item.product.offerPrice || item.product.price;
  const originalPrice = item.variation?.price || item.product.price;
  const hasDiscount = currentPrice < originalPrice;

  const itemTotal = currentPrice * quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex gap-4 p-4 bg-white rounded-lg border ${compact ? 'border-gray-100' : 'border-gray-200'}`}
    >
      {/* Product Image */}
      <div className={`flex-shrink-0 ${compact ? 'w-16 h-16' : 'w-20 h-20'}`}>
        <Image
          src={item.product.images[0] || '/placeholder-product.jpg'}
          alt={item.product.name}
          width={compact ? 64 : 80}
          height={compact ? 64 : 80}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium text-gray-900 ${compact ? 'text-sm' : 'text-base'} truncate`}>
          {item.product.name}
        </h3>
        
        {item.variation && (
          <p className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'} mt-1`}>
            {item.variation.name}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
            ₹{currentPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className={`text-gray-500 line-through ${compact ? 'text-xs' : 'text-sm'}`}>
              ₹{originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || updateCartItem.isPending}
              className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            
            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
              {quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 99 || updateCartItem.isPending}
              className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Item Total */}
          <div className="text-right">
            <p className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
              ₹{itemTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <div className="flex-shrink-0">
        <button
          onClick={handleRemove}
          disabled={removeFromCart.isPending}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
          aria-label="Remove item"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}