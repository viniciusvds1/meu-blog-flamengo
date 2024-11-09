// src/components/Navbar.js
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-red-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/" >
            <p>Blog do Flamengo</p>
          </Link>
        </div>
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
        <div className={`md:flex space-x-6 ${menuOpen ? 'block' : 'hidden'} md:block`}>
          <ul className="flex flex-col md:flex-row md:items-center">
            <li className='mx-10'>
              <Link href="/" >
                <p className="hover:text-gray-200 py-2 md:py-0">Início</p>
              </Link>
            </li>
            <li className='mx-10'>
              <Link href="/noticias" >
                <p className="hover:text-gray-200 py-2 md:py-0">Notícias</p>
              </Link>
            </li>
            <li className='mx-10'>
              <Link href="/galeria" >
                <p className="hover:text-gray-200 py-2 md:py-0">Galeria</p>
              </Link>
            </li>
            <li className='mx-10'>
              <Link href="/resultados" >
                <p className="hover:text-gray-200 py-2 md:py-0">Resultados</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
