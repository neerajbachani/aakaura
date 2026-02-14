import "./globals.css";
import { Cormorant_Garamond } from "next/font/google";
import ClientLayout from "./ClientLayout";
import { getUniqueCategories } from "@/actions/get-categories";

const CormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
});

export const metadata = {
  title: "Aakaura",
  description: "Aakaura - Journey through Chakras",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const categories = await getUniqueCategories();

  return (
    <html lang="en">
      <head>
        <script
          defer
          data-domain="aakaura.in"
          src="https://analytics.aakaura.in/js/script.js"
        ></script>
      </head>
      <body className={`${CormorantGaramond.variable} bg-[#27190B]`}>
        <ClientLayout categories={categories}>{children}</ClientLayout>
      </body>
    </html>
  );
}
