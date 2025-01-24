import React from 'react';
import { client } from '@/prismic';
import { PrismicRichText } from '@prismicio/react';
import Image from 'next/image';
import { Calendar, Share2, ChevronLeft } from 'lucide-react';
import ShareButton from '@/components/ShareButtom';
import Link from 'next/link';

const VideoEmbed = ({ embed }) => {
  if (!embed) {
    console.error('No embed object provided');
    return null;
  }

  if (!embed.html) {
    console.error('No HTML found in embed object', embed);
    return null;
  }

  const extractYouTubeId = (url) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const youtubeId = extractYouTubeId(embed.embed_url);
  
  if (youtubeId) {
    return (
      <div className="w-full max-w-full overflow-hidden mb-6">
        <div className="relative w-full aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0"
          />
        </div>
      </div>
    );
  }

  // Fallback to original embed method
  return (
    <div className="w-full max-w-full overflow-hidden mb-6">
      <div 
        className="relative w-full aspect-video"
        dangerouslySetInnerHTML={{ 
          __html: embed.html.replace(/width="\d+"/, 'width="100%"')
                             .replace(/height="\d+"/, 'height="100%"')
        }}
      />
    </div>
  );
};

const richTextComponents = {
  heading1: ({ children }) => (
    <h1 className="text-4xl font-bold text-red-600 mb-6 leading-tight">{children}</h1>
  ),
  heading2: ({ children }) => (
    <h2 className="text-3xl font-semibold text-gray-800 my-6 leading-tight">{children}</h2>
  ),
  heading3: ({ children }) => (
    <h3 className="text-2xl font-semibold text-gray-700 my-4 leading-tight">{children}</h3>
  ),
  paragraph: ({ children }) => (
    <p className="text-lg text-gray-700 leading-relaxed mb-6">{children}</p>
  ),
  list: ({ children }) => (
    <ul className="list-disc list-inside space-y-3 mb-6 ml-4">{children}</ul>
  ),
  listItem: ({ children }) => (
    <li className="text-gray-700 leading-relaxed">{children}</li>
  ),
  quote: ({ children }) => (
    <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic text-gray-600 text-lg">
      {children}
    </blockquote>
  ),
  // Add a custom embed component
  embed: ({ node }) => {
    if (node.oembed && node.oembed.type === 'video') {
      return <VideoEmbed embed={node.oembed} />;
    }
    return null;
  }
};

export default async function Noticia({ params }) {
  const { uid } = params;
  const noticia = await client.getByUID('noticias', uid);

  if (!noticia) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl text-gray-800 mb-6">Notícia não encontrada</h1>
        <Link 
          href="/noticias" 
          className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors"
        >
          <ChevronLeft className="mr-2" size={20} />
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
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link 
          href="/noticias" 
          className="inline-flex items-center text-gray-600 hover:text-red-600 mb-8 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          <span>Voltar para as notícias</span>
        </Link>

        <article className="bg-white shadow-lg rounded-xl overflow-hidden">
          {noticia.data.image && (
            <div className="relative w-full aspect-video mb-6">
              <Image
                src={noticia.data.image.url}
                alt={noticia.data.image.alt || noticia.data.title[0].text}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                priority
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <time dateTime={noticia.first_publication_date}>{formattedDate}</time>
              </div>
              <ShareButton 
                url={typeof window !== 'undefined' ? window.location.href : ''} 
                title={noticia.data.title[0].text}
              />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
              {noticia.data.title[0].text}
            </h1>

            <div className="prose prose-lg max-w-none">
              <PrismicRichText
                field={noticia.data.content}
                components={richTextComponents}
              />
            </div>

            {noticia.tags?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {noticia.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div 
          className="fb-comments" 
          data-href={typeof window !== 'undefined' ? window.location.href : ''} 
          data-width="100%" 
          data-numposts="5"
        ></div>
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