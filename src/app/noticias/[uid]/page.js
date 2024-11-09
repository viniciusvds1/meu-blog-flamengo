// src/app/noticias/[uid]/page.js

import { client } from '@/prismic'; // Ajuste o caminho conforme necessário
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
export async function generateMetadata({ params }) {
  const { uid } = params;

  // Buscando a notícia pelo UID
  const noticia = await client.getByUID('noticia', uid);

  if (!noticia) {
    return {
      title: 'Notícia não encontrada',
      description: 'A notícia que você está procurando não foi encontrada.',
    };
  }

  const titulo = noticia.data.title;
  const descricao = noticia.data.description || 'Leia mais sobre esta notícia.';
  const imagem = noticia.data.image?.url;

  return {
    title: titulo,
    description: descricao,
    openGraph: {
      title: titulo,
      description: descricao,
      images: imagem ? [{ url: imagem }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descricao,
      images: imagem ? [imagem] : [],
    },
  };
}
export default async function Noticia({ params }) {
  const { uid } = params;

  // Buscando a notícia pelo UID
  const noticia = await client.getByUID('noticia', uid);

  if (!noticia) {
    return <p>Notícia não encontrada</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        {noticia.data.title}
      </h1>
      <div className='w-800 h-700 items-center flex justify-center'>
      {noticia.data.image && (
        <Image
          src={noticia.data.image.url}
          alt={noticia.data.image.alt}
          width={800}
          height={600}
          className="object-fill mb-4"
        />
      )}
      </div>
      <PrismicRichText
        field={noticia.data.content}
        components={richTextComponents}
      />
    </div>
  );
}

export async function generateStaticParams() {
  // Buscando todos os UIDs das notícias
  const noticias = await client.getAllByType('noticia');

  return noticias.map((noticia) => ({
    uid: noticia.uid,
  }));
}
