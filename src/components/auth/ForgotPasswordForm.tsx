"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations/auth";
import { useForgotPassword } from "@/hooks/useAuth";

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      await forgotPassword.mutateAsync(data);
      setSubmitted(true);
    } catch {
      // Error handled by mutation
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto bg-[#27190B] p-8 sm:p-10 rounded-2xl border border-[#BD9958]/20 shadow-2xl">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-medium text-[#BD9958] font-cormorant tracking-wide">
            Check Your Email
          </h2>
          <p className="text-[#BD9958]/70 mt-6 font-cormorant text-lg leading-relaxed">
            If an account exists with that email, we&apos;ve sent reset instructions.
            The link will expire in 1 hour.
          </p>
          <Link
            href="/auth/login"
            className="inline-block mt-8 text-primaryRed border-b border-transparent hover:border-primaryRed font-cormorant text-lg transition-all duration-300"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-[#27190B] p-8 sm:p-10 rounded-2xl border border-[#BD9958]/20 shadow-2xl">
      <div className="text-center mb-10">
        <h2 className="text-4xl sm:text-5xl font-medium text-[#BD9958] font-cormorant tracking-wide">
          Forgot Password
        </h2>
        <p className="text-[#BD9958]/70 mt-3 font-cormorant text-lg">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="relative group">
          <input
            {...register("email")}
            type="email"
            id="forgot-email"
            className="w-full px-0 py-3 bg-transparent border-b border-[#BD9958]/30 font-cormorant text-lg text-[#BD9958] focus:outline-none focus:border-[#BD9958] focus:ring-0 peer transition-colors"
            placeholder=" "
          />
          <label
            htmlFor="forgot-email"
            className="absolute left-0 top-3 text-[#BD9958]/60 font-cormorant text-lg transition-all duration-300 transform -translate-y-8 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 peer-focus:text-[#BD9958]"
          >
            Email Address
          </label>
          {errors.email && (
            <p className="text-red-400 text-sm mt-1 absolute -bottom-5 left-0">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting || forgotPassword.isPending}
            className="w-full bg-[#BD9958] text-[#27190B] py-3 px-4 rounded-lg font-semibold tracking-wider hover:bg-[#BD9958]/90 focus:outline-none focus:ring-2 focus:ring-[#BD9958]/50 focus:ring-offset-2 focus:ring-offset-[#27190B] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg active:scale-[0.98]"
          >
            {isSubmitting || forgotPassword.isPending ? "Sending..." : "Send Reset Link"}
          </button>
        </div>

        <div className="text-center">
          <Link
            href="/auth/login"
            className="text-[#BD9958]/70 font-cormorant text-lg hover:text-[#BD9958] transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
