// components/NewCard.js
'use client'

import Image from 'next/image';
import { PrismicRichText } from '@prismicio/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

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
    <div className="card bg-base-200 shadow-xl">
      {image?.url && (
        <figure className="relative w-full h-48">
          <Image
            src={image.url}
            alt={image.alt || 'Imagem da notícia'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </figure>
      )}

      <div className="card-body">
        {/* Categoria */}
        {category && (
           
          <div className="badge badge-primary">  {category}</div>
        )}

        {/* Título */}
        <h1 className="card-title">
          {typeof title === 'string' ? title : title[0].text}
        </h1>

        {/* Data */}
        {date && (
          <div className="text-sm text-gray-500">
            {formatDate(date)}
          </div>
        )}

        {/* Conteúdo */}
        <div className="mt-2 line-clamp-3">
          <PrismicRichText 
            field={content}
            components={{
              paragraph: ({ children }) => (
                <p className="text-gray-600">{children}</p>
              ),
            }}
          />
        </div>

        {/* Botão Ler Mais */}
        <div className="card-actions justify-end mt-4">
        <Link href={`/noticias/${noticia.uid}`} className="btn btn-primary btn-sm">
            <p>Ler mais</p>
          </Link>
        </div>
      </div>
    </div>
  );
}