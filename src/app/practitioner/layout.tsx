"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/admin/Shared/LoadingSpinner";

export default function PractitionerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuthStatus();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      sessionStorage.setItem("redirectAfterLogin", "/practitioner");
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isLoading && user && (user as { role?: string }).role !== "PRACTITIONER") {
      router.push("/");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-primaryBrown">Aakaura Practitioner Portal</h1>
          <p className="text-sm text-gray-600">{user?.name || user?.email}</p>
        </div>
      </header>
      {children}
    </div>
  );
}
