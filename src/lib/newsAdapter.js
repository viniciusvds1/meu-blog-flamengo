// newsAdapter.js
import { NEWS_CATEGORIES } from './getNews';

const normalizeCategory = (category) => {
  if (!category) return NEWS_CATEGORIES.NOTICIAS;
  const normalizedCategory = category.toLowerCase();
  return Object.values(NEWS_CATEGORIES).includes(normalizedCategory) 
    ? normalizedCategory 
    : NEWS_CATEGORIES.NOTICIAS;
};

export function normalizeNewsData(news, source) {
  if (!news) return null;

  const normalizeContent = (content) => {
    if (!content) return [];
    if (Array.isArray(content)) {
      return content.map(item => {
        if (typeof item === 'string') {
          return { type: 'paragraph', text: item };
        }
        return {
          type: item.type || 'paragraph',
          text: item.text || '',
          ...item
        };
      }).filter(item => item.text);
    }
    if (typeof content === 'string') {
      return [{ type: 'paragraph', text: content }];
    }
    return [];
  };

  if (source === 'prismic') {
    const data = news.data || {};
    return {
      id: news.id || '',
      uid: news.uid || '',
      title: data.title?.[0]?.text || '',
      content: normalizeContent(data.content),
      date: news.first_publication_date || data.date || new Date().toISOString(),
      image: data.image?.url || null,
      tags: Array.isArray(news.tags) ? news.tags.filter(Boolean) : [],
      category: normalizeCategory(data.category),
      source: 'prismic'
    };
  } else if (source === 'supabase') {
    return {
      id: news.id || '',
      uid: news.uid || '',
      title: news.title || '',
      content: normalizeContent(news.content),
      date: news.date || new Date().toISOString(),
      image: news.image || null,
      tags: Array.isArray(news.tags) ? news.tags.filter(Boolean) : [],
      category: normalizeCategory(news.category),
      source: 'supabase'
    };
  }
  return null;
}

export function normalizeNewsCollection(newsArray, source) {
  if (!Array.isArray(newsArray)) return [];
  return newsArray.map(news => normalizeNewsData(news, source)).filter(Boolean);
}
