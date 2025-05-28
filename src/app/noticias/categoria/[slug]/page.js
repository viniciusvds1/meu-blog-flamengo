import React from 'react';
import { getAllNews } from '@/lib/getNews';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CategoryFilter from '@/components/CategoryFilter';

// Categorias válidas
const VALID_CATEGORIES = ['futebol', 'basquete', 'remo', 'clube'];

const CATEGORY_TITLES = {
  'futebol': 'Notícias de Futebol',
  'basquete': 'Notícias de Basquete',
  'remo': 'Notícias de Remo',
  'clube': 'Notícias do Clube'
};

const ITEMS_PER_PAGE = 6;

export default async function NoticiasCategoria({ params, searchParams }) {
  const { slug } = params;
  const page = parseInt(searchParams?.page) || 1;
  
  // Verificar se a categoria é válida
  if (!VALID_CATEGORIES.includes(slug)) {
    notFound();
  }

  const { news: noticias, total, hasMore } = await getAllNews({
    pageSize: ITEMS_PER_PAGE,
    page,
    category: slug
  });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const categoryTitle = CATEGORY_TITLES[slug] || `Notícias sobre ${slug}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-red-600 mb-4 text-center">{categoryTitle}</h1>
        <p className="text-center text-gray-600 mb-8">Fique por dentro das últimas notícias sobre {slug} do Mengão</p>
        
        <CategoryFilter currentCategory={slug} />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {noticias?.length > 0 ? (
            noticias.map((noticia) => (
              <article key={noticia.id} className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
                {noticia.image && (
                  <div className="relative aspect-video">
                    <OptimizedImage
                      src={noticia.image || noticia.featuredImage?.url || '/assets/bannerubro.png'}
                      alt={noticia.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {noticia.category && (
                      <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-2 py-1 m-2 rounded">
                        {noticia.category}
                      </div>
                    )}
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow">
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
                  {noticia.excerpt && (
                    <p className="text-gray-700 mb-4 line-clamp-3">{noticia.excerpt}</p>
                  )}
                  <div className="mt-auto">
                    <Link 
                      href={`/noticias/${noticia.uid}`}
                      className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors"
                    >
                      Leia mais
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">Nenhuma notícia encontrada na categoria {slug}.</p>
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
                  href={`/noticias/categoria/${slug}?page=1`}
                  className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                >
                  <ChevronLeft size={20} className="mr-1" />
                  <ChevronLeft size={20} className="-ml-3" />
                  <span className="ml-1">Primeira</span>
                </Link>
                <Link 
                  href={`/noticias/categoria/${slug}?page=${page - 1}`}
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
                  href={`/noticias/categoria/${slug}?page=${page + 1}`}
                  className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                >
                  <span>Próxima</span>
                  <ChevronRight size={20} className="ml-1" />
                </Link>
                <Link 
                  href={`/noticias/categoria/${slug}?page=${totalPages}`}
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
