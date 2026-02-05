import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/store/cart";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "SparkDeal | Smarta fynd online",
    template: "%s | SparkDeal",
  },
  description:
    "Upptäck mobilvänlig shopping med tydliga rabatter, snabb kassa och handplockade fynd.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body
        className={`${manrope.variable} ${spaceGrotesk.variable} min-h-screen bg-slate-50 text-slate-900 antialiased`}
      >
        <CartProvider>
          <TopBar />
          <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 md:px-6 md:pb-12">
            {children}
          </main>
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
