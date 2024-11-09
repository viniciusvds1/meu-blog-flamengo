'use client'

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Share2 } from 'lucide-react';

export default function NewsCard({ noticia }) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <figure className="relative">
        <Link href={`/noticias/${noticia.uid}`}>
          {noticia.data.image && (
            <Image
              src={noticia.data.image.url}
              alt={noticia.data.image.alt}
              width={800}
              height={600}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            />
          )}
        </Link>
        <div className="absolute top-2 right-2">
          <button 
            onClick={() => setIsShareOpen(!isShareOpen)}
            className="bg-white p-2 rounded-full shadow-md hover:bg-red-600 hover:text-white transition-colors"
          >
            <Share2 size={20} />
          </button>
        </div>
      </figure>
      <div className="card-body">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge badge-primary">{noticia.data.category || 'Geral'}</span>
          <span className="text-sm text-gray-500">
            {new Date(noticia.first_publication_date).toLocaleDateString('pt-BR')}
          </span>
        </div>
        <h2 className="card-title text-red-600 hover:text-red-700 transition-colors">
          <Link href={`/noticias/${noticia.uid}`}>
            {noticia.data.title}
          </Link>
        </h2>
        <p className="text-black line-clamp-3">{noticia.data.summary}</p>
        <div className="card-actions justify-between items-center mt-4">
          <Link 
            href={`/noticias/${noticia.uid}`}
            className="btn bg-black text-white hover:bg-red-600 hover:text-black transition-colors duration-300"
          >
            Leia mais
          </Link>
        </div>
      </div>
    </div>
  );
}