'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Info, Briefcase, Phone, LogIn } from 'lucide-react'; // ícones novos!

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-400 text-white py-6 px-6 md:px-12 fixed top-0 left-0 w-full z-50 shadow-md transition-all">
      <div className="relative flex items-center justify-center max-w-7xl mx-auto">
        
        {/* Dashboard Button - Left */}
        <div className="absolute left-0">
          <Link 
            href="/dashboard"
            className="bg-white text-blue-500 px-4 py-2 rounded-xl font-semibold text-sm shadow hover:bg-gray-100 transition"
          >
            Dashboard
          </Link>
        </div>

        {/* Central Logo */}
        <h1 className="text-2xl font-extrabold text-white text-center">order</h1>

        {/* Mobile Menu Toggle - Right */}
        <div className="absolute right-0 md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} color="white" /> : <Menu size={28} color="white" />}
          </button>
        </div>

        {/* Desktop Menu - Right */}
        <div className="hidden md:flex gap-10 font-medium text-lg absolute right-0 items-center">
          <Link className="hover:text-white transition flex items-center gap-2" href="/about">
            <Info size={18} /> About
          </Link>
          <Link className="hover:text-white transition flex items-center gap-2" href="/services">
            <Briefcase size={18} /> Services
          </Link>
          <Link className="hover:text-white transition flex items-center gap-2" href="/contact">
            <Phone size={18} /> Contact
          </Link>
          <Link className="hover:text-white transition flex items-center gap-2" href="/login">
            <LogIn size={18} /> Login
          </Link>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 p-4 mt-2 rounded-lg transition-all bg-blue-400 text-white">
          <Link className="flex items-center gap-2" href="/about" onClick={() => setIsOpen(false)}>
            <Info size={18} /> About
          </Link>
          <Link className="flex items-center gap-2" href="/services" onClick={() => setIsOpen(false)}>
            <Briefcase size={18} /> Services
          </Link>
          <Link className="flex items-center gap-2" href="/contact" onClick={() => setIsOpen(false)}>
            <Phone size={18} /> Contact
          </Link>
          <Link className="flex items-center gap-2" href="/login" onClick={() => setIsOpen(false)}>
            <LogIn size={18} /> Login
          </Link>
        </div>
      )}
    </nav>
  );
}
