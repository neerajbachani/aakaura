'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

interface AnimatedTextProps {
  text?: string;
  className?: string;
}

type PaymentStatus = 'idle' | 'loading' | 'verifying' | 'success' | 'error';

export default function AnimatedText({
  text = "Still searching? Your search ends now.",
  className = ""
}: AnimatedTextProps) {
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  const [mounted, setMounted] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Explicit direction sets
  const upChars = new Set(['S', 'o', ',']);
  const downChars = new Set(['a', 'r', 'e']);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const pinWrapper = pinWrapperRef.current;
    const textWrapper = textWrapperRef.current;
    const letters = lettersRef.current;

    if (!pinWrapper || !textWrapper || letters.length === 0) return;

    let scrollProgress = 0;

    function updateAnimation() {
      if (!pinWrapper || !textWrapper) return;

      const rect = pinWrapper.getBoundingClientRect();
      const pinWrapperHeight = pinWrapper.offsetHeight;
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      // Global scroll progress across pinned section (0..1)
      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        scrollProgress = Math.abs(rect.top) / (pinWrapperHeight - windowHeight);
        scrollProgress = Math.max(0, Math.min(1, scrollProgress));
      } else if (rect.top > 0) {
        scrollProgress = 0;
      } else {
        scrollProgress = 1;
      }

      // Show button when animation is nearly complete
      setShowButton(scrollProgress >= 0.9);

      // Horizontal translate
      const totalWidth = textWrapper.scrollWidth;
      const targetTranslateX = (windowWidth / 2) - totalWidth;
      const translateX = scrollProgress * targetTranslateX;

      textWrapper.style.transform = `translate3d(${translateX}px, 0, 0)`;

      // Per-letter threshold
      const thresholdX = windowWidth * 0.3;

      // Wave settings
      const baseAmplitude = 60;
      const frequency = 3.0;
      const staggerBase = 0.12;

      letters.forEach((letter, index) => {
        if (!letter) return;

        const r = letter.getBoundingClientRect();
        const centerX = r.left + r.width / 2;

        if (centerX <= thresholdX) {
          letter.style.transform = `translateY(0px) rotate(0deg)`;
          return;
        }

        const distance = Math.max(0, centerX - thresholdX);
        const fadeRange = windowWidth * 0.6;
        const rawFactor = Math.max(0, Math.min(1, distance / fadeRange));
        const amplitudeFactor = rawFactor * rawFactor;

        let sign = (index % 2 === 0) ? 1 : -1;
        const char = (letter.textContent || '').trim();
        if (upChars.has(char)) sign = -1;
        if (downChars.has(char)) sign = 1;

        const phase = (scrollProgress * 1.5) + (index * staggerBase);
        const angle = phase * Math.PI * frequency;

        const y = Math.sin(angle) * baseAmplitude * amplitudeFactor * sign;
        const rotation = Math.sin(angle * 0.7) * 3 * amplitudeFactor * sign;

        letter.style.transform = `translateY(${y}px) rotate(${rotation}deg)`;
      });
    }

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateAnimation();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateAnimation);
    updateAnimation();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateAnimation);
    };
  }, [mounted, upChars, downChars]);

  const handleJoinInnerCircle = useCallback(async () => {
    setPaymentStatus('loading');
    setErrorMsg('');

    try {
      // Step 1: Create Razorpay order
      const res = await fetch('/api/inner-circle/create', { method: 'POST' });
      const rzpData = await res.json();

      if (!res.ok) {
        setErrorMsg(rzpData.error || 'Failed to initialize payment');
        setPaymentStatus('error');
        return;
      }

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

      // Step 2: Open Razorpay modal
      const options = {
        key: keyId,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: 'Aakaura',
        description: "Join the Inner Circle — ₹5 Entry Fee",
        order_id: rzpData.id,
        theme: { color: '#BD9958' },
        modal: {
          ondismiss: () => {
            setPaymentStatus('idle');
          },
        },
        handler: async (paymentResponse: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          setPaymentStatus('verifying');

          // Step 3: Verify on server and get WhatsApp link
          try {
            const verifyRes = await fetch('/api/inner-circle/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success && verifyData.redirectUrl) {
              setPaymentStatus('success');
              setTimeout(() => {
                window.open(verifyData.redirectUrl, '_blank', 'noopener,noreferrer');
              }, 800);
            } else {
              setErrorMsg(verifyData.error || 'Payment verification failed');
              setPaymentStatus('error');
            }
          } catch {
            setErrorMsg('Verification failed. Please contact support.');
            setPaymentStatus('error');
          }
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const RazorpayConstructor = (window as unknown as { Razorpay: new (opts: typeof options) => { open: () => void; on: (event: string, cb: (r: { error: { description: string } }) => void) => void } }).Razorpay;
      const rzp = new RazorpayConstructor(options);
      rzp.on('payment.failed', (response: { error: { description: string } }) => {
        setErrorMsg(response.error.description || 'Payment failed');
        setPaymentStatus('error');
      });
      rzp.open();

      setPaymentStatus('idle'); // Reset while modal is open (handler takes over)
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setPaymentStatus('error');
    }
  }, []);

  // Split text into letters and spaces
  const renderText = () => {
    return text.split('').map((char, index) => {
      if (char === ' ') {
        return <span key={index} className="inline-block w-[0.3em]" />;
      }
      return (
        <span
          key={index}
          ref={(el) => {
            if (el) lettersRef.current[index] = el;
          }}
          className="inline-block will-change-transform"
        >
          {char}
        </span>
      );
    });
  };

  const isLoading = paymentStatus === 'loading' || paymentStatus === 'verifying';

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Pin wrapper */}
      <div ref={pinWrapperRef} className="h-[400vh] relative">
        <div className="sticky top-0 w-screen h-screen flex items-center overflow-hidden bg-[#27190B] text-white">

          {/* Scrolling text */}
          <div
            ref={textWrapperRef}
            className={`flex whitespace-nowrap text-[25vw] md:text-[16vw] lg:text-[12vw] font-bold leading-[0.9] tracking-[0.02em] pl-[100vw] will-change-transform ${className}`}
          >
            {renderText()}
          </div>

          {/* Inner Circle CTA — fades in at bottom-center when animation nears complete */}
          <AnimatePresence>
            {showButton && (
              <motion.div
                key="inner-circle-cta"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 pointer-events-auto px-4"
              >
                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="text-[#BD9958]/70 text-sm md:text-base text-center max-w-sm leading-snug tracking-wide"
                >
                  An exclusive community for those who have arrived.
                </motion.p>

                {/* Main CTA Button */}
                <motion.button
                  id="inner-circle-join-btn"
                  onClick={handleJoinInnerCircle}
                  disabled={isLoading || paymentStatus === 'success'}
                  whileHover={!isLoading && paymentStatus !== 'success' ? { scale: 1.04 } : {}}
                  whileTap={!isLoading && paymentStatus !== 'success' ? { scale: 0.97 } : {}}
                  className={`
                    relative group overflow-hidden
                    flex items-center gap-3
                    px-7 py-3.5 rounded-full
                    text-sm md:text-base font-semibold tracking-widest uppercase
                    transition-all duration-300
                    border border-[#BD9958]/60
                    ${paymentStatus === 'success'
                      ? 'bg-emerald-900/40 border-emerald-400/60 text-emerald-300 cursor-default'
                      : 'bg-[#27190B]/80 backdrop-blur-sm text-[#BD9958] hover:border-[#BD9958] hover:shadow-[0_0_28px_rgba(189,153,88,0.35)] cursor-pointer'
                    }
                    disabled:opacity-60 disabled:cursor-wait
                  `}
                >
                  {/* Shimmer sweep on hover */}
                  {paymentStatus !== 'success' && (
                    <span
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-[#BD9958]/15 to-transparent pointer-events-none"
                      aria-hidden="true"
                    />
                  )}

                  {/* Icon */}
                  {paymentStatus === 'success' ? (
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isLoading ? (
                    <svg className="w-4 h-4 animate-spin text-[#BD9958]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <FaWhatsapp className="w-4 h-4 text-[#BD9958]" />
                  )}

                  {/* Label */}
                  <span>
                    {paymentStatus === 'success'
                      ? 'Welcome to the Circle'
                      : paymentStatus === 'verifying'
                      ? 'Verifying…'
                      : paymentStatus === 'loading'
                      ? 'Preparing…'
                      : "Join the Aakaura Inner Circle"}
                  </span>

                  {/* Price tag — shown in idle state only */}
                  {(paymentStatus === 'idle' || paymentStatus === 'error') && (
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-[#BD9958]/15 text-[#BD9958] text-xs font-bold tracking-normal border border-[#BD9958]/30">
                      ₹5
                    </span>
                  )}
                </motion.button>

                {/* Fine print */}
                {(paymentStatus === 'idle' || paymentStatus === 'error') && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-[#BD9958]/40 text-xs text-center tracking-wide"
                  >
                    ₹5 entry fee · Redirected to WhatsApp after payment
                  </motion.p>
                )}

                {/* Error message */}
                <AnimatePresence>
                  {paymentStatus === 'error' && errorMsg && (
                    <motion.p
                      key="error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400/80 text-xs text-center mt-1"
                    >
                      {errorMsg}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Success hint */}
                <AnimatePresence>
                  {paymentStatus === 'success' && (
                    <motion.p
                      key="success"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-emerald-400/70 text-xs text-center"
                    >
                      Opening WhatsApp community…
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
}
