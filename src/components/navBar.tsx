'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  LogIn,
  UserRound,
} from 'lucide-react';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const response = await fetch('/api/token', { credentials: 'include' });
        if (!response.ok) throw new Error('Falha ao obter credenciais');

        const data = await response.json();
        setToken(data.token || null);
      } catch (err) {
        console.log(err);
        console.error('Erro ao buscar credenciais.');
      }
    };

    fetchAuthData();
  }, []);

  return (
    <nav className="bg-white text-black py-4 px-6 md:px-12 fixed top-0 left-0 w-full z-50 transition-all">
      <div className="flex justify-between items-center max-w-7xl mx-auto">

        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-extrabold text-blue-800">order</h1>

          <div className="hidden md:flex items-center gap-6 text-sm mt-2 font-semibold">
            <Link
              href="/services"
              className="flex items-center gap-1 text-gray-800 hover:text-blue-800 transition"
            >
              Planos
            </Link>

            <Link
              href="/about"
              className="text-gray-800 hover:text-blue-800 transition"
            >
              Sobre nós
            </Link>
          </div>
        </div>


        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/business"
            className="bg-gray-100 text-black text-sm font-medium p-3 rounded-xl flex items-center gap-2 hover:bg-gray-100 transition"
          >
            Criar cardápio
          </Link>

          {!token ? (
            <Link
              href="/login"
              className="bg-blue-800 text-white font-medium text-sm p-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <LogIn size={18} /> Login
            </Link>
          ) : (
            <Link
              href="/account"
              className="flex items-center justify-center w-10 h-10 bg-blue-800 rounded-full"
            >
              <UserRound color="white" />
            </Link>
          )}
        </div>

        {/* Ações - mobile */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} className='text-black' /> : <Menu size={28} className='text-black'/>}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="md:hidden text-xl mt-4 px-4 py-4 bg-white rounded-lg flex flex-col gap-4 text-black font-medium">
          <Link href="/business" className="hover:text-blue-800  border-b py-3 transition">Dashboard</Link>
          <Link href="/services" className="flex items-center gap-2 border-b py-3">
           Planos
          </Link>
          <Link href="/about" className="hover:text-blue-800 transition border-b py-3">Sobre nós</Link>
          <Link href="/business" className="flex items-center gap-2">
           Criar cardápio
          </Link>
        </div>
      )}
    </nav>
  );
}
