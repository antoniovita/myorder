'use client';

import { LayoutDashboard, ShoppingCart, Utensils, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { CartProvider } from '@/context/CartContext'; // importa o provider

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const providerId = typeof params?.providerId === 'string' ? params.providerId : null;

  return (
    <CartProvider> {/* <- envolve aqui */}
      <div className="flex flex-col min-h-screen">
        <Navbar providerId={providerId} />
        <main className="flex-1 p-6 bg-gradient-to-b from-white to-blue-50">
          {children}
        </main>
      </div>
    </CartProvider>
  );
}

function Navbar({ providerId }: { providerId: string | null }) {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute left-0">
            <Link href={providerId ? `/provider-page/${providerId}` : '#'}>
              <div className="flex items-center text-blue-600 hover:text-blue-900 transition-colors">
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline text-sm sm:text-base font-semibold">Voltar</span>
              </div>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 space-x-4 sm:space-x-6 text-sm sm:text-base">
            <NavLink href={`/provider-page/${providerId}/items`} icon={Utensils}>
              Produtos
            </NavLink>
            <NavLink href={`/provider-page/${providerId}/order`} icon={LayoutDashboard}>
              Pedidos
            </NavLink>
            <NavLink href={`/provider-page/${providerId}/cart`} icon={ShoppingCart}>
              Carrinho
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon: Icon, children }: { href: string; icon: React.ElementType; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-1 sm:gap-2 font-medium transition-colors ${
        isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-700'}`} />
      <span className="hidden sm:inline">{children}</span>
    </Link>
  );
}
