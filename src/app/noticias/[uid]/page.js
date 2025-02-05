import React from 'react';
import { PrismicRichText } from '@prismicio/react';
import OptimizedImage from '@/components/OptimizedImage';
import { Calendar, Share2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { getNewsByUID } from '@/lib/getNews';

const richTextComponents = {
  paragraph: ({ children }) => (
    <p className="text-lg text-gray-700 leading-relaxed mb-6">{children}</p>
  ),
  heading1: ({ children }) => (
    <h1 className="text-4xl font-bold text-gray-900 mb-8">{children}</h1>
  ),
  heading2: ({ children }) => (
    <h2 className="text-3xl font-bold text-gray-900 mb-6">{children}</h2>
  ),
  heading3: ({ children }) => (
    <h3 className="text-2xl font-bold text-gray-900 mb-4">{children}</h3>
  ),
  heading4: ({ children }) => (
    <h4 className="text-xl font-bold text-gray-900 mb-4">{children}</h4>
  ),
  heading5: ({ children }) => (
    <h5 className="text-lg font-bold text-gray-900 mb-4">{children}</h5>
  ),
  heading6: ({ children }) => (
    <h6 className="text-base font-bold text-gray-900 mb-4">{children}</h6>
  ),
  strong: ({ children }) => (
    <strong className="font-bold">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic">{children}</em>
  ),
  listItem: ({ children }) => (
    <li className="text-lg text-gray-700 mb-2">{children}</li>
  ),
  oListItem: ({ children }) => (
    <li className="text-lg text-gray-700 mb-2">{children}</li>
  ),
  list: ({ children }) => (
    <ul className="list-disc pl-6 mb-6">{children}</ul>
  ),
  oList: ({ children }) => (
    <ol className="list-decimal pl-6 mb-6">{children}</ol>
  ),
  preformatted: ({ children }) => (
    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
      <code>{children}</code>
    </pre>
  ),
  image: ({ node }) => (
    <div className="mb-6">
      <OptimizedImage
        src={node.url}
        alt={node.alt || ''}
        className="rounded-lg"
      />
      {node.alt && (
        <p className="text-sm text-gray-500 mt-2">{node.alt}</p>
      )}
    </div>
  ),
};

export default async function Noticia({ params }) {
  const { uid } = params;
  
  try {
    const noticia = await getNewsByUID(uid);

    if (!noticia) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Notícia não encontrada
            </h1>
            <p className="text-gray-600 mb-8">
              A notícia que você está procurando não existe ou foi removida.
            </p>
            <Link
              href="/noticias"
              className="inline-flex items-center text-red-600 hover:text-red-700"
            >
              <ChevronLeft size={20} className="mr-2" />
              Voltar para notícias
            </Link>
          </div>
        </div>
      );
    }

    const formattedDate = new Date(noticia.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    return (
      <div className="min-h-screen bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/noticias"
              className="inline-flex items-center text-gray-600 hover:text-red-600 mb-8"
            >
              <ChevronLeft size={20} className="mr-2" />
              Voltar para notícias
            </Link>

            <article className="bg-white rounded-xl shadow-lg overflow-hidden">
              {noticia.image?.url && (
                <div className="aspect-video relative">
                  <OptimizedImage
                    src={noticia.image.url}
                    alt={noticia.image.alt || noticia.title}
                    priority
                  />
                </div>
              )}

              <div className="p-6 md:p-8">
                <div className="flex items-center text-gray-600 text-sm mb-4">
                  <Calendar size={16} className="mr-2" />
                  {formattedDate}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                  {noticia.title}
                </h1>

                <div className="prose prose-lg max-w-none">
                  {Array.isArray(noticia.content) && noticia.content.length > 1 ? (
                    <PrismicRichText
                      field={noticia.content}
                      components={richTextComponents}
                    />
                  ) : (
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      {typeof noticia.content === 'string' ? noticia.content : 'Conteúdo não disponível'}
                    </p>
                  )}
                </div>

                {Array.isArray(noticia.tags) && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {noticia.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: noticia.title,
                          url: window.location.href,
                        });
                      }
                    }}
                    className="inline-flex items-center text-gray-600 hover:text-red-600"
                  >
                    <Share2 size={20} className="mr-2" />
                    Compartilhar
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Erro ao carregar notícia
          </h1>
          <p className="text-gray-600 mb-8">
            Ocorreu um erro ao tentar carregar a notícia. Por favor, tente novamente.
          </p>
          <Link
            href="/noticias"
            className="inline-flex items-center text-red-600 hover:text-red-700"
          >
            <ChevronLeft size={20} className="mr-2" />
            Voltar para notícias
          </Link>
        </div>
      </div>
    );
  }
}

export async function generateMetadata({ params }) {
  const { uid } = params;
  
  try {
    const noticia = await getNewsByUID(uid);

    if (!noticia) {
      return {
        title: 'Notícia não encontrada | Blog do Flamengo',
        description: 'A notícia que você está procurando não existe ou foi removida.'
      };
    }

    return {
      title: `${noticia.title} | Blog do Flamengo`,
      description: Array.isArray(noticia.content) 
        ? noticia.content[0]?.text || 'Leia mais sobre o Flamengo'
        : typeof noticia.content === 'string' 
          ? noticia.content.slice(0, 160)
          : 'Leia mais sobre o Flamengo',
      openGraph: {
        title: noticia.title,
        description: Array.isArray(noticia.content)
          ? noticia.content[0]?.text || 'Leia mais sobre o Flamengo'
          : typeof noticia.content === 'string'
            ? noticia.content.slice(0, 160)
            : 'Leia mais sobre o Flamengo',
        images: noticia.image?.url ? [{ url: noticia.image.url }] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Erro | Blog do Flamengo',
      description: 'Ocorreu um erro ao carregar a notícia.'
    };
  }
}