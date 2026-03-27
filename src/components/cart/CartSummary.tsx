"use client";

import { Cart } from "@/types/Cart";

interface CartSummaryProps {
  cart: Cart;
  showDetails?: boolean;
  className?: string;
}

export function CartSummary({
  cart,
  showDetails = true,
  className = "",
}: CartSummaryProps) {
  const hasDiscount =
    cart.totalOfferPrice && cart.totalOfferPrice < cart.totalPrice;
  const savings = hasDiscount ? cart.totalPrice - cart.totalOfferPrice! : 0;

  return (
    <div
      className={`bg-[#191919] rounded-2xl p-6 border border-[#BD9958]/20 shadow-xl ${className}`}
    >
      <h3 className="text-2xl font-cormorant font-semibold text-[#BD9958] mb-6 tracking-wide">
        Order Summary
      </h3>

      <div className="space-y-4">
        {showDetails && (
          <>
            <div className="flex justify-between text-base">
              <span className="text-[#BD9958]/80">
                Items ({cart.totalItems})
              </span>
              <span className="text-white">₹{cart.totalPrice.toFixed(2)}</span>
            </div>

            {hasDiscount && (
              <div className="flex justify-between text-base">
                <span className="text-green-400">Savings</span>
                <span className="text-green-400">-₹{savings.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-base">
              <span className="text-[#BD9958]/80">Shipping</span>
              <span className="text-white">Free</span>
            </div>

            {/* <div className="flex justify-between text-base">
              <span className="text-[#BD9958]/80">Tax</span>
              <span className="text-white">Inclusive</span>
            </div> */}

            <hr className="my-5 border-[#BD9958]/20" />
          </>
        )}

        <div className="flex justify-between text-2xl font-bold font-cormorant tracking-wide mt-2">
          <span className="text-[#BD9958]">Total</span>
          <div className="text-right">
            {hasDiscount ? (
              <>
                <span className="text-[#BD9958]">
                  ₹{cart.totalOfferPrice!.toFixed(2)}
                </span>
                <div className="text-sm font-sans font-normal text-[#BD9958]/50 line-through">
                  ₹{cart.totalPrice.toFixed(2)}
                </div>
              </>
            ) : (
              <span className="text-[#BD9958]">
                ₹{cart.totalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {hasDiscount && (
          <div className="text-sm text-green-400 text-right mt-1">
            You save ₹{savings.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}
