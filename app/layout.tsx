import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/store/cart";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";

const DEFAULT_SITE_URL = "http://localhost:3000";

function resolveMetadataBase(): URL {
  const candidate = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;

  try {
    return new URL(candidate);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

export const metadata: Metadata = {
  title: {
    default: "SparkDeal | Smarta fynd online",
    template: "%s | SparkDeal",
  },
  metadataBase: resolveMetadataBase(),
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
      <body className="min-h-screen bg-[var(--lux-bg)] text-[var(--lux-ink)] antialiased">
        <CartProvider>
          <TopBar />
          <main className="mx-auto w-full max-w-6xl pb-24 pt-6 md:px-6 md:pb-12">
            {children}
          </main>
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
