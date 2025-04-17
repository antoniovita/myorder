"use client";

import React from "react";
import { LayoutDashboard, ShoppingCart, Utensils } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { CartProvider } from "@/context/CartContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ providerId: string }>();
  const providerId = params?.providerId;

  return (
    <CartProvider>
      <Navbar providerId={providerId} />
      <main className="pt-24 flex-1 min-h-screen bg-gradient-to-b from-white to-blue-50">{children}</main>
    </CartProvider>
  );
}

interface NavbarProps {
  providerId?: string;
}

function Navbar({ providerId }: NavbarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: `/provider-page/${providerId}/items`, icon: Utensils },
    { href: `/provider-page/${providerId}/cart`, icon: ShoppingCart },
    { href: `/provider-page/${providerId}/order`, icon: LayoutDashboard },
  ];

  return (
    <div className="fixed top-4 inset-x-0 flex justify-center z-50 pointer-events-none">
      <nav className="pointer-events-auto flex gap-10 bg-white/90 backdrop-blur shadow-sm ring-1 ring-gray-200 rounded-full px-6 py-3">
        {navItems.map(({ href, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center transition-colors ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Icon className="w-5 h-5" />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
