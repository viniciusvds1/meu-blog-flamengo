'use client'

import { memo } from 'react';
import { PrismicRichText } from '@prismicio/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const OptimizedImage = dynamic(() => import('./OptimizedImage'), {
  loading: () => <div className="animate-pulse bg-gray-200 aspect-video rounded-t-lg" />
});

const NewsCard = memo(function NewsCard({ uid, title, content, date, image, category }) {
  return (
    <article className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
      {image && (
        <div className="relative aspect-video">
          <OptimizedImage
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={75}
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded">
            {category || 'Notícias'}
          </span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 line-clamp-2">
          {title}
        </h2>
        <div className="text-sm text-gray-600 mb-4">
          {new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}
        </div>
        {content && (
          <div className="text-gray-600 line-clamp-3 mb-4">
            {content?.richText ? (
              <PrismicRichText
                field={content.richText}
                components={{
                  paragraph: ({ children }) => (
                    <p className="text-gray-600">{children}</p>
                  ),
                }}
              />
            ) : (
              <p>{content?.text || ''}</p>
            )}
          </div>
        )}
        <div className="mt-auto">
          <Link 
            href={`/noticias/${uid}`}
            className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors"
          >
            Leia mais
          </Link>
        </div>
      </div>
    </article>
  );
});

export default NewsCard;
