"use client";

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const menuItems = [
  { href: '/', label: 'Início' },
  { href: '/noticias', label: 'Notícias' },
  { href: '/jogos', label: 'Jogos' },
  { href: '/elenco', label: 'Elenco' },
  { href: '/historia', label: 'História' }
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event) => {
      const menu = document.getElementById('mobile-menu');
      const button = document.getElementById('menu-button');
      if (menu && !menu.contains(event.target) && !button.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  return (
    <nav className="bg-red-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" prefetch={true}>
            <p className="text-2xl font-bold text-white hover:text-gray-100">Blog do Flamengo</p>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="flex items-center space-x-12">
              {menuItems.map(({ href, label }) => (
                <li key={href}>
                  <Link 
                    href={href}
                    prefetch={true}
                    className="text-white hover:text-gray-200 transition-colors font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <button
            id="menu-button"
            className="md:hidden text-white focus:outline-none"
            onClick={handleMenuToggle}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden fixed inset-0 top-[72px] bg-red-700 z-50"
          >
            <ul className="flex flex-col items-center space-y-8 pt-8">
              {menuItems.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    prefetch={true}
                    className="text-xl text-white hover:text-gray-200 transition-colors font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
