    'use client'

import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

function SearchBarComponent() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const inputRef = useRef(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Uso do termo pesquisado com debounce
  useEffect(() => {
    // Podemos implementar análise de dados aqui no futuro
  }, [debouncedTerm]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);

    // Simulate search request
    setTimeout(() => {
      // Here you would normally navigate to search results
      // router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setIsLoading(false);
    }, 800);

    // Mock analytics event

  }, [searchTerm]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e) => {
    // Add escape key to clear search
    if (e.key === 'Escape') {
      clearSearch();
    }
  }, [clearSearch]);

  return (
    <form 
      onSubmit={handleSearch} 
      className="relative  animate-fade-in" 
      role="search"
      aria-label="Buscar notícias no blog"
    >
      <div className={`relative flex items-center transition-all duration-300 ${
        isFocused ? 'transform scale-[1.02]' : ''
      }`}>
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar notícias..."
            className="w-full rounded-full pl-12 pr-28 py-3
                     bg-white dark:bg-neutral-800 shadow-md
                     border border-gray-200 dark:border-gray-700
                     placeholder-gray-400 dark:placeholder-gray-500
                     text-gray-800 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-flamengo-red/50
                     transition-all duration-300"
            aria-label="Campo de busca"
            autoComplete="off"
          />
          <div className={`absolute left-4 top-1/2 transform -translate-y-1/2
                    transition-all duration-300
                    ${isFocused ? 'text-flamengo-red' : 'text-gray-400'}`}>
            <Search size={18} aria-hidden="true" />
          </div>
          
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-[90px] top-1/2 transform -translate-y-1/2
                     text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                     p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
                     transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Limpar busca"
            >
              <X size={16} className="transform transition-transform duration-300 hover:rotate-90" />
            </button>
          )}
          
          <button
            type="submit"
            disabled={isLoading || !searchTerm.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2
                   bg-gradient-to-r from-flamengo-red to-flamengo-red-dark
                   text-white font-medium rounded-full px-4 py-1.5
                   transition-all duration-300 hover:shadow-md
                   disabled:opacity-70 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-flamengo-red/50"
            aria-label="Executar busca"
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 size={16} className="animate-spin mr-1" />
                <span>Buscando</span>
              </span>
            ) : (
              <span>Buscar</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

// Memoize the component to prevent unnecessary re-renders
const SearchBar = memo(SearchBarComponent);

export default SearchBar;