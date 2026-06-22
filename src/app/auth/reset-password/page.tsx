'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto bg-[#27190B] p-8 sm:p-10 rounded-2xl border border-[#BD9958]/20 shadow-2xl text-center">
        <h2 className="text-4xl sm:text-5xl font-medium text-[#BD9958] font-cormorant tracking-wide">
          Invalid Link
        </h2>
        <p className="text-[#BD9958]/70 mt-6 font-cormorant text-lg leading-relaxed">
          This password reset link is invalid or missing. Please request a new one.
        </p>
        <Link
          href="/auth/forgot-password"
          className="inline-block mt-8 text-primaryRed border-b border-transparent hover:border-primaryRed font-cormorant text-lg transition-all duration-300"
        >
          Request Reset Link
        </Link>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/auth/login"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Sign In
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="min-h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BD9958]"></div>
            </div>
          }
        >
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
