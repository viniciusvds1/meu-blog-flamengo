'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Fire, Tag, ArrowRight } from 'lucide-react';

const NewsCard = ({ news, index }) => {
  const isHighlighted = index === 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`group relative overflow-hidden ${isHighlighted ? 'row-span-2 col-span-2' : ''}`}
    >
      <Link href={news.url} className="block h-full">
        <div className={`relative ${isHighlighted ? 'h-[500px]' : 'h-[280px]'}`}>
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            {news.featured && (
              <div className="flex items-center gap-2 mb-4">
                <Fire className="w-5 h-5 text-flamengoRed animate-pulse-red" />
                <span className="text-sm font-semibold text-flamengoRed uppercase tracking-wider">
                  Destaque
                </span>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {news.date}
              </span>
              <span className="flex items-center gap-1 bg-flamengoRed/20 px-2 py-1 rounded-full">
                <Tag size={14} />
                {news.category}
              </span>
            </div>

            <h3 className={`font-bold text-white mb-3 line-clamp-2 group-hover:text-flamengoRed transition-colors ${isHighlighted ? 'text-2xl' : 'text-lg'}`}>
              {news.title}
            </h3>

            <p className="text-gray-300 line-clamp-2 mb-4 text-sm">
              {news.excerpt}
            </p>

            <div className="flex items-center gap-2 text-flamengoRed font-medium text-sm group-hover:gap-3 transition-all">
              Ler mais
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function NewsGrid({ news }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-900">
      <motion.div 
        style={{ y }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-black text-white mb-2 gradient-text">
              Últimas Notícias
            </h2>
            <p className="text-gray-400">Fique por dentro das novidades do Mengão</p>
          </div>
          
          <Link 
            href="/noticias" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-flamengoRed hover:bg-flamengoRed/90 text-white font-medium rounded-lg transition-colors"
          >
            Ver todas
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[280px]">
          {news?.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={index === 0 ? 'md:col-span-2 md:row-span-2' : ''}
            >
              <NewsCard news={item} index={index} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
