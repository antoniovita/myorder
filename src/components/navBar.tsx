'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  Briefcase,
  LogIn,
  UserRound,
  PlusCircle,
  ChevronDown,
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
        console.error('Erro ao buscar credenciais.');
      }
    };

    fetchAuthData();
  }, []);

  return (
    <nav className="bg-orange-500 text-white py-4 px-6 md:px-12 fixed top-0 left-0 w-full z-50 shadow-md transition-all">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-extrabold">order</h1>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link
              href="/business"
              className="bg-white text-orange-500 px-4 py-2 rounded-xl shadow hover:bg-gray-100 transition"
            >
              Dashboard
            </Link>

            <Link
              href="/services"
              className="flex items-center gap-1 hover:text-white transition"
            >
              Planos <ChevronDown className='mt-[1px]' size={18} />
            </Link>

            <Link
              href="/about"
              className="hover:text-white transition"
            >
              Sobre nós
            </Link>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/create"
            className="bg-white text-black font-semibold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-100 transition"
          >
            <PlusCircle size={18} /> Criar cardápio
          </Link>

          {!token ? (
            <Link
              href="/login"
              className="bg-black text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition"
            >
              <LogIn size={18} /> Login
            </Link>
          ) : (
            <Link
              href="/account"
              className="flex items-center justify-center w-10 h-10 bg-black rounded-full"
            >
              <UserRound color="white" />
            </Link>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4 px-4 py-4 bg-orange-500 rounded-lg flex flex-col gap-4 text-white font-medium">
          <Link href="/business" className="hover:text-white transition">Dashboard</Link>
          <Link href="/services" className="flex items-center gap-2">
            <Briefcase size={18} /> Planos
          </Link>
          <Link href="/about" className="hover:text-white transition">Sobre nós</Link>
          <Link href="/create" className="flex items-center gap-2">
            <PlusCircle size={18} /> Criar cardápio
          </Link>
          {!token ? (
            <Link href="/login" className="flex items-center gap-2">
              <LogIn size={18} /> Login
            </Link>
          ) : (
            <Link
              href="/account"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-600 border border-white"
            >
              <UserRound color="white" />
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
