    'use client'

import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="relative mb-8">
      <input
        type="search"
        placeholder="Buscar notícias..."
        className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent"
      />
      <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
}