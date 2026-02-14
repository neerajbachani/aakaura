"use client";

import Navbar from "@/components/Navbar";
import { QueryProvider } from "@/providers/QueryProvider";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { ViewTransitions } from "next-view-transitions";

export default function ClientLayout({
  children,
  categories,
}: {
  children: React.ReactNode;
  categories: string[];
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isHomePage = pathname === "/";

  return (
    <ViewTransitions>
      <Toaster />
      <QueryProvider>
        {!isAdminRoute && !isHomePage && <Navbar categories={categories} />}
        <main className={`${!isAdminRoute}`}>
          <SmoothScroll>{children}</SmoothScroll>
        </main>
        {!isAdminRoute && <Footer />}
      </QueryProvider>
    </ViewTransitions>
  );
}
