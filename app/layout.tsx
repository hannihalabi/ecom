import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/store/cart";

const DEFAULT_SITE_URL = "http://localhost:3000";

function resolveMetadataBase(): URL {
  const candidate = process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_SITE_URL;

  try {
    return new URL(candidate);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

export const metadata: Metadata = {
  title: {
    default: "SparkDeal | Handgjorda vaskor",
    template: "%s | SparkDeal",
  },
  metadataBase: resolveMetadataBase(),
  description:
    "Handgjord vaska likt originalet i topp klass.",
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
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
