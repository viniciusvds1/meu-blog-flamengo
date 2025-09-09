'use client'

import { memo } from 'react';
import { PrismicRichText } from '@prismicio/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const OptimizedImage = dynamic(() => import('./OptimizedImage'), {
  ssr: false
});

const NewCard = memo(function NewCard({ uid, title, content, date, image, category }) {
  const isSupabaseContent = Array.isArray(content) && content[0]?.type === 'paragraph';
  const isPrismicContent = content?.richText || content?.text;

  return (
    <Link href={`/noticias/${uid}`} className="block group">
      <article className="card animate-fade-in bg-white dark:bg-neutral-800 flex flex-col h-full">
        {image && (
          <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
            <OptimizedImage
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        <div className="p-6 flex-grow">
          <div className="flex items-center justify-between mb-3 animate-slide-up">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(date).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            {category && (
              <span className="px-3 py-1 bg-flamengoRed text-white text-sm rounded-full transform transition-transform group-hover:scale-105">
                {category}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold mb-4 line-clamp-2 text-gray-800 dark:text-white group-hover:text-flamengoRed transition-colors">
            {title}
          </h2>
          {content && (
            <div className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 animate-slide-up delay-100">
              {isSupabaseContent ? (
                <p>{content[0]?.text || ''}</p>
              ) : isPrismicContent ? (
                <PrismicRichText
                  field={content.richText || content}
                  components={{
                    paragraph: ({ children }) => (
                      <p className="text-gray-600 dark:text-gray-300">{children}</p>
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

export default NewCard;
