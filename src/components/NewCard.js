'use client'

import { memo } from 'react';
import { PrismicRichText } from '@prismicio/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const OptimizedImage = dynamic(() => import('./OptimizedImage'), {
  ssr: false
});

const NewsCard = memo(function NewsCard({ uid, title, content, date, image, category }) {
  const isSupabaseContent = Array.isArray(content) && content[0]?.type === 'paragraph';
  const isPrismicContent = content?.richText || content?.text;

  return (
    <Link href={`/noticias/${uid}`} className="block group">
      <article className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        {image && (
          <div className="relative w-full h-48 overflow-hidden">
            <OptimizedImage
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-6 flex-grow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              {new Date(date).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            {category && (
              <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                {category}
              </span>
            )}
          </div>
          <h2 className="text-xl font-semibold mb-4 line-clamp-2 text-gray-800 group-hover:text-red-600 transition-colors">
            {title}
          </h2>
          {content && (
            <div className="text-gray-600 line-clamp-3 mb-4">
              {isSupabaseContent ? (
                <p>{content[0]?.text || ''}</p>
              ) : isPrismicContent ? (
                <PrismicRichText
                  field={content.richText || content.text}
                  components={{
                    paragraph: ({ children }) => (
                      <p className="text-gray-600">{children}</p>
                    ),
                  }}
                />
              ) : (
                <p>{content || ''}</p>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
});

export default NewsCard;
