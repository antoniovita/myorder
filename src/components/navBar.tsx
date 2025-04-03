'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white text-black py-4 px-8 fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-normal">order</h1>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className="hidden font-medium md:flex gap-10">
          <Link href={"/about"}>about</Link>
          <Link href={"/services"}>services</Link>
          <Link href={"/contact"}>contact</Link>
          <Link href={"/blog"}>blog</Link>
        </div>
      </div>

      {isOpen && (
        <div className="flex font-medium flex-col gap-3 md:hidden bg-white p-4 absolute w-full left-0 top-full">
          <Link href={"/about"} onClick={() => setIsOpen(false)}>about</Link>
          <Link href={"/services"} onClick={() => setIsOpen(false)}>services</Link>
          <Link href={"/contact"} onClick={() => setIsOpen(false)}>contact</Link>
          <Link href={"/blog"} onClick={() => setIsOpen(false)}>blog</Link>
        </div>
      )}
    </nav>
  );
}
