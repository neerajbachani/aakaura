"use client";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { SplashScreenProvider } from "@/context/SplashScreenProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { Cormorant_Garamond } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";


const CormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
});


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isHomePage = pathname === "/";

  return (
    <ViewTransitions>
      <html lang="en">
        <head>
          <script
            defer
            data-domain="aakaura.in"
            src="https://analytics.aakaura.in/js/script.js"
          ></script>
        </head>
        <body className={`${CormorantGaramond.variable} bg-[#27190B]`}>
          <Toaster />
          <QueryProvider>
            {/* <SplashScreenProvider> */}
              {!isAdminRoute && !isHomePage && <Navbar />}
              <main className={`${!isAdminRoute}`}>
                {/* <SmoothScroll> */}
                {children}
                {/* </SmoothScroll> */}
                </main>
              {!isAdminRoute && <Footer />}
            {/* </SplashScreenProvider> */}
          </QueryProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
