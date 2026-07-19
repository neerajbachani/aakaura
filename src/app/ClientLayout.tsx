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
  const isPractitionerRoute = pathname?.startsWith("/practitioner");
  const hideChrome = isAdminRoute || isPractitionerRoute;
  const isHomePage = pathname === "/";

  return (
    <ViewTransitions>
      <Toaster />
      <QueryProvider>
        {!hideChrome && !isHomePage && <Navbar categories={categories} />}
        <main className={`${!hideChrome}`}>
          <SmoothScroll>{children}</SmoothScroll>
        </main>
        {!hideChrome && <Footer />}
      </QueryProvider>
    </ViewTransitions>
  );
}
