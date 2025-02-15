'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NEWS_CATEGORIES, CATEGORY_LABELS } from '@/lib/getNews';

export default function CategoryFilter({ currentCategory }) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap justify-center gap-2">
        <Link
          href="/noticias"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !currentCategory ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas
        </Link>
        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
          <Link
            key={value}
            href={`/categoria/${value}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentCategory === value ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
