'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, useCreateOrder } from '@/hooks/useCart';
import { useAuthStatus } from '@/hooks/useAuth';
import { CartSummary } from '@/components/cart/CartSummary';
import { ArrowLeftIcon, CreditCardIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Script from 'next/script';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const { isAuthenticated, isLoading: authLoading, user } = useAuthStatus();
  const createOrder = useCreateOrder();
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', '/checkout');
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      const defaultAddress = user.addresses?.find((a: any) => a.isDefault) || user.addresses?.[0];
      
      setFormData(prev => ({
        ...prev,
        email: user.email,
        phone: defaultAddress?.phone || user.phone || '',
        firstName: defaultAddress?.firstName || '',
        lastName: defaultAddress?.lastName || '',
        address: defaultAddress?.address || '',
        city: defaultAddress?.city || '',
        state: defaultAddress?.state || '',
        zipCode: defaultAddress?.zipCode || '',
        country: defaultAddress?.country || 'US',
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const orderData = {
        items: cart.items.map(item => ({
          productId: item.productId,
          variationId: item.variationId,
          quantity: item.quantity,
          price: item.variation?.offerPrice || item.variation?.price || item.product.offerPrice || item.product.price,
        })),
        total: cart.totalOfferPrice || cart.totalPrice,
      };

      // 1. Get Razorpay Order ID from backend
      const response = await fetch('/api/orders/razorpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total: orderData.total }),
      });
      
      const rzpData = await response.json();
      
      if (!response.ok) {
        toast.error(rzpData.error || 'Failed to initialize payment');
        return;
      }

      // 2. Open Razorpay overlay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '', // Expose this safely to frontend
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: 'Aamvaraah',
        description: 'Order Payment',
        order_id: rzpData.id,
        handler: async function (paymentResponse: any) {
          try {
            // 3. Verify on backend & create order
            const finalOrderData = {
              ...orderData,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            };

            const order = await createOrder.mutateAsync(finalOrderData);
            
            // Redirect to order confirmation
            router.push(`/orders/${order.id}`);
          } catch (err: any) {
            toast.error(err.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#BD9958',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (paymentResponse: any) {
        toast.error(paymentResponse.error.description || 'Payment Failed');
      });
      
      rzp.open();
      
    } catch {
      toast.error('An unexpected error occurred during checkout');
    }
  };

  if (isLoading || authLoading) {
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

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#27190B] py-8 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-24 bg-[#191919] rounded-2xl border border-[#BD9958]/20 shadow-2xl">
            <h1 className="text-3xl font-semibold text-[#BD9958] font-cormorant mb-4 tracking-wide">Your cart is empty</h1>
            <p className="text-[#BD9958]/70 mb-8 text-lg">Add some items to your journey before checking out.</p>
            <Link
              href="/products"
              className="bg-[#BD9958] text-[#27190B] px-8 py-3 rounded-md font-semibold hover:bg-[#FFD700] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Common input classes
  const inputClasses = "w-full px-4 py-3 bg-transparent border border-[#BD9958]/30 rounded-md focus:outline-none focus:ring-1 focus:ring-[#BD9958] focus:border-[#BD9958] text-white placeholder-[#BD9958]/40 transition-colors";
  const labelClasses = "block text-sm font-medium text-[#BD9958] mb-2";

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="min-h-screen bg-[#27190B] py-8 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/cart"
            className="inline-flex items-center text-[#BD9958] hover:text-[#FFD700] mb-4 transition-colors font-cormorant text-lg"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Cart
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#BD9958] font-cormorant tracking-wide">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="lg:grid lg:grid-cols-12 lg:gap-10">
            {/* Checkout Form */}
            <div className="lg:col-span-8">
              <div className="space-y-8">
                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#191919] rounded-2xl shadow-xl border border-[#BD9958]/20 p-6 md:p-8"
                >
                  <h2 className="text-2xl font-semibold text-[#BD9958] font-cormorant mb-6 tracking-wide">Contact Information</h2>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="email" className={labelClasses}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Shipping Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-[#191919] rounded-2xl shadow-xl border border-[#BD9958]/20 p-6 md:p-8"
                >
                  <h2 className="text-2xl font-semibold text-[#BD9958] font-cormorant mb-6 flex items-center tracking-wide">
                    <TruckIcon className="h-6 w-6 mr-3 text-[#BD9958]" />
                    Shipping Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className={labelClasses}>
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="First Name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className={labelClasses}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="Last Name"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="address" className={labelClasses}>
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="Street address, P.O. box, etc."
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="city" className={labelClasses}>
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="City"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className={labelClasses}>
                        State / Province
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="State"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="zipCode" className={labelClasses}>
                        ZIP / Postal Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="ZIP Code"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className={labelClasses}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Payment Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#191919] rounded-2xl shadow-xl border border-[#BD9958]/20 p-6 md:p-8"
                >
                  <h2 className="text-2xl font-semibold text-[#BD9958] font-cormorant mb-4 flex items-center tracking-wide">
                    <CreditCardIcon className="h-6 w-6 mr-3 text-[#BD9958]" />
                    Payment Method
                  </h2>
                  <div className="p-4 rounded-lg bg-[#27190B] border border-[#BD9958]/10 text-center">
                    <p className="text-base text-[#BD9958]/80 leading-relaxed">
                      Payment will be processed securely via <span className="text-[#BD9958] font-semibold">Razorpay</span> upon clicking "Proceed to Payment". All major credit cards, UPI, and net banking are supported.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="sticky top-24">
                <CartSummary cart={cart} className="mb-6" />
                
                <div className="text-center text-[#BD9958]/80 text-sm mb-4">
                  * All prices are inclusive of taxes.
                </div>

                <button
                  type="submit"
                  disabled={createOrder.isPending}
                  className="w-full bg-[#BD9958] text-[#27190B] px-6 py-4 rounded-md font-semibold hover:bg-[#FFD700] hover:shadow-[0_0_15px_rgba(255,215,0,0.4)] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg tracking-wide shadow-lg"
                >
                  {createOrder.isPending ? 'Processing...' : 'Proceed to Payment'}
                </button>

                {/* Security Features */}
                <div className="mt-8 space-y-4 p-5 rounded-xl border border-[#BD9958]/10 bg-[#191919]/50">
                  <div className="flex items-center text-sm font-medium text-[#BD9958]/90">
                    <ShieldCheckIcon className="h-5 w-5 text-[#BD9958] mr-3" />
                    SSL Encrypted Checkout
                  </div>
                  <div className="flex items-center text-sm font-medium text-[#BD9958]/90">
                    <TruckIcon className="h-5 w-5 text-[#BD9958] mr-3" />
                    Free Delivery on Special Orders
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}