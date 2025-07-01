'use client';

import Link from 'next/link';
import { Clock, ChevronRight } from 'lucide-react';
import { useState, memo, useMemo } from 'react';
import dynamic from 'next/dynamic';
import useFormatDate from '@/hooks/useFormatDate';

const OptimizedImage = dynamic(() => import('./OptimizedImage'), {
  ssr: true
});

const NewsCard = memo(({ news, featured = false, compact = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { formatDate, formatRelativeTime } = useFormatDate();
  
  // Use formatação de data relativa para artigos recentes (menos de 2 dias)
  const formattedDate = useMemo(() => {
    if (!news?.date) return '';
    
    const newsDate = new Date(news.date);
    const now = new Date();
    const diffTime = Math.abs(now - newsDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays < 2 ? formatRelativeTime(news.date) : formatDate(news.date);
  }, [news?.date, formatDate, formatRelativeTime]);

  if (!news) return null;
  
  // Versão compacta para sidebar
  if (compact) {
    return (
      <Link 
        href={`/noticias/${news.uid}`} 
        className="group block"  
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start space-x-3">
          <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
            <OptimizedImage
              src={news.image || news.featuredImage?.url || '/assets/bannerubro.png'}
              alt={news.title}
              fill
              sizes="(max-width: 768px) 16vw, 10vw"
              style={{ objectFit: 'cover' }}
              className={`transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
            {news.category && (
              <div className="absolute top-0 left-0 bg-flamengo-red text-white text-[8px] px-1 py-0.5">
                {news.category}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium line-clamp-2 text-gray-900 dark:text-white group-hover:text-flamengo-red transition-colors duration-200">
              {news.title}
            </h3>
            <div className="flex items-center mt-1 text-[10px] text-gray-500">
              <Clock size={10} className="mr-1" />
              {formatDate(news.date)}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Versão em destaque (maior)
  if (featured) {
    return (
      <Link 
        href={`/noticias/${news.uid}`} 
        className="block group" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-xl shadow-lg h-[350px] mb-4">
          <OptimizedImage
            src={news.image || news.featuredImage?.url || '/assets/bannerubro.png'}
            alt={news.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className={`transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          {news.category && (
            <div className="absolute top-4 left-4 bg-flamengo-red text-white text-xs px-2 py-1 rounded">
              {news.category}
            </div>
          )}
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:underline decoration-2 underline-offset-2">
              {news.title}
            </h2>
            <p className="text-sm text-gray-200 line-clamp-2 mb-3">
              {news.excerpt}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-300 flex items-center">
                <Clock size={14} className="mr-1" />
                {formattedDate}
              </span>
              <span className="text-white text-sm font-medium flex items-center group-hover:text-flamengo-red transition-colors duration-200">
                Ler mais
                <ChevronRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Versão padrão
  return (
    <Link 
      href={`/noticias/${news.uid}`} 
      className="block group" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <OptimizedImage
            src={news.image || news.featuredImage?.url || '/assets/bannerubro.png'}
            alt={news.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className={`transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          {news.category && (
            <div className="absolute top-3 left-3 bg-flamengo-red text-white text-xs px-2 py-1 rounded-sm">
              {news.category}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-flamengo-red transition-colors duration-200">
            {news.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
            {news.excerpt}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 flex items-center">
              <Clock size={14} className="mr-1" />
              {formattedDate}
            </span>
            <span className="text-flamengo-red text-sm font-medium flex items-center">
              Ler mais
              <ChevronRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
});

export default NewsCard;
