import { supabase } from './supabase.js';
import OpenAI from 'openai';
import { JSDOM } from 'jsdom';
import crypto from 'crypto';
import * as prismic from '@prismicio/client';
import dotenv from 'dotenv';
import fs from 'fs';

// Carrega as variáveis de ambiente do .env.local
dotenv.config({ path: '.env.local' });
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

      if (response.ok) {
        return data.articles;
      } else {
        console.error('Erro na resposta da API:', data);
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      return [];
    }
  }

  async fetchFullArticleContent(url) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Tenta diferentes seletores comuns para conteúdo de artigos
      const selectors = ['article', '.article-content', '.post-content', '.entry-content'];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          console.log(`Conteúdo encontrado usando seletor: ${selector}`);
          return element.textContent.trim();
        }
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar conteúdo completo:', error);
      return null;
    }
  }

  async saveToSupabase(article) {
    try {
      // Verifica se o artigo já existe pelo título
      const { data: existingArticles, error: checkError } = await supabase
        .from('news')
        .select('title')
        .eq('title', article.title);

      if (checkError) {
        console.error('Erro ao verificar artigo existente:', checkError);
        return false;
      }

      // Se o artigo já existe, não insere
      if (existingArticles && existingArticles.length > 0) {
        console.log('Artigo já existe no banco:', article.title);
        return false;
      }

      // Se chegou aqui, o artigo não existe, então insere
      const content = await this.fetchFullArticleContent(article.url);
      const uid = article.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');


      const { error: insertError } = await supabase.from('news').insert([{
        title: article.title,
        content: content || article.description,
        image: article.urlToImage,
        date: article.publishedAt,
        is_published: true,
        category: 'noticias',
        uid: uid
      }]);

      if (insertError) {
        console.error('Erro ao salvar no Supabase:', insertError);
        return false;
      }

      console.log('Artigo salvo com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao processar salvamento:', error);
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
  console.log('\n=== Iniciando automação de notícias do Flamengo ===');
  const savedArticles = [];
  const socialMediaPosts = [];
  const metaSocialService = new MetaSocialService();

  try {
    console.log('Buscando artigos...');
    const articles = await newsService.fetchNews();

    if (!articles || articles.length === 0) {
      console.log('Nenhum artigo encontrado');
      return {
        success: false,
        savedArticles: [],
        socialMediaPosts: [],
        message: 'No articles found'
      };
    }

    console.log(`Total de artigos encontrados: ${articles.length}`);

    // Filtra artigos relevantes
    const relevantArticles = articles.filter(article => {
      if (!article?.title) return false;
      const title = article.title.toLowerCase();
      return title.includes('flamengo') && !title.includes('flamenguista');
    });

    console.log(`Artigos relevantes filtrados: ${relevantArticles.length}\n`);

    // Processa cada artigo
    for (const article of relevantArticles) {
      console.log(`\nProcessando artigo: "${article.title}"`);

      const saved = await newsService.saveToSupabase(article);
      if (saved) {
        console.log('Artigo salvo com sucesso no Supabase');
        savedArticles.push(article);
        console.log('Tentando postar no Facebook...');
        const facebookPosted = await metaSocialService.postToFacebook(article);
        console.log(`Post no Facebook: ${facebookPosted ? 'Sucesso' : 'Falha'}`);
        socialMediaPosts.push({
          article: article.title,
          facebook: facebookPosted
        });
      }
    }

    // Só posta o produto se houver novas notícias salvas
    if (savedArticles.length > 0) {
      console.log('\nBuscando produto mais recente do Prismic...');
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
          console.log(`Produto encontrado: "${latestProduct.data.title[0].text}"`);
          console.log('Tentando postar produto no Facebook...');
          const productPosted = await metaSocialService.postToFacebook(latestProduct, true);
          
          if (productPosted) {
            console.log('Produto postado com sucesso no Facebook');
            socialMediaPosts.push({
              product: latestProduct.data.title[0].text,
              facebook: true
            });
          }
        } else {
          console.log('Nenhum produto encontrado no Prismic');
        }
      } catch (error) {
        console.error('Erro ao processar produto:', error);
      }
    }

    console.log('\n=== Resumo da execução ===');
    console.log(`Artigos salvos: ${savedArticles.length}`);
    console.log(`Posts nas redes sociais: ${socialMediaPosts.length}`);

    return {
      success: true,
      savedArticles,
      socialMediaPosts,
      message: `Successfully saved ${savedArticles.length} new articles and posted content to Facebook${savedArticles.length > 0 ? ' along with the latest product' : ''}`
    };
  } catch (error) {
    console.error('Erro na execução principal:', error);
    return {
      success: false,
      savedArticles,
      socialMediaPosts,
      message: error.message
    };
  }
}
