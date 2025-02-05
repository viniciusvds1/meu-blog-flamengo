'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORY_LABELS = {
  noticias: 'Notícias',
  contratacoes: 'Contratações',
  bastidores: 'Bastidores',
  coletivas: 'Coletivas',
  jogos: 'Jogos'
};

export default function CategoryFilter({ currentCategory }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    router.push(`/noticias?${params.toString()}`);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !currentCategory ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas
        </button>
        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
          <button
            key={value}
            onClick={() => handleCategoryChange(value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentCategory === value ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
