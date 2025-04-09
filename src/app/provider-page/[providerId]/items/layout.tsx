'use client';

import { LayoutDashboard, ShoppingCart, Utensils, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const providerId = typeof params?.providerId === 'string' ? params.providerId : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar providerId={providerId} />
      <main className="flex-1 p-6 bg-gradient-to-b from-white to-blue-50">
        {children}
      </main>
    </div>
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
            <NavLink href="/dashboard/produtos" icon={<Utensils className="w-5 h-5" />}>
              Produtos
            </NavLink>
            <NavLink href="/dashboard/pedidos" icon={<LayoutDashboard className="w-5 h-5" />}>
              Pedidos
            </NavLink>
            <NavLink href="/dashboard/carrinho" icon={<ShoppingCart className="w-5 h-5" />}>
              Carrinho
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
    >
      {icon}
      <span className="hidden sm:inline">{children}</span>
    </Link>
  );
}
