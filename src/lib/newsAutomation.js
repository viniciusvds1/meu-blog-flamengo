import { supabase } from './supabase.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export class NewsService {
  async fetchNews() {
    const API_KEY = process.env.NEWS_API_KEY;
    const params = new URLSearchParams({
      q: 'Flamengo',
      language: 'pt',
      sortBy: 'publishedAt',
      pageSize: '10', // Limitar a 10 artigos por vez
      apiKey: API_KEY
    });

    try {
      const response = await fetch(`https://newsapi.org/v2/everything?${params}`);
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

  async rewriteContent(content) {
    if (!content) {
      return 'Conteúdo não disponível';
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
          role: "system",
          content: "Você é um jornalista esportivo especializado em Flamengo. Reescreva a notícia de forma concisa mantendo as informações principais."
        }, {
          role: "user",
          content: content
        }],
        temperature: 0.7
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.warn('Error rewriting content:', error);
      return content || 'Conteúdo não disponível';
    }
  }

  async saveToSupabase(article) {
    try {
      const uid = article.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const { data: existingNews } = await supabase
        .from('news')
        .select('id')
        .eq('uid', uid)
        .single();

      if (existingNews) {
        return false;
      }

      const rewrittenContent = await this.rewriteContent(article.description || article.content || '');

      const newsData = {
        uid: uid,
        title: article.title,
        content: rewrittenContent,
        date: article.publishedAt || new Date().toISOString(),
        image: article.urlToImage || '',
        category: 'futebol'
      };

      const { error } = await supabase
        .from('news')
        .insert([newsData]);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error saving article:', error);
      return false;
    }
  }
}

const newsService = new NewsService();

export async function fetchAndCreateFlamengoNews() {
  try {
    const articles = await newsService.fetchNews();

    if (articles.length === 0) {
      return { success: false, error: 'No articles found' };
    }

    const relevantNews = articles
      .filter(article => {
        if (!article?.title) return false;
        return article.title.toLowerCase().includes('flamengo') ||
               article.description?.toLowerCase()?.includes('flamengo');
      })
      .slice(0, 3); // Processar apenas os 3 artigos mais recentes

    const savedArticles = [];
    for (const article of relevantNews) {
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
    return { success: false, error: error.message };
  }
}
