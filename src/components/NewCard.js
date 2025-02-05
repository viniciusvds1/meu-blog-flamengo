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

const NewsCard = memo(function NewsCard({ uid, title, content, date, image, category }) {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Link href={`/noticias/${uid}`}>
      <article className="card bg-base-200 shadow-xl h-full flex flex-col hover:shadow-2xl transition-shadow duration-300">
        {image?.url && (
          <figure className="relative w-full aspect-video">
            <OptimizedImage 
              src={image.url} 
              alt={image.alt || `Imagem da notícia: ${title}`}
              quality={75}
              loading="lazy"
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

          <h3 className="card-title text-lg font-bold mb-2">
            {typeof title === 'string' ? title : title?.[0]?.text}
          </h3>

          <div className="text-sm text-gray-600 mb-4">
            {formatDate(date)}
          </div>

          <div className="text-sm line-clamp-3">
            {Array.isArray(content) && content.length > 1 ? (
              <PrismicRichText 
                field={content} 
                components={{
                  paragraph: ({ children }) => <p className="mb-2">{children}</p>,
                }}
              />
            ) : (
              <p>{content?.text || ''}</p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
});

export default NewsCard;
