"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/cart";

const navItems = [
  { href: "/", label: "Hem", icon: "H" },
  { href: "/search", label: "Sök", icon: "S" },
  { href: "/cart", label: "Varukorg", icon: "C" },
];

export const BottomNav = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[rgba(205,165,111,0.45)] bg-[linear-gradient(180deg,#25180f_0%,#140d08_100%)] backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between py-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1 text-[11px] font-medium tracking-[0.04em] transition ${
                isActive ? "text-[var(--lux-gold)]" : "text-[rgba(232,206,169,0.68)]"
              }`}
              aria-label={item.label}
            >
              <span className="relative text-lg [text-shadow:0_0_12px_rgba(205,165,111,0.25)]">
                {item.icon}
                {item.href === "/cart" && totalItems > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full border border-[rgba(240,214,174,0.7)] bg-[linear-gradient(145deg,#cda56f,#b18450)] px-1 text-[10px] font-semibold text-[var(--lux-dark)]">
                    {totalItems}
                  </span>
                )}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
