// newsAdapter.js
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
      image: data.image?.url ? {
        url: data.image.url,
        alt: data.image.alt || data.title?.[0]?.text || ''
      } : null,
      tags: Array.isArray(news.tags) ? news.tags.filter(Boolean) : [],
      category: data.category || 'geral',
      source: 'prismic'
    };
  } else if (source === 'supabase') {
    return {
      id: news.id || '',
      uid: news.uid || '',
      title: news.title || '',
      content: normalizeContent(news.content),
      date: news.date || new Date().toISOString(),
      image: news.image ? {
        url: news.image,
        alt: news.title || ''
      } : null,
      tags: Array.isArray(news.tags) ? news.tags.filter(Boolean) : [],
      category: news.category || 'geral',
      source: 'supabase'
    };
  }
  return null;
}

export function normalizeNewsCollection(newsArray, source) {
  if (!Array.isArray(newsArray)) return [];
  return newsArray
    .map(news => normalizeNewsData(news, source))
    .filter(Boolean);
}
