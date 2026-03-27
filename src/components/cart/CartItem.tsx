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
      className={`flex gap-4 p-4 bg-transparent rounded-xl border ${compact ? 'border-[#BD9958]/10' : 'border-[#BD9958]/20'} hover:border-[#BD9958]/40 transition-colors`}
    >
      {/* Product Image */}
      <div className={`flex-shrink-0 ${compact ? 'w-16 h-16' : 'w-24 h-24'}`}>
        <Image
          src={item.product.images[0] || '/placeholder-product.jpg'}
          alt={item.product.name}
          width={compact ? 64 : 96}
          height={compact ? 64 : 96}
          className="w-full h-full object-cover rounded-lg border border-[#BD9958]/20"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className={`font-semibold text-[#BD9958] font-cormorant tracking-wide ${compact ? 'text-lg' : 'text-xl md:text-2xl'} truncate`}>
          {item.product.name}
        </h3>
        
        {item.variation && (
          <p className={`text-[#BD9958]/70 ${compact ? 'text-xs' : 'text-sm'} mt-1`}>
            {item.variation.name}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-3 mt-2">
          <span className={`font-medium text-white ${compact ? 'text-sm' : 'text-base'}`}>
            ₹{currentPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className={`text-[#BD9958]/50 line-through ${compact ? 'text-xs' : 'text-sm'}`}>
              ₹{originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border border-[#BD9958]/30 rounded-md overflow-hidden bg-[#27190B]/50">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || updateCartItem.isPending}
              className="p-1.5 text-[#BD9958] hover:bg-[#BD9958]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            
            <span className="px-3 py-1 text-sm font-medium min-w-[2.5rem] text-center text-white">
              {quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 99 || updateCartItem.isPending}
              className="p-1.5 text-[#BD9958] hover:bg-[#BD9958]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Item Total */}
          <div className="text-right">
            <p className={`font-bold text-[#BD9958] ${compact ? 'text-sm' : 'text-lg'}`}>
              ₹{itemTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <div className="flex-shrink-0 ml-2">
        <button
          onClick={handleRemove}
          disabled={removeFromCart.isPending}
          className="p-2 text-[#BD9958]/50 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all disabled:opacity-50"
          aria-label="Remove item"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}