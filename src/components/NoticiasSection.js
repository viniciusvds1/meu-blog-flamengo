'use client'

import { useState } from 'react';
import { client } from '../prismic';
import * as prismic from '@prismicio/client';
import NewsCard from '@/components/NewCard';
import LoadMoreButton from '@/components/LoadMoreButton';

export default function NoticiasSection({ initialNoticias }) {
  const [noticias, setNoticias] = useState(initialNoticias);
  const [categoria, setCategoria] = useState('Todas as categorias');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchNoticias = async (pageNum = 1, cat = categoria) => {
    try {
      setLoading(true);
  
      const queryOptions = {
        orderings: [
          { field: 'document.first_publication_date', direction: 'desc' },
        ],
        pageSize: 6,
        page: pageNum,
      };
  
      if (cat !== 'Todas as categorias') {
        queryOptions.filters = [
          prismic.filter.at("my.nocitia", cat.toLowerCase())
        ];
      }
  
      const response = await client.getByType('noticia', queryOptions);

      console.log(response)
  
      if (pageNum === 1) {
        setNoticias(response.results);
      } else {
        setNoticias(prev => [...prev, ...response.results]);
      }
  
      setHasMore(response.next_page !== null);
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCategoriaChange = (e) => {
    const newCategoria = e.target.value;
    setCategoria(newCategoria);
    setPage(1);
    fetchNoticias(1, newCategoria);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNoticias(nextPage, categoria); // Passa a categoria atual
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-red-600">
          Últimas Notícias
        </h2>
        <select
          value={categoria}
          onChange={handleCategoriaChange}
          className="select select-bordered w-auto"
        >
          <option>Todas as categorias</option>
          <option>Jogos</option>
          <option>Contratações</option>
          <option>Bastidores</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {noticias.map((noticia) => (
          <NewsCard key={noticia.uid} noticia={noticia} />
        ))}
      </div>

      {hasMore && (
        <LoadMoreButton onClick={handleLoadMore} loading={loading} />
      )}
    </>
  );
}