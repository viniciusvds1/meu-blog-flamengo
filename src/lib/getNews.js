import { client } from '../prismic';
import { supabase } from './supabase.js';
import { normalizeNewsCollection, normalizeNewsData } from './newsAdapter';

export const NEWS_CATEGORIES = {
  NOTICIAS: 'noticias',
  CONTRATACOES: 'contratacoes',
  BASTIDORES: 'bastidores',
  COLETIVAS: 'coletivas',
  JOGOS: 'jogos'
};

export async function getAllNews({ pageSize = 6, page = 1, category = null } = {}) {
  try {
    const prismicResponse = await client.getByType('noticias', {
      orderings: [
        { field: 'document.first_publication_date', direction: 'desc' },
      ],
      ...(category ? {
        predicates: [
          ['document.category', category]
        ]
      } : {}),
      pageSize: 100
    });

    const query = supabase
      .from('news')
      .select('*', { count: 'exact' })
      .order('date', { ascending: false })
      .limit(100);

    if (category) {
      query.eq('category', category);
    }

    const { data: supabaseNews, error } = await query;

    if (error) throw error;

    const prismicNews = normalizeNewsCollection(prismicResponse.results || [], 'prismic');
    const supabaseFormattedNews = normalizeNewsCollection(supabaseNews || [], 'supabase');
    const allNews = [...prismicNews, ...supabaseFormattedNews].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

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
      hasMore
    };
  } catch (error) {
    return {
      news: [],
      total: 0,
      page,
      pageSize,
      hasMore: false
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
