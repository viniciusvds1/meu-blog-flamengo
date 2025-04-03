"use client";

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const menuItems = [
  { href: '/', label: 'Início' },
  { href: '/noticias', label: 'Notícias' },
  { href: '/resultados', label: 'Resultados' },
  { href: '/galeria', label: 'Galeria' },
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
    <nav className="bg-flamengoRed text-white shadow-lg sticky top-0 z-50 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" prefetch={true} className="group">
            <p className="text-2xl font-bold text-white transition-transform duration-300 group-hover:scale-105 text-shadow-md">
              Blog do Flamengo
            </p>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-8">
            {menuItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-white hover:text-white/90 transition-all duration-300 relative group"
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            id="menu-button"
            onClick={handleMenuToggle}
            className="lg:hidden focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg p-2 transition-colors hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <FiX className="h-6 w-6 transition-transform duration-300 transform rotate-90" />
            ) : (
              <FiMenu className="h-6 w-6 transition-transform duration-300 hover:scale-110" />
            )}
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
