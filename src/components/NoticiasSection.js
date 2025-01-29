'use client'

import { useState, useCallback } from 'react';
import { client } from '../prismic';
import * as prismic from '@prismicio/client';
import NewsCard from '@/components/NewCard';
import LoadMoreButton from '@/components/LoadMoreButton';

const ITEMS_PER_PAGE = 10;

export default function NoticiasSection({ initialNoticias }) {
  const [noticias, setNoticias] = useState(initialNoticias);
  const [categoria, setCategoria] = useState('Todas as categorias');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchNoticias = useCallback(async (pageNum = 1, cat = categoria) => {
    try {
      setLoading(true);
      const queryOptions = {
        orderings: [
          { field: 'document.first_publication_date', direction: 'desc' },
        ],
        pageSize: ITEMS_PER_PAGE,
        page: pageNum,
      };
  
      if (cat !== 'Todas as categorias') {
        queryOptions.filters = [
          prismic.filter.at("my.noticias.category", cat.toLowerCase())
        ];
      }
  
      const response = await client.getByType('noticias', queryOptions);

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
  }, [categoria]);
  
  const handleCategoriaChange = useCallback((e) => {
    const newCategoria = e.target.value;
    setCategoria(newCategoria);
    setPage(1);
    fetchNoticias(1, newCategoria);
  }, [fetchNoticias]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNoticias(nextPage);
    }
  }, [loading, hasMore, page, fetchNoticias]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
        Últimas Notícias
      </h3>
      
      <div className="flex justify-center mb-6">
        <select
          value={categoria}
          onChange={handleCategoriaChange}
          className="select select-bordered w-auto"
          aria-label="Selecione uma categoria"
        >
          <option>Todas as categorias</option>
          <option>Jogos</option>
          <option>Contratações</option>
          <option>Bastidores</option>
          <option>Departamento Medico</option>
          <option>Coletivas</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {noticias.map((noticia, index) => (
          <div key={noticia.uid}>
            <NewsCard
              noticia={noticia}
              priority={index < ITEMS_PER_PAGE}
            />
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center mt-6">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <LoadMoreButton
            onClick={handleLoadMore}
            loading={loading}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
}