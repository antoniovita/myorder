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
    <nav className="bg-orange-500 text-white py-6 px-6 md:px-12 fixed top-0 left-0 w-full z-50 shadow-md transition-all">
      <div className="relative flex items-center justify-center max-w-7xl mx-auto">

        <div className="absolute left-0 flex gap-4 items-center">
          <Link
            href="/business"
            className="bg-white text-orange-500 px-4 py-2 rounded-xl font-semibold text-sm shadow hover:bg-gray-100 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/services"
            className="text-sm font-bold flex flex-row gap-1 hover:text-white transition"
          >
            Planos <ChevronDown className='mt-[1px] font-bold'  size={20}/> 
          </Link>

          <Link
            href="/about"
            className="text-sm font-bold hover:text-white transition"
          >
            Sobre nós
          </Link>
        </div>

        <h1 className="text-2xl font-extrabold text-white text-center">order</h1>

        <div className="absolute right-0 md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <div className="hidden md:flex gap-6 font-medium text-sm absolute right-0 items-center">
          <Link
            href="/create"
            className="bg-white text-black font-bold px-4 py-2 rounded-xl flex items-center gap-2 text-sm hover:bg-gray-100 transition"
          >
            <PlusCircle size={18} /> Criar cardápio digital
          </Link>

          {!token ? (
            <Link
              href="/login"
              className="bg-black text-white px-4 py-3 flex items-center gap-2 rounded-xl hover:bg-gray-800 transition"
            >
              <LogIn size={18} /> Login
            </Link>
          ) : (
            <Link
              href="/account"
              className="flex items-center justify-center w-10 h-10 bg-black  rounded-full"
            >
              <UserRound color="white" />
            </Link>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 p-4 mt-2 rounded-lg bg-orange-500 text-white transition-all">
          <Link href="/services" className="flex items-center gap-2">
            <Briefcase size={18} /> Planos
          </Link>

          <Link href="/create" className="flex items-center gap-2">
            <PlusCircle size={18} /> Crie seu cardápio digital
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
