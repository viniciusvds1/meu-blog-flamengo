import React from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllNews, NEWS_CATEGORIES, CATEGORY_LABELS } from '@/lib/getNews';
import { notFound } from 'next/navigation';

const ITEMS_PER_PAGE = 6;

export async function generateStaticParams() {
  return Object.values(NEWS_CATEGORIES).map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }) {
  const { category } = params;
  const label = CATEGORY_LABELS[category] || category;
  
  return {
    title: `${label} | Blog do Mengão`,
    description: `Últimas notícias sobre ${label} do Flamengo`,
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { category } = params;
  const page = parseInt(searchParams?.page) || 1;

  // Validate category
  if (!Object.values(NEWS_CATEGORIES).includes(category)) {
    notFound();
  }

  const { news: noticias, total, hasMore } = await getAllNews({
    pageSize: ITEMS_PER_PAGE,
    page,
    category
  });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const categoryLabel = CATEGORY_LABELS[category] || category;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-red-600">{categoryLabel}</h1>
          <Link 
            href="/noticias"
            className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <ChevronLeft className="mr-2" />
            Todas as notícias
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {noticias?.length > 0 ? (
            noticias.map((noticia) => (
              <article key={noticia.id} className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
                {noticia.image && (
                  <div className="relative aspect-video">
                    <OptimizedImage
                      src={noticia.image}
                      alt={noticia.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded">
                      {CATEGORY_LABELS[noticia.category] || noticia.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 line-clamp-2">
                    {noticia.title}
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
              <p className="text-gray-600 text-lg">Nenhuma notícia encontrada em {categoryLabel}.</p>
              <Link
                href="/noticias"
                className="inline-flex items-center text-red-600 hover:text-red-700 mt-4"
              >
                <ChevronLeft size={20} className="mr-2" />
                Ver todas as notícias
              </Link>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            {page > 1 && (
              <>
                <Link 
                  href={`/categoria/${category}?page=1`}
                  className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                >
                  <ChevronLeft size={20} className="mr-1" />
                  <ChevronLeft size={20} className="-ml-3" />
                  <span className="ml-1">Primeira</span>
                </Link>
                <Link 
                  href={`/categoria/${category}?page=${page - 1}`}
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
                  href={`/categoria/${category}?page=${page + 1}`}
                  className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                >
                  <span>Próxima</span>
                  <ChevronRight size={20} className="ml-1" />
                </Link>
                <Link 
                  href={`/categoria/${category}?page=${totalPages}`}
                  className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                >
                  <span className="mr-1">Última</span>
                  <ChevronRight size={20} className="-mr-3" />
                  <ChevronRight size={20} className="ml-1" />
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
