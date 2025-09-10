'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, Eye, Share2 } from 'lucide-react';

const NewsCard = ({ news, featured = false }) => {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const cardClass = featured 
    ? "group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 md:col-span-2 md:row-span-2"
    : "group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300";

  const imageHeight = featured ? "h-64 md:h-80" : "h-48";

  return (
    <article className={cardClass}>
      <Link href={`/noticias/${news.uid}`} className="block h-full">
        {/* Image */}
        <div className={`relative ${imageHeight} overflow-hidden`}>
          {!imageError && news.image ? (
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
              <div className="text-white text-6xl font-bold opacity-20">F</div>
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {news.category || 'Notícias'}
          </div>

          {/* Share Button */}
          <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30">
            <Share2 size={16} />
          </button>
        </div>

        {/* Content */}
        <div className={`p-${featured ? '6' : '4'} space-y-3`}>
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(news.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>5 min</span>
            </div>
            {news.views && (
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span>{news.views}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className={`font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-${featured ? '3' : '2'} ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}>
            {news.title}
          </h3>

          {/* Excerpt - only for featured */}
          {featured && news.content?.[0]?.text && (
            <p className="text-gray-600 line-clamp-3 leading-relaxed">
              {news.content[0].text}
            </p>
          )}

          {/* Read More */}
          <div className="flex items-center text-red-600 font-semibold group-hover:gap-2 transition-all duration-300">
            <span>Ler mais</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </Link>
    </article>
  );
};

const NewsGrid = ({ initialNews = [], title = "Últimas Notícias", className = "" }) => {
  const [news] = useState(initialNews);

  if (!news.length) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-6xl mb-4">📰</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma notícia encontrada</h3>
        <p className="text-gray-500">Volte em breve para conferir as últimas do Mengão!</p>
      </div>
    );
  }

  return (
    <section className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-red-600 rounded-full" />
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        </div>
        <Link 
          href="/noticias" 
          className="text-red-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all duration-300"
        >
          Ver todas
          <ArrowRight size={20} />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item, index) => (
          <NewsCard 
            key={item.id} 
            news={item} 
            featured={index === 0}
          />
        ))}
      </div>

      {/* Load More - if needed */}
      {news.length >= 9 && (
        <div className="text-center mt-12">
          <button className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors duration-300">
            Carregar mais notícias
          </button>
        </div>
      )}
    </section>
  );
};

export default NewsGrid;