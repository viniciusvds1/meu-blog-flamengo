// components/NewCard.js
'use client'

import Image from 'next/image';
import { PrismicRichText } from '@prismicio/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function NewsCard({ noticia }) {
  // Verifica se temos os dados necessários
  if (!noticia?.data) {
    return null;
  }

  const { title, content, date, image, category } = noticia.data;
  // Função para formatar a data
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
      {/* Imagem */}
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
           
          <div className="badge badge-primary">  {typeof category === 'string' ? title : <PrismicRichText field={category} />}</div>
        )}

        {/* Título */}
        <h2 className="card-title">
          {typeof title === 'string' ? title : <PrismicRichText field={title} />}
        </h2>

        {/* Data */}
        {date && (
          <p className="text-sm text-gray-500">
            {formatDate(date)}
          </p>
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
          <button className="btn btn-primary btn-sm">
            Ler mais
          </button>
        </div>
      </div>
    </div>
  );
}