// src/app/noticias/page.js
import React from 'react';
import { client } from '@/prismic';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export default async function Noticias({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  
  // Obtendo dados do Prismic ordenados pela data de publicação
  const response = await client.getByType('noticia', {
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
            <div key={noticia.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              {noticia.data.image && (
                <div className="relative w-full h-48">
                  <Image
                    src={noticia.data.image.url}
                    alt={noticia.data.image.alt || noticia.data.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {noticia.data.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {noticia.data.description}
                </p>
                <Link href={`/noticias/${noticia.uid}`}>
                  <span className="text-red-600 hover:text-red-700">Leia mais</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Paginação */}
        <div className="flex justify-center items-center gap-4 mt-8">
          {page > 1 && (
            <Link href={`/noticias?page=${page - 1}`}>
              <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
                <ChevronLeft size={20} />
                <span>Anterior</span>
              </button>
            </Link>
          )}

          <span className="text-gray-800">
            Página {page} de {totalPages}
          </span>

          {page < totalPages && (
            <Link href={`/noticias?page=${page + 1}`}>
              <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
                <span>Próxima</span>
                <ChevronRight size={20} />
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
