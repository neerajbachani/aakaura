"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { useLogin } from "@/hooks/useAuth";
import { formatGuestCartForAPI } from "@/lib/guestCart";

interface LoginFormProps {
  onSwitchToSignup?: () => void;
  onClose?: () => void;
}

export function LoginForm({ onSwitchToSignup, onClose }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      // Include guest cart for merging
      const guestCart = formatGuestCartForAPI();
      await login.mutateAsync({
        ...data,
        guestCart: guestCart.length > 0 ? guestCart : undefined,
      });
      onClose?.();
    } catch {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#27190B] p-8 sm:p-10 rounded-2xl border border-[#BD9958]/20 shadow-2xl">
      <div className="text-center mb-10">
        <h2 className="text-4xl sm:text-5xl font-medium text-[#BD9958] font-cormorant tracking-wide">
          Welcome Back
        </h2>
        <p className="text-[#BD9958]/70 mt-3 font-cormorant text-lg">
          Sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Email */}
        <div className="relative group">
          <input
            {...register("email")}
            type="email"
            id="email"
            className="w-full px-0 py-3 bg-transparent border-b border-[#BD9958]/30 font-cormorant text-lg text-[#BD9958] focus:outline-none focus:border-[#BD9958] focus:ring-0 peer transition-colors"
            placeholder=" "
          />
          <label
            htmlFor="email"
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

        {/* Password */}
        <div className="relative group pt-2">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            id="password"
            className="w-full px-0 py-3 pr-10 bg-transparent border-b border-[#BD9958]/30 font-cormorant text-lg text-[#BD9958] focus:outline-none focus:border-[#BD9958] focus:ring-0 peer transition-colors"
            placeholder=" "
          />
          <label
            htmlFor="password"
            className="absolute left-0 top-5 text-[#BD9958]/60 font-cormorant text-lg transition-all duration-300 transform -translate-y-8 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 peer-focus:text-[#BD9958]"
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 top-2 flex items-center px-2 text-[#BD9958]/60 hover:text-[#BD9958] transition-colors"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
          {errors.password && (
            <p className="text-red-400 text-sm mt-1 absolute -bottom-5 left-0">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting || login.isPending}
            className="w-full bg-[#BD9958] text-[#27190B] py-3 px-4 rounded-lg font-semibold tracking-wider hover:bg-[#BD9958]/90 focus:outline-none focus:ring-2 focus:ring-[#BD9958]/50 focus:ring-offset-2 focus:ring-offset-[#27190B] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg active:scale-[0.98]"
          >
            {isSubmitting || login.isPending ? "Signing in..." : "Sign In"}
          </button>
        </div>

        {/* Switch to Signup */}
        {onSwitchToSignup && (
          <div className="text-center mt-6">
            <p className="text-[#BD9958]/70 font-cormorant text-lg">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-primaryRed border-b border-transparent hover:border-primaryRed font-medium transition-all duration-300 ml-1"
              >
                Sign up
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
