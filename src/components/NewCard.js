'use client'

import { memo } from 'react';
import { PrismicRichText } from '@prismicio/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const OptimizedImage = dynamic(() => import('./OptimizedImage'), {
  loading: () => <div className="animate-pulse bg-gray-200 w-full h-full rounded-t-xl" />
});

const NewsCard = memo(function NewsCard({ noticia, priority = false }) {
  if (!noticia?.data) {
    return null;
  }

  const { title, content, date, image, category, uid } = noticia.data;
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      });
    } catch {
      return dateString;
    }
  };

  const titleText = typeof title === 'string' ? title : title[0]?.text;

  return (
    <article className="card bg-base-200 shadow-xl h-full flex flex-col">
      {image?.url && (
        <figure className="relative w-full aspect-video">
          <OptimizedImage 
            src={image.url} 
            alt={image.alt || `Imagem da notícia: ${titleText}`}
            quality={75}
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            className="rounded-t-xl"
          />
        </figure>
      )}

      <div className="card-body flex-grow p-4">
        {category && (
          <div className="flex gap-2">
            <span 
              className="badge badge-primary"
              role="status" 
              aria-label={`Categoria: ${category}`}
            >
              {category}
            </span>
          </div>
        )}

        <Link 
          href={`/noticias/${uid}`} 
          className="hover:opacity-80 transition-opacity"
          prefetch={false}
        >
          <h2 className="card-title line-clamp-2 text-lg font-bold mb-2">
            {titleText}
          </h2>
        </Link>

        <div className="text-sm text-gray-500 mb-3">
          {date && formatDate(date)}
        </div>

        <div className="line-clamp-3 text-sm text-gray-600 mb-4">
          <PrismicRichText field={content} />
        </div>

        <div className="card-actions justify-end mt-auto">
          <Link
            href={`/noticias/${uid}`}
            className="btn btn-primary btn-sm"
            aria-label={`Ler mais sobre: ${titleText}`}
            prefetch={false}
          >
            Ler mais
          </Link>
        </div>
      </div>
    </article>
  );
});

export default NewsCard;