import React, { Suspense } from 'react';
import OptimizedImage from '@/components/OptimizedImage';
import { Calendar, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { getNewsByUID } from '@/lib/getNews';
import ShareButton from '@/components/ShareButton';
import FacebookComments from '@/components/FacebookComments';
import { PrismicRichText } from '@prismicio/react';

function LoadingImage() {
  return (
    <div className="relative aspect-[16/9] md:aspect-[21/9] animate-pulse bg-gray-200" />
  );
}

function LoadingContent() {
  return (
    <div className="p-6 md:p-8 space-y-4">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
      </div>
    </div>
  );
}

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
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex justify-between items-center">
            <Link
              href="/noticias"
              className="inline-flex items-center text-gray-600 hover:text-red-600"
            >
              <ChevronLeft size={20} className="mr-2" />
              Voltar para notícias
            </Link>
            <ShareButton title={noticia.title} />
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
            {noticia.image && (
              <Suspense fallback={<LoadingImage />}>
                <div className="relative aspect-[16/9] md:aspect-[21/9]">
                  <OptimizedImage
                    src={noticia.image}
                    alt={noticia.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
                  />
                </div>
              </Suspense>
            )}

            <article className="p-6 md:p-8">
              <Suspense fallback={<LoadingContent />}>
                <div className="prose prose-lg max-w-none">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {noticia.title}
                  </h1>

                  <div className="flex items-center text-gray-600 mb-8">
                    <Calendar size={20} className="mr-2" />
                    <time dateTime={noticia.date}>
                      {new Date(noticia.date).toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                  </div>

                  <div className="text-lg text-gray-700 leading-relaxed mb-8">
                    {Array.isArray(noticia.content) && noticia.content.length > 1 ? (
                      <div className="card bg-base-100 shadow-xl p-8">
                        <PrismicRichText
                          field={noticia.content}
                          components={richTextComponents}
                        />
                      </div>
                    ) : noticia.content?.richText || noticia.content?.text ? (
                      <div className="card bg-base-100 shadow-xl p-8">
                        <PrismicRichText
                          field={noticia.content.richText || noticia.content.text}
                          components={richTextComponents}
                        />
                      </div>
                    ) : (
                      <div className="card bg-base-100 shadow-xl p-8">
                        {Array.isArray(noticia.content) ? (
                          noticia.content.map((block, index) => {
                            const paragraphs = block.text.split('\n').filter(p => p.trim());
                            return paragraphs.map((paragraph, pIndex) => (
                              <p key={`${index}-${pIndex}`} className="mb-6 text-lg leading-relaxed text-base-content/80 text-justify">
                                {paragraph.trim()}
                              </p>
                            ));
                          })
                        ) : (
                          <p className="text-lg leading-relaxed text-base-content/80 text-justify">
                            {noticia.content || ''}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {Array.isArray(noticia.tags) && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {noticia.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-8">
                    <Suspense fallback={<div>Carregando comentários...</div>}>
                      <FacebookComments url={`${process.env.NEXT_PUBLIC_SITE_URL}/noticias/${noticia.uid}`} />
                    </Suspense>
                  </div>

                 
                </div>
              </Suspense>
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
        images: noticia.image ? [{ url: noticia.image }] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Erro | Blog do Flamengo',
      description: 'Ocorreu um erro ao carregar a notícia.'
    };
  }
}