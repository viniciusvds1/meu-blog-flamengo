    'use client'

import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implementar a lógica de busca aqui
    console.log('Searching for:', searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <form onSubmit={handleSearch} className="relative mb-8 animate-fade-in">
      <div className={`relative flex items-center transition-all duration-300 ${
        isFocused ? 'transform scale-[1.02]' : ''
      }`}>
        <div className="relative w-full">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Buscar notícias..."
            className="input-field pl-12 pr-24 h-14
                     bg-white dark:bg-neutral-800
                     placeholder-gray-400 dark:placeholder-gray-500
                     text-gray-800 dark:text-gray-100"
          />
          <Search 
            className={`absolute left-4 top-1/2 transform -translate-y-1/2
                      transition-all duration-300
                      ${isFocused ? 'text-flamengoRed scale-110' : 'text-gray-400'}`}
            size={20}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-20 top-1/2 transform -translate-y-1/2
                       text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                       transition-all duration-300 hover:scale-110"
              aria-label="Limpar busca"
            >
              <X size={18} className="transform transition-transform duration-300 hover:rotate-90" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-4 top-1/2 transform -translate-y-1/2
                     text-flamengoRed hover:text-flamengoRed/90
                     font-medium transition-all duration-300
                     hover:scale-110"
          >
            Buscar
          </button>
        </div>
      </div>
    </form>
  );
}