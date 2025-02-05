import * as prismic from '@prismicio/client';
import { supabase } from './supabase.js';

// Inicializar cliente Prismic
const endpoint = 'https://blog-mengo.cdn.prismic.io/api/v2';

const client = prismic.createClient(endpoint, {
  accessToken: process.env.PRISMIC_ACCESS_TOKEN
});

export class NewsService {
  async fetchNews() {
    const API_KEY = process.env.NEWS_API_KEY;
    console.log('API_KEY:', API_KEY);

    try {
      const response = await fetch(`https://newsapi.org/v2/everything?q=Flamengo&language=pt&sortBy=publishedAt&apiKey=${API_KEY}`);
      const data = await response.json();
      
      if (data.status === 'ok' && Array.isArray(data.articles)) {
        return data.articles;
      } else {
        console.error('Invalid response format:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  async saveToSupabase(article) {
    try {
      // Gerar um slug único baseado no título
      const slug = article.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Verificar se a notícia já existe
      const { data: existingNews } = await supabase
        .from('news')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existingNews) {
        console.log(`Article already exists: ${article.title}`);
        return false;
      }

      // Inserir nova notícia
      const { data, error } = await supabase
        .from('news')
        .insert([{
          title: article.title,
          description: article.description || '',
          source_name: article.source?.name || '',
          source_url: article.url || '',
          image_url: article.urlToImage || '',
          published_at: article.publishedAt || new Date().toISOString(),
          slug: slug,
          is_published: false // Será true quando for publicado no Prismic
        }])
        .select()
        .single();

      if (error) throw error;

      console.log(`Successfully saved article: ${article.title}`);
      return true;
    } catch (error) {
      console.error(`Error saving article to Supabase: ${article.title}`, error);
      return false;
    }
  }
}

const newsService = new NewsService();

export async function fetchAndCreateFlamengoNews() {
  try {
    // Buscar notícias do Flamengo
    const articles = await newsService.fetchNews();

    // Filtrar notícias relevantes
    const relevantNews = articles.filter(article => {
      if (!article || !article.title) return false;
      
      const titleMatch = article.title.toLowerCase().includes('flamengo');
      const descriptionMatch = article.description?.toLowerCase()?.includes('flamengo') || false;
      
      return titleMatch || descriptionMatch;
    });

    const recentNews = relevantNews.slice(0, 5);

    // Salvar cada notícia no Supabase
    const savedArticles = [];
    for (const article of recentNews) {
      const saved = await newsService.saveToSupabase(article);
      if (saved) {
        savedArticles.push(article);
      }
    }

    return { 
      success: true, 
      savedCount: savedArticles.length,
      message: `Successfully saved ${savedArticles.length} new articles to Supabase`
    };
  } catch (error) {
    console.error('Error fetching and saving news:', error);
    return { success: false, error: error.message };
  }
}
