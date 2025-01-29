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
    <form onSubmit={handleSearch} className="relative mb-8">
      <div className={`relative flex items-center transition-all duration-200 ${
        isFocused ? 'transform scale-[1.02]' : ''
      }`}>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Buscar notícias..."
          className="w-full p-4 pl-12 pr-12 rounded-lg border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent
                   shadow-sm hover:shadow-md transition-shadow duration-200
                   placeholder-gray-400 text-gray-800"
        />
        <Search 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400
                    transition-colors duration-200 group-hover:text-red-600" 
          size={20}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 
                     text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X size={18} />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-4 top-1/2 transform -translate-y-1/2
                   text-red-600 hover:text-red-700 transition-colors duration-200
                   focus:outline-none"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}