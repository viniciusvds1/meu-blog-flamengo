"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.getElementById('mobile-menu');
      const button = document.getElementById('menu-button');
      if (menuOpen && menu && !menu.contains(event.target) && !button.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  return (
    <nav className="bg-red-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <p className="text-2xl font-bold text-white hover:text-gray-100">Blog do Flamengo</p>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="flex items-center space-x-12">
              <li>
                <Link href="/" className="text-white hover:text-gray-200 transition-colors font-medium">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="text-white hover:text-gray-200 transition-colors font-medium">
                  Notícias
                </Link>
              </li>
              <li>
                <Link href="/galeria" className="text-white hover:text-gray-200 transition-colors font-medium">
                  Galeria
                </Link>
              </li>
              <li>
                <Link href="/resultados" className="text-white hover:text-gray-200 transition-colors font-medium">
                  Resultados
                </Link>
              </li>
            </ul>
          </div>

          {/* Mobile menu button */}
          <button
            id="menu-button"
            className="md:hidden p-2 hover:bg-red-800 rounded-md z-50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu principal"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation */}
      <div
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-64 bg-red-700 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-20 px-6">
          <ul className="flex flex-col space-y-6">
            <li>
              <Link
                href="/"
                className="block text-right text-white hover:text-gray-200 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Início
              </Link>
            </li>
            <li>
              <Link
                href="/noticias"
                className="block text-right text-white hover:text-gray-200 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Notícias
              </Link>
            </li>
            <li>
              <Link
                href="/galeria"
                className="block text-right text-white hover:text-gray-200 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Galeria
              </Link>
            </li>
            <li>
              <Link
                href="/resultados"
                className="block text-right text-white hover:text-gray-200 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Resultados
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
