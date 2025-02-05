import React from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllNews, NEWS_CATEGORIES } from '@/lib/getNews';

const ITEMS_PER_PAGE = 6;

const CATEGORY_LABELS = {
  [NEWS_CATEGORIES.GERAL]: 'Geral',
  [NEWS_CATEGORIES.FUTEBOL]: 'Futebol',
  [NEWS_CATEGORIES.BASQUETE]: 'Basquete',
  [NEWS_CATEGORIES.ESPORTES_OLIMPICOS]: 'Esportes Olímpicos',
  [NEWS_CATEGORIES.SOCIO_TORCEDOR]: 'Sócio Torcedor',
  [NEWS_CATEGORIES.NACAO_RUBRO_NEGRA]: 'Nação Rubro-Negra'
};

export default async function Noticias({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const category = searchParams.category || null;
  
  const { news: noticias, total, pageSize, hasMore } = await getAllNews({
    pageSize: ITEMS_PER_PAGE,
    page,
    category
  });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">Notícias</h1>
        
        {/* Seletor de Categorias */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/noticias"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !category ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todas
            </Link>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <Link
                key={value}
                href={`/noticias?category=${value}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === value ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(noticias) ? (
            noticias.map((noticia) => (
              <article key={noticia.id} className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-full">
                {noticia.image?.url && (
                  <div className="mb-4">
                    <OptimizedImage
                      src={noticia.image.url}
                      alt={noticia.image.alt || (typeof noticia.title === 'string' ? noticia.title : noticia.title[0]?.text)}
                      priority={false}
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded">
                      {CATEGORY_LABELS[noticia.category] || 'Geral'}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 line-clamp-2">
                    {typeof noticia.title === 'string' ? noticia.title : noticia.title[0]?.text}
                  </h2>
                  <div className="text-sm text-gray-600 mb-4">
                    {new Date(noticia.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="mt-auto">
                    <Link 
                      href={`/noticias/${noticia.uid}`}
                      className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors"
                    >
                      Leia mais
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">Nenhuma notícia encontrada.</p>
            </div>
          )}
        </div>

        <div className="flex justify-center items-center gap-4 mt-8">
          {page > 1 && (
            <>
              <Link 
                href={`/noticias?page=1${category ? `&category=${category}` : ''}`}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <ChevronLeft size={20} className="mr-1" />
                <ChevronLeft size={20} className="-ml-3" />
                <span className="ml-1">Primeira</span>
              </Link>
              <Link 
                href={`/noticias?page=${page - 1}${category ? `&category=${category}` : ''}`}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <ChevronLeft size={20} className="mr-1" />
                <span>Anterior</span>
              </Link>
            </>
          )}

          <span className="text-gray-800">
            Página {page} de {totalPages}
          </span>

          {hasMore && (
            <>
              <Link 
                href={`/noticias?page=${page + 1}${category ? `&category=${category}` : ''}`}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <span>Próxima</span>
                <ChevronRight size={20} className="ml-1" />
              </Link>
              <Link 
                href={`/noticias?page=${totalPages}${category ? `&category=${category}` : ''}`}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <span className="mr-1">Última</span>
                <ChevronRight size={20} className="-mr-3" />
                <ChevronRight size={20} className="ml-1" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Notícias | Blog do Flamengo',
  description: 'Fique por dentro das últimas notícias do Flamengo',
};
