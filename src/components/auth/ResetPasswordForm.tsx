"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { resetPasswordSchema, ResetPasswordInput } from "@/lib/validations/auth";
import { useResetPassword } from "@/hooks/useAuth";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      await resetPassword.mutateAsync(data);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#27190B] p-8 sm:p-10 rounded-2xl border border-[#BD9958]/20 shadow-2xl">
      <div className="text-center mb-10">
        <h2 className="text-4xl sm:text-5xl font-medium text-[#BD9958] font-cormorant tracking-wide">
          Reset Password
        </h2>
        <p className="text-[#BD9958]/70 mt-3 font-cormorant text-lg">
          Choose a new password for your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <input type="hidden" {...register("token")} />

        <div className="relative group pt-2">
          <input
            {...register("newPassword")}
            type={showPassword ? "text" : "password"}
            id="new-password"
            className="w-full px-0 py-3 pr-10 bg-transparent border-b border-[#BD9958]/30 font-cormorant text-lg text-[#BD9958] focus:outline-none focus:border-[#BD9958] focus:ring-0 peer transition-colors"
            placeholder=" "
          />
          <label
            htmlFor="new-password"
            className="absolute left-0 top-5 text-[#BD9958]/60 font-cormorant text-lg transition-all duration-300 transform -translate-y-8 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 peer-focus:text-[#BD9958]"
          >
            New Password
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
          {errors.newPassword && (
            <p className="text-red-400 text-sm mt-1 absolute -bottom-5 left-0">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="relative group pt-2">
          <input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            id="confirm-password"
            className="w-full px-0 py-3 pr-10 bg-transparent border-b border-[#BD9958]/30 font-cormorant text-lg text-[#BD9958] focus:outline-none focus:border-[#BD9958] focus:ring-0 peer transition-colors"
            placeholder=" "
          />
          <label
            htmlFor="confirm-password"
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

        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting || resetPassword.isPending}
            className="w-full bg-[#BD9958] text-[#27190B] py-3 px-4 rounded-lg font-semibold tracking-wider hover:bg-[#BD9958]/90 focus:outline-none focus:ring-2 focus:ring-[#BD9958]/50 focus:ring-offset-2 focus:ring-offset-[#27190B] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg active:scale-[0.98]"
          >
            {isSubmitting || resetPassword.isPending ? "Resetting..." : "Reset Password"}
          </button>
        </div>

        <div className="text-center">
          <Link
            href="/auth/forgot-password"
            className="text-[#BD9958]/70 font-cormorant text-lg hover:text-[#BD9958] transition-colors"
          >
            Request a new link
          </Link>
        </div>
      </form>
    </div>
  );
}
