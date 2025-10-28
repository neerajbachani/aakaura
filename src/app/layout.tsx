"use client";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { SplashScreenProvider } from "@/context/SplashScreenProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { Besley, Cormorant_Garamond, Montserrat } from "next/font/google";


// const montserrat = Montserrat({
//   subsets: ["latin"],
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   variable: "--font-montserrat",
// });

// const besley = Besley({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800", "900"],
//   variable: "--font-besley",
// });

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

  return (
    <html lang="en">
      <head>
        <script
          defer
          data-domain="aakaura.in"
          src="https://analytics.aakaura.in/js/script.js"
        ></script>
      </head>
      <body className={`${CormorantGaramond.variable} bg-primaryBeige`}>
        <Toaster />
        <QueryProvider>
          <SplashScreenProvider>
            {!isAdminRoute && <Navbar />}
            <main className={`${!isAdminRoute}`}>
              <SmoothScroll>
              {children}
              </SmoothScroll>
              </main>
            {!isAdminRoute && <Footer />}
          </SplashScreenProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
