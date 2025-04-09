'use client';

import { LayoutDashboard, ShoppingCart, Utensils } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [providerId, setProviderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAuthData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/token', { credentials: 'include' });
        if (!response.ok) throw new Error('Falha ao obter credenciais');

        const data = await response.json();
        setProviderId(data.id || null);
      } catch (err) {
        setError('Erro ao buscar credenciais.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthData();
  }, []);

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
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href={providerId ? `/provider-page/${providerId}` : '#'}>
            <h1 className="text-blue-600 hover:underline transition">Voltar</h1>
          </Link>
          <div className="flex space-x-6">
            <Link href="/dashboard/produtos" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
              <Utensils className="w-5 h-5" />
              <span>Produtos</span>
            </Link>
            <Link href="/dashboard/pedidos" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span>Pedidos</span>
            </Link>
            <Link href="/dashboard/carrinho" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span>Carrinho</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
