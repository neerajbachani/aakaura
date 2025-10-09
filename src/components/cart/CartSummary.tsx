'use client';

import { Cart } from '@/types/Cart';

interface CartSummaryProps {
  cart: Cart;
  showDetails?: boolean;
  className?: string;
}

export function CartSummary({ cart, showDetails = true, className = '' }: CartSummaryProps) {
  const hasDiscount = cart.totalOfferPrice && cart.totalOfferPrice < cart.totalPrice;
  const savings = hasDiscount ? cart.totalPrice - cart.totalOfferPrice : 0;

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-2">
        {showDetails && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Items ({cart.totalItems})</span>
              <span className="text-gray-900">₹{cart.totalPrice.toFixed(2)}</span>
            </div>
            
            {hasDiscount && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Savings</span>
                <span className="text-green-600">-₹{savings.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900">Free</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900">Calculated at checkout</span>
            </div>
            
            <hr className="my-3" />
          </>
        )}
        
        <div className="flex justify-between text-lg font-semibold">
          <span className="text-gray-900">Total</span>
          <div className="text-right">
            {hasDiscount ? (
              <>
                <span className="text-gray-900">₹{cart.totalOfferPrice!.toFixed(2)}</span>
                <div className="text-sm text-gray-500 line-through">
                  ₹{cart.totalPrice.toFixed(2)}
                </div>
              </>
            ) : (
              <span className="text-gray-900">₹{cart.totalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
        
        {hasDiscount && (
          <div className="text-sm text-green-600 text-right">
            You save ₹{savings.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}