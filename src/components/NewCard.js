'use client'

import Image from 'next/image';
import { PrismicRichText } from '@prismicio/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import OptimizedImage from './OptimizedImage';

export default function NewsCard({ noticia }) {
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

  return (
    <article className="card bg-base-200 shadow-xl h-full flex flex-col">
      {image?.url && (
        <figure className="relative w-full aspect-video">
          <OptimizedImage 
            src={image.url} 
            alt={image.alt || `Imagem da notícia: ${typeof title === 'string' ? title : title[0]?.text}`} 
            priority={false}
          />
        </figure>
      )}

      <div className="card-body flex-grow">
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

        <h2 className="card-title line-clamp-2">
          {typeof title === 'string' ? title : title?.[0]?.text || 'Título não disponível'}
        </h2>
        
        {date && (
          <time 
            dateTime={new Date(date).toISOString()} 
            className="text-sm text-gray-500"
          >
            {formatDate(date)}
          </time>
        )}

        <div className="mt-2 line-clamp-3 flex-grow">
          <PrismicRichText 
            field={content}
            components={{
              paragraph: ({ children }) => (
                <p className="text-gray-600">{children}</p>
              ),
            }}
          />
        </div>

        <div className="card-actions justify-end mt-4">
          <Link 
            href={`/noticias/${noticia.uid}`} 
            className="btn btn-primary btn-sm"
            aria-label={`Ler mais sobre ${typeof title === 'string' ? title : title?.[0]?.text}`}
          >
            Ler mais
          </Link>
        </div>
      </div>
    </article>
  );
}