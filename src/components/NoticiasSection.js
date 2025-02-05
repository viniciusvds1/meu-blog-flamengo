'use client'

import { useState, useCallback } from 'react';
import NewsCard from '@/components/NewCard';
import LoadMoreButton from '@/components/LoadMoreButton';
import { getAllNews } from '@/lib/getNews';

const ITEMS_PER_PAGE = 10;

export default function NoticiasSection({ initialNoticias }) {
  const [noticias, setNoticias] = useState(initialNoticias);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchNoticias = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      const result = await getAllNews({ 
        page: pageNum, 
        pageSize: ITEMS_PER_PAGE 
      });

      if (pageNum === 1) {
        setNoticias(result.news);
      } else {
        setNoticias(prev => [...prev, ...result.news]);
      }

      setHasMore(result.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchNoticias(page + 1);
    }
  };

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Últimas Notícias</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {noticias.map((noticia) => (
            <NewsCard
              key={noticia.id}
              uid={noticia.uid}
              title={noticia.title}
              content={noticia.content}
              date={noticia.date}
              image={noticia.image}
              category={noticia.category}
            />
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 text-center">
            <LoadMoreButton onClick={handleLoadMore} loading={loading} />
          </div>
        )}
      </div>
    </section>
  );
}