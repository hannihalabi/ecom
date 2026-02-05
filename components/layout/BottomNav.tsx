"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/cart";

const navItems = [
  { href: "/", label: "Hem", icon: "H" },
  { href: "/search", label: "Sök", icon: "S" },
  { href: "/cart", label: "Varukorg", icon: "C" },
  { href: "/orders", label: "Ordrar", icon: "O" },
  { href: "/account", label: "Konto", icon: "A" },
];

export const BottomNav = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1 text-[11px] font-medium transition ${
                isActive ? "text-slate-900" : "text-slate-400"
              }`}
              aria-label={item.label}
            >
              <span className="relative text-lg">
                {item.icon}
                {item.href === "/cart" && totalItems > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-semibold text-white">
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
