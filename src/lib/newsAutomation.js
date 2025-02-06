import { supabase } from './supabase.js';
import OpenAI from 'openai';
import { JSDOM } from 'jsdom';
import crypto from 'crypto';

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

class MetaSocialService {

  generateAppSecretProof(access_token, app_secret) {
    return crypto
      .createHmac('sha256', app_secret)
      .update(access_token)
      .digest('hex');
  }

  async postToFacebook(article) {
    const access_token = process.env.META_ACCESS_TOKEN;
    const page_id = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    const app_secret = process.env.FACEBOOK_APP_SECRET;
    const uid = article.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    try {
      if (!app_secret) {
        throw new Error('FACEBOOK_APP_SECRET não está configurado no arquivo .env');
      }

      const appsecret_proof = this.generateAppSecretProof(access_token, app_secret);
      const message = `🔴⚫ ÚLTIMA HORA: ${article.title} 🚨\n\n` +
        `Clique no link e confira todos os detalhes dessa notícia! 👉 ${process.env.SITE_URL}/noticias/${uid}\n\n` +
        `📱 Siga @orubronegronews e fique por dentro de tudo sobre o Mengão!\n\n` +
        `#Flamengo #CRF #FLA #NaçãoRubroNegra #MaiorDoRio #MengãoNews 🦅`;

      const url = `https://graph.facebook.com/v18.0/${page_id}/feed`;
      const body = new URLSearchParams({
        message: message,
        link: `${process.env.SITE_URL}/noticias/${uid}`,
        access_token: access_token,
        appsecret_proof: appsecret_proof
      });

      const response = await fetch(url, {
        method: 'POST',
        body: body
      });

      const data = await response.json();
      if (data.error) {
        console.error('Erro ao postar no Facebook:', {
          code: data.error.code,
          message: data.error.message,
          type: data.error.type
        });
        throw new Error(data.error.message);
      }

      return true;
    } catch (error) {
      console.error('Erro ao postar no Facebook:', {
        error: error.message,
        articleTitle: article.title
      });
      return false;
    }
  }

  async postToInstagram(article) {
    const access_token = process.env.META_ACCESS_TOKEN
    const instagram_account_id = process.env.META_INSTAGRAM_ACCOUNT_ID
    try {
      const caption = `${article.title}\n\nLeia mais através do link na bio! 📰⚽️\n\n#Flamengo #CRF #FLA`;
      
      const containerUrl = `https://graph.facebook.com/v18.0/${instagram_account_id}/media`;
      const containerBody = new URLSearchParams({
        image_url: article.image,
        caption: caption,
        access_token: access_token
      });

      const containerResponse = await fetch(containerUrl, {
        method: 'POST',
        body: containerBody
      });

      const containerData = await containerResponse.json();
      if (containerData.error) {
        console.error('Erro ao criar container de mídia:', {
          code: containerData.error.code,
          message: containerData.error.message,
          type: containerData.error.type
        });
        throw new Error(containerData.error.message);
      }

      const publishUrl = `https://graph.facebook.com/v18.0/${instagram_account_id}/media_publish`;
      const publishBody = new URLSearchParams({
        creation_id: containerData.id,
        access_token: access_token
      });

      const publishResponse = await fetch(publishUrl, {
        method: 'POST',
        body: publishBody
      });

      const publishData = await publishResponse.json();
      if (publishData.error) {
        console.error('Erro ao publicar no Instagram:', {
          code: publishData.error.code,
          message: publishData.error.message,
          type: publishData.error.type
        });
        throw new Error(publishData.error.message);
      }

      return true;
    } catch (error) {
      console.error('Erro ao postar no Instagram:', {
        error: error.message,
        articleTitle: article.title,
        errorStack: error.stack,
        step: error.step || 'unknown'
      });
      return false;
    }
  }
}

const newsService = new NewsService();

export async function fetchAndCreateFlamengoNews() {
  try {
    const articles = await newsService.fetchNews();
    const metaSocialService = new MetaSocialService();

    if (articles.length === 0) {
      return { success: false, error: 'No articles found' };
    }

    const relevantNews = articles
      .filter(article => {
        if (!article?.title) return false;
        return article.title.toLowerCase().includes('flamengo') ||
               article.description?.toLowerCase()?.includes('flamengo');
      })
      .slice(0, 3);

    const savedArticles = [];
    const socialMediaPosts = [];
    
    for (const article of relevantNews) {
      const saved = await newsService.saveToSupabase(article);
      if (saved) {
        savedArticles.push(article);
        
        // Post to social media
        const [facebookPosted, instagramPosted] = await Promise.all([
          metaSocialService.postToFacebook(article),
          article.image ? metaSocialService.postToInstagram(article) : false
        ]);
        
        socialMediaPosts.push({
          article: article.title,
          facebook: facebookPosted,
          instagram: instagramPosted
        });
      }
    }

    return { 
      success: true, 
      savedCount: savedArticles.length,
      socialMediaPosts,
      message: `Successfully saved ${savedArticles.length} new articles to Supabase and posted to social media`
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
