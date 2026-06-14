"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { signupSchema, SignupInput } from "@/lib/validations/auth";
import { useSignup, useUpdateProfile } from "@/hooks/useAuth";
import { formatGuestCartForAPI } from "@/lib/guestCart";
import { useRouter } from "next/navigation";

interface SignupFormProps {
  onSwitchToLogin?: () => void;
  onClose?: () => void;
}

export function SignupForm({ onSwitchToLogin, onClose }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);
  const [formData, setFormData] = useState<SignupInput | null>(null);
  
  const signup = useSignup({ disableRedirect: true });
  const updateProfile = useUpdateProfile();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    try {
      setFormData(data);
      // Include guest cart for merging
      const guestCart = formatGuestCartForAPI();
      await signup.mutateAsync({
        ...data,
        guestCart: guestCart.length > 0 ? guestCart : undefined,
      });
      setShowPhonePopup(true);
    } catch {
      // Error is handled by the mutation
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPhone(true);
    try {
      if (phoneNumber && formData) {
         await updateProfile.mutateAsync({ name: formData.name, email: formData.email, phone: phoneNumber });
      }
    } catch {
       // Ignore error
    } finally {
      setIsSubmittingPhone(false);
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectTo);
      onClose?.();
    }
  };

  const skipPhone = () => {
    const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
    sessionStorage.removeItem('redirectAfterLogin');
    router.push(redirectTo);
    onClose?.();
  };

  if (showPhonePopup) {
    return (
      <div className="w-full max-w-md mx-auto bg-[#27190B] p-8 sm:p-10 rounded-2xl border border-[#BD9958]/20 shadow-2xl text-center">
        <h2 className="text-3xl sm:text-4xl font-medium text-[#BD9958] font-cormorant tracking-wide mb-6">
          Welcome to Your Aakaura Space ✨
        </h2>
        <p className="text-[#BD9958]/70 mt-3 font-cormorant text-lg mb-8 leading-relaxed">
          Enter your number to stay connected to new drops, sacred pieces, and little gifts from the universe.
        </p>
        <form onSubmit={handlePhoneSubmit} className="space-y-6">
          <div className="relative group">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-0 py-3 bg-transparent border-b border-[#BD9958]/30 font-cormorant text-lg text-[#BD9958] focus:outline-none focus:border-[#BD9958] focus:ring-0 peer transition-colors"
              placeholder=" "
              id="popup-phone"
            />
            <label
              htmlFor="popup-phone"
              className="absolute left-0 top-3 text-[#BD9958]/60 font-cormorant text-lg transition-all duration-300 transform -translate-y-8 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 peer-focus:text-[#BD9958]"
            >
              Phone Number
            </label>
          </div>
          <button
            type="submit"
            disabled={isSubmittingPhone}
            className="w-full bg-[#BD9958] text-[#27190B] py-3 px-4 rounded-lg font-semibold tracking-wider hover:bg-[#BD9958]/90 focus:outline-none focus:ring-2 focus:ring-[#BD9958]/50 focus:ring-offset-2 focus:ring-offset-[#27190B] disabled:opacity-50 transition-all duration-300 shadow-lg active:scale-[0.98]"
          >
            {isSubmittingPhone ? "Saving..." : "Enter your Aura Information"}
          </button>
        </form>
        <button onClick={skipPhone} className="mt-4 text-[#BD9958]/50 hover:text-[#BD9958] text-sm transition-colors border-b border-transparent hover:border-[#BD9958]/50">
          Skip for now
        </button>
        <p className="text-[#BD9958]/50 mt-8 font-cormorant text-base italic">
          (And yes… your future self will thank you for signing in 🤍)
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-[#27190B] p-8 sm:p-10 rounded-2xl border border-[#BD9958]/20 shadow-2xl">
      <div className="text-center mb-10">
        <h2 className="text-4xl sm:text-5xl font-medium text-[#BD9958] font-cormorant tracking-wide">
          Create Account
        </h2>
        <p className="text-[#BD9958]/70 mt-3 font-cormorant text-lg">
          Join us and start shopping
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Name */}
        <div className="relative group">
          <input
            {...register("name")}
            type="text"
            id="name"
            className="w-full px-0 py-3 bg-transparent border-b border-[#BD9958]/30 font-cormorant text-lg text-[#BD9958] focus:outline-none focus:border-[#BD9958] focus:ring-0 peer transition-colors"
            placeholder=" "
          />
          <label
            htmlFor="name"
            className="absolute left-0 top-3 text-[#BD9958]/60 font-cormorant text-lg transition-all duration-300 transform -translate-y-8 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 peer-focus:text-[#BD9958]"
          >
            Full Name
          </label>
          {errors.name && (
            <p className="text-red-400 text-sm mt-1 absolute -bottom-5 left-0">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="relative group pt-2">
          <input
            {...register("email")}
            type="email"
            id="email"
            className="w-full px-0 py-3 bg-transparent border-b border-[#BD9958]/30 font-cormorant text-lg text-[#BD9958] focus:outline-none focus:border-[#BD9958] focus:ring-0 peer transition-colors"
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="absolute left-0 top-5 text-[#BD9958]/60 font-cormorant text-lg transition-all duration-300 transform -translate-y-8 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 peer-focus:text-[#BD9958]"
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

        {/* Confirm Password */}
        <div className="relative group pt-2">
          <input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            className="w-full px-0 py-3 pr-10 bg-transparent border-b border-[#BD9958]/30 font-cormorant text-lg text-[#BD9958] focus:outline-none focus:border-[#BD9958] focus:ring-0 peer transition-colors"
            placeholder=" "
          />
          <label
            htmlFor="confirmPassword"
            className="absolute left-0 top-5 text-[#BD9958]/60 font-cormorant text-lg transition-all duration-300 transform -translate-y-8 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 peer-focus:text-[#BD9958]"
          >
            Confirm Password
          </label>
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 top-2 flex items-center px-2 text-[#BD9958]/60 hover:text-[#BD9958] transition-colors"
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm mt-1 absolute -bottom-5 left-0">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-8">
          <button
            type="submit"
            disabled={isSubmitting || signup.isPending}
            className="w-full bg-[#BD9958] text-[#27190B] py-3 px-4 rounded-lg font-semibold tracking-wider hover:bg-[#BD9958]/90 focus:outline-none focus:ring-2 focus:ring-[#BD9958]/50 focus:ring-offset-2 focus:ring-offset-[#27190B] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg active:scale-[0.98]"
          >
            {isSubmitting || signup.isPending
              ? "Creating account..."
              : "Create Account"}
          </button>
        </div>

        {/* Switch to Login */}
        {onSwitchToLogin && (
          <div className="text-center mt-6">
            <p className="text-[#BD9958]/70 font-cormorant text-lg">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-primaryRed border-b border-transparent hover:border-primaryRed font-medium transition-all duration-300 ml-1"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
