import React from 'react';
import { client } from '@/prismic';
import { PrismicRichText } from '@prismicio/react';
import Image from 'next/image';
import { Calendar, Share2, ChevronLeft } from 'lucide-react';
import ShareButton from '@/components/ShareButtom';
import Link from 'next/link';

const richTextComponents = {
  heading1: ({ children }) => (
    <h1 className="text-4xl font-bold text-red-600 mb-6">{children}</h1>
  ),
  heading2: ({ children }) => (
    <h2 className="text-3xl font-semibold text-gray-800 my-4">{children}</h2>
  ),
  heading3: ({ children }) => (
    <h3 className="text-2xl font-semibold text-gray-700 my-3">{children}</h3>
  ),
  paragraph: ({ children }) => (
    <p className="text-lg text-gray-700 leading-relaxed mb-4">{children}</p>
  ),
  list: ({ children }) => (
    <ul className="list-disc list-inside space-y-2 mb-4">{children}</ul>
  ),
  listItem: ({ children }) => (
    <li className="text-gray-700">{children}</li>
  ),
  quote: ({ children }) => (
    <blockquote className="border-l-4 border-red-600 pl-4 my-4 italic text-gray-600">
      {children}
    </blockquote>
  ),
};



export default async function Noticia({ params }) {
  const { uid } = params;
  const noticia = await client.getByUID('noticias', uid);

  if (!noticia) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl text-gray-800 mb-4">Notícia não encontrada</h1>
        <Link href="/noticias" className="text-red-600 hover:text-red-700">
          Voltar para todas as notícias
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(noticia.first_publication_date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link 
          href="/noticias" 
          className="inline-flex items-center text-gray-600 hover:text-red-600 mb-6"
        >
          <ChevronLeft size={20} />
          <span>Voltar para as notícias</span>
        </Link>

        <article className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{formattedDate}</span>
              </div>
              <ShareButton 
                url={typeof window !== 'undefined' ? window.location.href : ''} 
                title={noticia.data.title[0].text} 
              />
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {noticia.data.title[0].text}
            </h1>

            {noticia.data.image && (
              <div className="relative w-full h-[500px] mb-8">
                <Image
                  src={noticia.data.image.url}
                  alt={noticia.data.image.alt || noticia.data.title}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  priority
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <PrismicRichText
                field={noticia.data.content}
                components={richTextComponents}
              />
            </div>

            {noticia.tags && noticia.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {noticia.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </article>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const noticias = await client.getAllByType('noticias');
  return noticias.map((noticia) => ({
    uid: noticia.uid,
  }));
}

export async function generateMetadata({ params }) {
  const { uid } = params;
  const noticia = await client.getByUID('noticias', uid);

  if (!noticia) {
    return {
      title: 'Notícia não encontrada',
      description: 'A notícia que você está procurando não foi encontrada.',
    };
  }
  const titulo = noticia.data.title[0].text;
  const descricao = noticia.data.description || 'Leia mais sobre esta notícia.';
  const imagem = noticia.data.image?.url;

  return {
    title: `${titulo} | Blog do Flamengo`,
    description: descricao,
    openGraph: {
      title: titulo,
      description: descricao,
      images: imagem ? [{ url: imagem }] : [],
      type: 'article',
      site_name: 'Blog do Flamengo',
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descricao,
      images: imagem ? [imagem] : [],
    },
  };
}