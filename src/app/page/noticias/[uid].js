// src/app/noticias/[uid]/page.js

import { client } from '../../prismic';
import { PrismicRichText } from '@prismicio/react';
import Image from 'next/image';
const richTextComponents = {
    heading1: ({ children }) => (
      <h1 className="text-4xl font-bold text-red-600">{children}</h1>
    ),
    paragraph: ({ children }) => (
      <p className="text-base text-black">{children}</p>
    ),
    // Outros elementos personalizados
  };
  
  
export default async function Noticia({ params }) {
  const { uid } = params;

  // Buscando a notícia pelo UID
  const noticia = await client.getByUID('noticia', uid);

  if (!noticia) {
    return <p>Notícia não encontrada</p>;
  }
  console.log("cai aqui")
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        {noticia.data.title}
      </h1>
      {noticia.data.image && (
        <Image
          src={noticia.data.image.url}
          alt={noticia.data.image.alt}
          width={800}
          height={600}
          className="w-full h-auto mb-4"
        />
      )}
        <PrismicRichText
              field={noticia.data.content}
              components={richTextComponents}
            />
    </div>
  );
}
