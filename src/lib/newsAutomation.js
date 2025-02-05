import { supabase } from './supabase.js';
import OpenAI from 'openai';
import { JSDOM } from 'jsdom';

export class NewsService {
  async fetchNews() {
    const API_KEY = process.env.NEWS_API_KEY;
    const params = new URLSearchParams({
      q: 'Flamengo',
      language: 'pt',
      sortBy: 'publishedAt',
      pageSize: '10',
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

  async fetchFullArticleContent(url) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      
      const dom = new JSDOM(html);
      const document = dom.window.document;
      
      const contentSelectors = [
        'article',
        '.article-content',
        '.post-content',
        'main',
        '.content',
        '.article-body'
      ];
      
      let content = '';
      for (const selector of contentSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          content = element.textContent.trim();
          if (content) break;
        }
      }
      
      content = content
        .replace(/\s+/g, ' ')
        .replace(/\[\+\d+ chars\]/g, '')
        .trim();
      
      return content || null;
    } catch (error) {
      console.error('Error fetching full article:', error);
      return null;
    }
  }

  async rewriteContent(content) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    if (!content) {
      return 'Conteúdo não disponível';
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "Você é um jornalista esportivo especializado em Flamengo. Reescreva a notícia mantendo todas as informações importantes e o contexto completo da matéria. Mantenha a estrutura em parágrafos para melhor legibilidade."
        }, {
          role: "user",
          content: content
        }],
        temperature: 0.7,
        max_tokens: 2000
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

      let fullContent = null;
      if (article.url) {
        console.log('Fetching full content from:', article.url);
        fullContent = await this.fetchFullArticleContent(article.url);
      }

      const contentToProcess = fullContent || article.content || article.description || '';
      const rewrittenContent = await this.rewriteContent(contentToProcess);

      const newsData = {
        uid: uid,
        title: article.title,
        content: rewrittenContent,
        date: article.publishedAt || new Date().toISOString(),
        image: article.urlToImage || '',
        category: 'noticias'
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
