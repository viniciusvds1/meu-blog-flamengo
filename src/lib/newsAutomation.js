import { supabase } from './supabase.js';
import OpenAI from 'openai';
import { JSDOM } from 'jsdom';
import crypto from 'crypto';
import * as prismic from '@prismicio/client';

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
      }
      return [];
    } catch (error) {
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
          break;
        }
      }
      
      return content;
    } catch (error) {
      return '';
    }
  }

  async saveToSupabase(article) {
    try {
      const { data: existingArticles } = await supabase
        .from('noticias')
        .select('url')
        .eq('url', article.url);

      if (existingArticles && existingArticles.length > 0) {
        return false;
      }

      const content = await this.fetchFullArticleContent(article.url);

      const { error } = await supabase.from('noticias').insert([{
        title: article.title,
        description: article.description,
        url: article.url,
        image_url: article.urlToImage,
        content: content || article.description,
        published_at: article.publishedAt
      }]);

      return !error;
    } catch (error) {
      return false;
    }
  }
}

export class MetaSocialService {
  generateAppSecretProof(access_token, app_secret) {
    return crypto
      .createHmac('sha256', app_secret)
      .update(access_token)
      .digest('hex');
  }

  async generateFacebookPost(article) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "Crie posts curtos e envolventes sobre o Flamengo. Use 1-2 emojis e 2-3 hashtags."
        }, {
          role: "user",
          content: `Título: ${article.title}`
        }],
        temperature: 0.7,
        max_tokens: 150
      });

      const postContent = completion.choices[0].message.content;
      const uid = article.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      return `${postContent}\n\n${process.env.SITE_URL}/noticias/${uid}`;
    } catch (error) {
      const uid = article.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      return `🔴⚫ ${article.title}\n\n${process.env.SITE_URL}/noticias/${uid}\n\n#Flamengo #CRF`;
    }
  }

  async generateProductPost(product) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const priceFormatted = new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(product.data.price);

    const hasDiscount = product.data.full_price && product.data.full_price > product.data.price;
    const discountPercentage = hasDiscount 
      ? Math.round(((product.data.full_price - product.data.price) / product.data.full_price) * 100)
      : 0;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: hasDiscount 
            ? "Crie posts curtos e urgentes sobre produtos em promoção do Flamengo. Use 2-3 emojis."
            : "Crie posts curtos sobre produtos do Flamengo. Use 1-2 emojis."
        }, {
          role: "user",
          content: hasDiscount
            ? `Produto: ${product.data.title[0].text}. Preço: ${priceFormatted}. Desconto: ${discountPercentage}%`
            : `Produto: ${product.data.title[0].text}. Preço: ${priceFormatted}`
        }],
        temperature: hasDiscount ? 0.8 : 0.7,
        max_tokens: 100
      });

      const generatedText = completion.choices[0].message.content;
      return {
        message: `${generatedText}\n\n#Flamengo #CRF`,
        link: product.data.link_product.url
      };
    } catch (error) {
      const message = hasDiscount
        ? `🔥 OFERTA! ${product.data.title[0].text}\n${discountPercentage}% OFF!\nPor: ${priceFormatted}\n\n#Flamengo #CRF`
        : `🛍️ ${product.data.title[0].text}\n${priceFormatted}\n\n#Flamengo #CRF`;

      return {
        message,
        link: product.data.link_product.url
      };
    }
  }

  async postToFacebook(content, isProduct = false) {
    const access_token = process.env.META_ACCESS_TOKEN;
    const page_id = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    const app_secret = process.env.FACEBOOK_APP_SECRET;

    try {
      if (!app_secret) {
        throw new Error('FACEBOOK_APP_SECRET não está configurado');
      }

      const appsecret_proof = this.generateAppSecretProof(access_token, app_secret);
      
      if (isProduct) {
        const postData = await this.generateProductPost(content);
        const url = `https://graph.facebook.com/v18.0/${page_id}/feed`;
        const body = new URLSearchParams({
          message: postData.message,
          link: postData.link,
          access_token: access_token,
          appsecret_proof: appsecret_proof
        });

        const response = await fetch(url, {
          method: 'POST',
          body: body
        });

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.message);
        }
      } else {
        const uid = content.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        const message = await this.generateFacebookPost(content);
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
          throw new Error(data.error.message);
        }
      }

      return true;
    } catch (error) {
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
        const facebookPosted = await metaSocialService.postToFacebook(article);
        socialMediaPosts.push({
          article: article.title,
          facebook: facebookPosted
        });
      }
    }

    try {
      const client = prismic.createClient(process.env.PRISMIC_ENDPOINT, {
        accessToken: process.env.PRISMIC_ACCESS_TOKEN,
      });

      const products = await client.getAllByType('produtos', {
        orderings: {
          field: 'document.first_publication_date',
          direction: 'desc'
        },
        pageSize: 1
      });

      if (products && products.length > 0) {
        const latestProduct = products[0];
        const productPosted = await metaSocialService.postToFacebook(latestProduct, true);
        
        if (productPosted) {
          socialMediaPosts.push({
            product: latestProduct.data.title[0].text,
            facebook: true
          });
        }
      }
    } catch (error) {
      // Silently fail product posting
    }

    return { 
      success: true, 
      savedCount: savedArticles.length,
      socialMediaPosts,
      message: `Successfully saved ${savedArticles.length} new articles and posted content to Facebook`
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
