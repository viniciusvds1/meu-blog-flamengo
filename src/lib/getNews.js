import { client } from '../prismic';
import * as prismic from '@prismicio/client';
import { supabase } from './supabase.mjs';
import { normalizeNewsCollection, normalizeNewsData } from './newsAdapter';

export const NEWS_CATEGORIES = {
  NOTICIAS: 'noticias',
  CONTRATACOES: 'contratacoes',
  BASTIDORES: 'bastidores',
  COLETIVAS: 'coletivas',
  JOGOS: 'jogos'
};

export const CATEGORY_LABELS = {
  noticias: 'Notícias',
  contrataçoes: 'Contratações',
  bastidores: 'Bastidores',
  coletivas: 'Coletivas',
  jogos: 'Jogos'
};

export async function getAllNews({ pageSize = 6, page = 1, category = null } = {}) {
  try {
    // Prismic query without category filter
    const prismicResponse = await client.get({
      predicates: [
        prismic.predicate.at('document.type', 'noticias')
      ],
      orderings: {
        field: 'document.first_publication_date',
        direction: 'desc'
      },
      pageSize: 100
    });

    // Supabase query with category filter
    const query = supabase
      .from('news')
      .select('*', { count: 'exact' })
      .order('date', { ascending: false });

    if (category) {
      query.eq('category', category.toLowerCase());
    }

    const { data: supabaseNews, error } = await query;

    if (error) throw error;

    // Combine and normalize results
    const prismicNews = normalizeNewsCollection(prismicResponse.results || [], 'prismic')
      .filter(news => !category || news.category.toLowerCase() === category.toLowerCase());
    
    const supabaseFormattedNews = normalizeNewsCollection(supabaseNews || [], 'supabase');
    
    // Combine and filter results
    const allNews = [...prismicNews, ...supabaseFormattedNews]
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalNews = allNews.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedNews = allNews.slice(startIndex, endIndex);
    const totalPages = Math.ceil(totalNews / pageSize);
    const hasMore = page < totalPages;

    return {
      news: paginatedNews,
      total: totalNews,
      page,
      pageSize,
      hasMore,
      category
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      news: [],
      total: 0,
      page,
      pageSize,
      hasMore: false,
      category
    };
  }
}

export async function getNewsByUID(uid) {
  if (!uid) return null;

  try {
    const { data: supabaseNews } = await supabase
      .from('news')
      .select('*')
      .eq('uid', uid)
      .single();

    if (supabaseNews) {
      return normalizeNewsData(supabaseNews, 'supabase');
    }

    const prismicNews = await client.getByUID('noticias', uid);
    if (prismicNews) {
      return normalizeNewsData(prismicNews, 'prismic');
    }

    return null;
  } catch (error) {
    return null;
  }
}
