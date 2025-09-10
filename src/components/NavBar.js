"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, ChevronDown, Home, Newspaper, Calendar, Image as ImageIcon, Award, ShoppingBag, Trophy, Users, Star, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/noticias', label: 'Notícias', icon: Newspaper },
  { href: '/resultados', label: 'Resultados', icon: Calendar },
  { href: '/elenco', label: 'Elenco', icon: Users },
  { href: '/galeria', label: 'Galeria', icon: ImageIcon },
  { href: '/historia', label: 'História', icon: Award },
  { href: '/loja', label: 'Loja', icon: ShoppingBag }
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const { user, isAuthenticated, logout } = useAuth();

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
    <nav className="sticky top-0 z-50 w-full bg-flamengoRed" role="navigation" aria-label="Navegação principal">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Pular para o conteúdo principal
      </a>
      
      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-flamengoRed rounded-md" aria-label="Ir para página inicial">
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center mr-2">
              <div className="w-5 h-5 bg-flamengoRed rounded-full"></div>
            </div>
            <span className="text-base font-bold text-white">
              Blog do Flamengo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2" role="menubar">
            {menuItems.map((item) => (
              <div key={item.href} className="relative group" role="none">
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-white hover:bg-white/10 transition-colors ${
                    pathname === item.href || pathname.startsWith(`${item.href}/`) 
                      ? 'bg-white/15 font-semibold' 
                      : ''
                  }`}
                  role="menuitem"
                  aria-current={pathname === item.href ? 'page' : undefined}
                  onMouseEnter={() => item.submenu && setActiveSubmenu(item.href)}
                  onClick={() => setActiveSubmenu(null)}
                >
                  <item.icon className="w-4 h-4 mr-1.5" />
                  <span>{item.label}</span>
                  {item.submenu && <ChevronDown className="w-4 h-4 ml-1" />}
                </Link>
                
                {/* Submenu dropdown */}
                {item.submenu && (
                  <div 
                    className={`absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md overflow-hidden w-48 transform transition-all duration-200 origin-top-left z-50 ${
                      activeSubmenu === item.href ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                    }`}
                    onMouseLeave={() => setActiveSubmenu(null)}
                    role="menu"
                    aria-label={`Submenu de ${item.label}`}
                  >
                    {item.submenu.map((subItem) => (
                      <Link 
                        key={subItem.href} 
                        href={subItem.href}
                        className={`block px-4 py-2 text-sm text-gray-800 hover:bg-flamengoRed hover:text-white transition-colors ${
                          pathname === subItem.href ? 'bg-flamengoRed/10 font-medium' : ''
                        }`}
                        role="menuitem"
                        aria-current={pathname === subItem.href ? 'page' : undefined}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Auth and Search Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center">
                <span className="text-white text-sm mr-3">
                  Olá, {user?.user_metadata?.name || 'Rubro-Negro'}
                </span>
                <button 
                  onClick={() => { 
                    logout();
                    router.push('/');
                  }}
                  className="flex items-center px-3 py-2 rounded-md text-white hover:bg-white/10 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="flex items-center px-3 py-2 rounded-md text-white hover:bg-white/10 transition-colors"
                  aria-label="Fazer login"
                >
                  <LogIn className="w-4 h-4 mr-1.5" />
                  <span>Entrar</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center px-3 py-2 rounded-md text-white font-medium bg-white/20 hover:bg-white/30 transition-colors"
                  aria-label="Criar conta"
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  <span>Cadastrar</span>
                </Link>
              </div>
            )}
            
            <button 
              className="text-white p-1 rounded-md hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-flamengoRed"
              aria-label="Buscar no site"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            id="menu-button"
            onClick={handleMenuToggle}
            className="lg:hidden focus:outline-none rounded-lg p-2 text-white hover:bg-white/10 transition-colors"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? (
              <X className="h-6 w-6 transition-transform duration-300" />
            ) : (
              <Menu className="h-6 w-6 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - melhorado */}
      {menuOpen && (
        <div 
          id="mobile-menu"
          className="lg:hidden fixed inset-0 top-[60px] bg-black/95 backdrop-blur-sm z-50 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação móvel"
        >
          <div className="py-6 px-4 h-full overflow-y-auto">
            <div className="flex flex-col space-y-2" role="menu">
              {menuItems.map((item) => (
                <div key={item.href} className="flex flex-col">
                  <Link
                    href={item.href}
                    className={`flex items-center py-3 px-4 rounded-lg ${
                      pathname === item.href || pathname.startsWith(`${item.href}/`) 
                        ? 'bg-flamengoRed text-white' 
                        : 'text-white bg-black/30 hover:bg-flamengoRed/80'
                    } transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black`}
                    role="menuitem"
                    aria-current={pathname === item.href ? 'page' : undefined}
                    onClick={() => {
                      if (!item.submenu) setMenuOpen(false);
                      setActiveSubmenu(activeSubmenu === item.href ? null : item.href);
                    }}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="flex-1">{item.label}</span>
                    {item.submenu && (
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                        activeSubmenu === item.href ? 'rotate-180' : ''
                      }`} aria-hidden="true" />
                    )}
                  </Link>
                  
                  {/* Mobile Submenu */}
                  {item.submenu && (
                    <div className={`overflow-hidden transition-all duration-300 ${
                      activeSubmenu === item.href 
                        ? 'max-h-[400px] opacity-100 mt-1 mb-2' 
                        : 'max-h-0 opacity-0'
                    }`} role="menu" aria-label={`Submenu de ${item.label}`}>
                      {item.submenu.map((subItem) => (
                        <Link 
                          key={subItem.href} 
                          href={subItem.href}
                          className={`flex pl-12 py-3 rounded-lg text-sm ${
                            pathname === subItem.href 
                              ? 'bg-flamengoRed/30 text-white font-medium' 
                              : 'text-gray-200 hover:bg-flamengoRed/20'
                          } transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black`}
                          role="menuitem"
                          aria-current={pathname === subItem.href ? 'page' : undefined}
                          onClick={() => setMenuOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Barra de pesquisa móvel */}
            <div className="mt-6 px-2">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  placeholder="Buscar no blog..." 
                  className="w-full bg-black/30 text-white rounded-full pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-flamengoRed/50"
                  aria-label="Campo de busca"
                />
                <Search className="absolute left-3 w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            {/* Auth buttons for mobile */}
            <div className="mt-6 flex flex-col space-y-2 px-2">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-3">
                  <p className="text-white text-sm px-2">
                    Olá, {user?.user_metadata?.name || 'Rubro-Negro'}
                  </p>
                  <button
                    onClick={() => { 
                      logout();
                      setMenuOpen(false);
                      router.push('/');
                    }}
                    className="flex items-center py-3 px-4 rounded-lg text-white bg-black/30 hover:bg-flamengoRed/80 transition-all duration-200"
                    aria-label="Sair da conta"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span>Sair da conta</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="flex items-center py-3 px-4 rounded-lg text-white bg-black/30 hover:bg-flamengoRed/80 transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Fazer login"
                  >
                    <LogIn className="w-5 h-5 mr-3" />
                    <span>Entrar</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex items-center py-3 px-4 rounded-lg text-white bg-flamengoRed/80 hover:bg-flamengoRed transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Criar conta"
                  >
                    <UserPlus className="w-5 h-5 mr-3" />
                    <span>Cadastrar-se</span>
                  </Link>
                </>
              )}
            </div>
            
            {/* Botões rápidos para acesso */}
            <div className="mt-6 flex justify-around">
              <Link 
                href="/resultados" 
                className="flex flex-col items-center px-4 py-2 text-white"
                onClick={() => setMenuOpen(false)}
                aria-label="Ver resultados dos jogos"
              >
                <Trophy className="w-6 h-6 mb-1" />
                <span className="text-xs">Resultados</span>
              </Link>
              <Link 
                href="/loja" 
                className="flex flex-col items-center px-4 py-2 text-white"
                onClick={() => setMenuOpen(false)}
                aria-label="Visitar loja oficial"
              >
                <ShoppingBag className="w-6 h-6 mb-1" />
                <span className="text-xs">Loja</span>
              </Link>
              <Link 
                href="/historia" 
                className="flex flex-col items-center px-4 py-2 text-white"
                onClick={() => setMenuOpen(false)}
                aria-label="Conhecer história do clube"
              >
                <Star className="w-6 h-6 mb-1" />
                <span className="text-xs">História</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
