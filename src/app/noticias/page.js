import React from 'react';
import { client } from '@/prismic';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export default async function Noticias({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  
  const response = await client.getByType('noticias', {
    orderings: [{ field: 'document.first_publication_date', direction: 'desc' }],
    pageSize: ITEMS_PER_PAGE,
    page,
  });

  const noticias = response.results;
  const totalPages = response.total_pages;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">Notícias</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {noticias.map((noticia) => (
            <article key={noticia.id} className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-full">
              {noticia.data.image && (
                <div className="mb-4">
                  <OptimizedImage
                    src={noticia.data.image.url}
                    alt={noticia.data.image.alt || noticia.data.title[0].text}
                    priority={false}
                  />
                </div>
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 line-clamp-2">
                  {noticia.data.title[0].text}
                </h2>
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
          ))}
        </div>

        <div className="flex justify-center items-center gap-4 mt-8">
          {page > 1 && (
            <Link 
              href={`/noticias?page=${page - 1}`}
              className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
            >
              <ChevronLeft size={20} className="mr-1" />
              <span>Anterior</span>
            </Link>
          )}

          <span className="text-gray-800">
            Página {page} de {totalPages}
          </span>

          {page < totalPages && (
            <Link 
              href={`/noticias?page=${page + 1}`}
              className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
            >
              <span>Próxima</span>
              <ChevronRight size={20} className="ml-1" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
