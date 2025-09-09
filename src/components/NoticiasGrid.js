'use client';

import { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

const NoticiasGrid = ({ initialNoticias = [], className = '' }) => {
  const [noticias, setNoticias] = useState(initialNoticias || []);
  

  
  if (!noticias.length) {
    return <div className="text-center py-10">Nenhuma notícia encontrada</div>;
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <span className="bg-flamengo-red h-5 w-1.5 mr-2 rounded-sm"></span>
          Últimas Notícias
        </h2>
        <Link 
          href="/noticias" 
          className="text-flamengo-red font-medium flex items-center hover:underline"
        >
          Ver todas
          <ChevronRight size={18} className="ml-1" />
        </Link>
      </div>

      {/* Layout em destaque para a primeira notu00edcia */}
      <div className="grid grid-cols-1 gap-6">
        {noticias.length > 0 && (
          <NewsCard news={noticias[0]} featured={true} />
        )}
      </div>

      {/* Grid de notu00edcias em 2-3 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {noticias.slice(1, 7).map((noticia) => (
          <NewsCard key={noticia.id} news={noticia} />
        ))}
      </div>

      {/* Notu00edcias em lista horizontal (carrossel visual) */}
      {noticias.length > 7 && (
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="bg-flamengo-red h-4 w-1.5 mr-2 rounded-sm"></span>
            Mais Notícias
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {noticias.slice(7, 11).map((noticia) => (
              <div key={noticia.id} className="border-l-2 border-gray-200 dark:border-gray-800 pl-4 hover:border-flamengo-red transition-colors duration-300">
                <Link href={`/noticias/${noticia.uid}`} className="block group">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-flamengo-red transition-colors duration-200 line-clamp-2 mb-1">
                    {noticia.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {noticia.excerpt}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticiasGrid;
