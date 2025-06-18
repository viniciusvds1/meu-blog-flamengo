import { supabase } from './supabase.mjs';
import OpenAI from 'openai';
import { JSDOM } from 'jsdom';
import crypto from 'crypto';
import * as prismic from '@prismicio/client';

export class NewsService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.similarityThreshold = 0.7; // Threshold for similarity detection (0-1)
    this.processingCache = new Map(); // Cache for already processed content fingerprints
  }

  async fetchNews() {
    const API_KEY = process.env.NEWS_API_KEY;
    const params = new URLSearchParams({
      q: 'Flamengo',
      language: 'pt',
      sortBy: 'publishedAt',
      pageSize: '10',
      apiKey: API_KEY
    });

    const maxRetries = 3;
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const response = await fetch(`https://newsapi.org/v2/everything?${params}`);
        const data = await response.json();

        if (response.ok) {
          return data.articles;
        } else {
          console.error(`Erro na resposta da API: ${data}`);
        }
      } catch (error) {
        console.error(`Erro ao buscar notícias: ${error}`);
      }
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return [];
  }

  async fetchFullArticleContent(url) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;

      const selectors = [
        'article', 
        '.article-content', 
        '.post-content', 
        '.entry-content',
        'main',
        '[itemprop="articleBody"]',
        '.news-text',
        '.materia-conteudo'
      ];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          // Remove scripts, styles e comentários
          const scripts = element.getElementsByTagName('script');
          const styles = element.getElementsByTagName('style');
          Array.from(scripts).forEach(script => script.remove());
          Array.from(styles).forEach(style => style.remove());
          
          // Limpa o texto
          const text = element.textContent
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, '\n')
            .trim();
          
          return text;
        }
      }

      return null;
    } catch (error) {
      console.error(`Erro ao buscar conteúdo completo: ${error}`);
      return null;
    }
  }

  async rewriteContentWithOpenAI(title, content) {
    try {
      const prompt = `
Reescreva este artigo sobre o Flamengo de forma original e envolvente, mantendo todas as informações importantes:

Título: ${title}
Conteúdo: ${content}

Regras para reescrita:
1. Mantenha todos os fatos e dados importantes
2. Use um tom jornalístico profissional
3. Evite repetições e redundâncias
4. Organize o texto em parágrafos claros
5. Mantenha citações diretas quando houver
6. Preserve nomes e números exatos
7. Adicione um parágrafo de contextualização quando relevante
`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "Você é um jornalista esportivo especializado em Flamengo, com anos de experiência em reescrever matérias mantendo a precisão das informações."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      return content;
    }
  }

  // Calculate content fingerprint for similarity detection
  calculateFingerprint(text) {
    if (!text) return '';
    
    // Normalize text: lowercase, remove accents, punctuation, and extra spaces
    const normalized = text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Create a hash of the normalized text
    return crypto.createHash('sha256').update(normalized).digest('hex');
  }

  // Calculate Jaccard similarity between two texts
  calculateSimilarity(text1, text2) {
    if (!text1 || !text2) return 0;
    
    // Extract words from texts
    const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    
    // Calculate intersection
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    
    // Calculate Jaccard similarity: |intersection| / |union|
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }
  
  // Check if article is similar to any existing articles
  async isSimilarToExisting(articleTitle, articleContent) {
    try {
      const fingerprint = this.calculateFingerprint(articleContent);
      
      // Check processing cache first to avoid redundant queries
      if (this.processingCache.has(fingerprint)) {
        return true;
      }
      
      // Get recent articles for comparison
      const { data: recentArticles, error } = await supabase
        .from('news')
        .select('title, content')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error || !recentArticles) {
        return false;
      }
      
      // Check for title or content similarity
      for (const existing of recentArticles) {
        // Check title similarity
        if (this.calculateSimilarity(articleTitle, existing.title) > 0.8) {
          return true;
        }
        
        // Check content similarity 
        if (this.calculateSimilarity(articleContent, existing.content) > this.similarityThreshold) {
          return true;
        }
      }
      
      // Cache this fingerprint to avoid reprocessing
      this.processingCache.set(fingerprint, true);
      
      return false;
    } catch (error) {
      console.error(`Erro ao verificar similaridade: ${error}`);
      return false;
    }
  }

  async saveToSupabase(article) {
    try {
      // Check if article already exists with exact title
      const { data: existingArticles, error: checkError } = await supabase
        .from('news')
        .select('title')
        .eq('title', article.title);

      if (checkError) {
        return false;
      }

      if (existingArticles && existingArticles.length > 0) {
        return false;
      }
      
      // Fetch full content for better similarity checking
      const fullContent = await this.fetchFullArticleContent(article.url);
      
      // Check similarity with existing articles
      if (await this.isSimilarToExisting(article.title, fullContent || article.description)) {
        console.log(`Artigo similar já publicado: "${article.title}"`);
        return false;
      }
      
      const rewrittenContent = await this.rewriteContentWithOpenAI(
        article.title,
        fullContent || article.description
      );

      const uid = article.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');


      const { error: insertError } = await supabase.from('news').insert([{
        title: article.title,
        content: rewrittenContent,
        image: article.urlToImage,
        date: article.publishedAt,
        is_published: true,
        category: 'noticias',
        uid: uid
      }]);

      if (insertError) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}

export class MetaSocialService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  generateAppSecretProof(access_token, app_secret) {
    return crypto
      .createHmac('sha256', app_secret)
      .update(access_token)
      .digest('hex');
  }

  async generateFacebookPost(article) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{
          role: "system",
          content: "Você é um social media especializado em conteúdo esportivo do Flamengo. Crie posts envolventes e chamativos que gerem engajamento."
        }, {
          role: "user",
          content: `Crie um post curto e envolvente sobre esta notícia do Flamengo. Use 2-3 emojis relevantes e 2-3 hashtags estratégicas. Título: ${article.title}`
        }],
        temperature: 0.7,
        max_tokens: 150
      });

      const postContent = completion.choices[0].message.content;
      return {
        message: `${postContent}\n\n`,
        uid: article.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      };
    } catch (error) {
      console.error(`Erro ao gerar post: ${error}`);
      const uid = article.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      return {
        message: `🔴⚫ ${article.title}\n\n${process.env.SITE_URL}/noticias/${uid}\n\n#Flamengo #CRF`,
        uid: uid
      };
    }
  }

  async generateProductPost(product) {
    const priceFormatted = new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(product.data.price);

    const hasDiscount = product.data.full_price && product.data.full_price > product.data.price;
    const discountPercentage = hasDiscount 
      ? Math.round(((product.data.full_price - product.data.price) / product.data.full_price) * 100)
      : 0;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{
          role: "system",
          content: hasDiscount 
            ? "Você é um especialista em marketing digital focado em vendas de produtos do Flamengo. Crie posts urgentes e persuasivos para produtos em promoção."
            : "Você é um especialista em marketing digital focado em vendas de produtos do Flamengo. Crie posts atrativos e persuasivos."
        }, {
          role: "user",
          content: hasDiscount
            ? `Crie um post persuasivo para este produto em promoção do Flamengo. Use 2-3 emojis e enfatize o desconto.
               Produto: ${product.data.title[0].text}
               Preço: ${priceFormatted}
               Desconto: ${discountPercentage}%`
            : `Crie um post persuasivo para este produto do Flamengo. Use 1-2 emojis.
               Produto: ${product.data.title[0].text}
               Preço: ${priceFormatted}`
        }],
        temperature: hasDiscount ? 0.8 : 0.7,
        max_tokens: 150
      });

      const generatedText = completion.choices[0].message.content;
      return {
        message: `${generatedText}\n\n#Flamengo #CRF`,
        link: product.data.link_product.url
      };
    } catch (error) {
      console.error(`Erro ao gerar post de produto: ${error}`);
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

        return true;
      } else {
        const {message, uid} = await this.generateFacebookPost(content);
        const url = `https://graph.facebook.com/v18.0/${page_id}/feed`;
        const body = new URLSearchParams({
          message: message,
          access_token: access_token,
          link: `${process.env.SITE_URL}/noticias/${uid}`,
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

        return true;
      }
    } catch (error) {
      console.error(`Erro ao postar no Facebook: ${error}`);
      return false;
    }
  }
}

export async function fetchAndCreateFlamengoNews() {
  console.log('\n=== Iniciando automação de notícias do Flamengo ===');
  
  const newsService = new NewsService();
  const metaSocialService = new MetaSocialService();
  const savedArticles = [];
  const socialMediaPosts = [];
  const startTime = Date.now();
  
  // Format atual para comparações de data
  const today = new Date();
  const currentDate = today.toISOString().split('T')[0]; // YYYY-MM-DD

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
    const relevantArticles = articles
      .filter(article => {
        if (!article?.title || !article?.publishedAt) return false;
        const title = article.title.toLowerCase();
        return title.includes('flamengo') && !title.includes('flamenguista');
      })
      .sort((a, b) => {
        // Primeiro critério: priorizar artigos de hoje
        const dateA = a.publishedAt.split('T')[0];
        const dateB = b.publishedAt.split('T')[0];
        
        if (dateA === currentDate && dateB !== currentDate) return -1;
        if (dateA !== currentDate && dateB === currentDate) return 1;
        
        // Segundo critério: artigos mais recentes primeiro
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      });

    console.log(`Artigos relevantes filtrados: ${relevantArticles.length}\n`);
    
    // Verifica se temos artigos do dia atual
    const todayArticles = relevantArticles.filter(article => {
      const articleDate = article.publishedAt.split('T')[0];
      return articleDate === currentDate;
    });
    
    console.log(`Artigos do dia atual: ${todayArticles.length}`);

    // Flag para controlar se um artigo do dia atual foi publicado
    let publishedTodayArticle = false;
    
    // Processa artigos em lotes para melhor performance
    const processArticleBatch = async (articles, forceTodayArticle = false) => {
      // Slice para não processar muitos artigos de uma vez e evitar timeout
      const batchSize = 5;
      let batchArticles = articles.slice(0, batchSize);
      
      for (const article of batchArticles) {  
        // Verificar se é um artigo do dia atual
        const articleDate = article.publishedAt.split('T')[0];
        const isToday = articleDate === currentDate;
        
        console.log(`\nProcessando artigo: "${article.title}"`);  
        console.log(`Data do artigo: ${articleDate}${isToday ? ' (HOJE)' : ''}`);
        
        // Se já publicamos um artigo de hoje e este não é de hoje, podemos aplicar
        // critérios mais rigorosos para evitar excesso de publicações
        if (publishedTodayArticle && !isToday && !forceTodayArticle) {
          // Aplicar análise de relevância mais rigorosa para artigos não atuais
          if (!article.title.toLowerCase().match(/flamengo.*\b(contrata|vence|título|importante|decisivo)/i)) {
            console.log('Artigo antigo e de menor relevância. Pulando...');
            continue;
          }
        }
        
        const startProcessTime = Date.now();
        const saved = await newsService.saveToSupabase(article);
        
        if (saved) {
          console.log('Artigo salvo com sucesso no Supabase');
          savedArticles.push(article);
          
          // Marcar que publicamos um artigo de hoje
          if (isToday) {
            publishedTodayArticle = true;
            console.log('✅ Artigo do dia atual publicado com sucesso!');
          }
          
          // Executar postagem nas redes sociais como uma Promise separada para não bloquear
          console.log('Tentando postar no Facebook...');
          const facebookPosted = await metaSocialService.postToFacebook(article);
          console.log(`Post no Facebook: ${facebookPosted ? 'Sucesso' : 'Falha'}`);
          
          socialMediaPosts.push({
            article: article.title,
            date: articleDate,
            isToday,
            facebook: facebookPosted
          });
          
          // Aguarda um intervalo entre os posts para evitar limitações da API
          // Intervalo menor para melhor performance
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Se não estamos forçando a publicação de artigos de hoje e já temos artigos suficientes, podemos parar
          if (!forceTodayArticle && savedArticles.length >= 3) {
            console.log('Atingido limite recomendado de artigos. Finalizando processamento.');
            break;
          }
        }
        
        console.log(`Tempo de processamento: ${Date.now() - startProcessTime}ms`);
      }
      
      return savedArticles.length;
    };
    
    // Primeiro tenta processar apenas os artigos de hoje para garantir conteúdo atual
    if (todayArticles.length > 0) {
      console.log('\nProcessando artigos do dia atual prioritariamente...');
      await processArticleBatch(todayArticles, true);
    }
    
    // Se não conseguimos publicar um artigo de hoje, processa todos os artigos
    if (!publishedTodayArticle) {
      console.log('\nNenhum artigo do dia atual foi publicado. Processando artigos mais antigos...');
      await processArticleBatch(relevantArticles);
    }
    
    // Se ainda não temos artigos de hoje, vamos forçar pelo menos um ser publicado
    if (!publishedTodayArticle && todayArticles.length > 0) {
      console.log('\n⚠️ Forçando publicação de pelo menos um artigo do dia atual...');
      // Reduzir o threshold de similaridade temporariamente para permitir artigos de hoje
      const originalThreshold = newsService.similarityThreshold;
      newsService.similarityThreshold = 0.85; // Mais permissivo para artigos de hoje
      
      await processArticleBatch(todayArticles.slice(0, 2), true);
      
      // Restaurar threshold original
      newsService.similarityThreshold = originalThreshold;
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
        console.error(`Erro ao processar produto: ${error}`);
      }
    }

    // Calcular tempo total de execução
    const executionTimeSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('\n=== Resumo da execução ===');
    console.log(`Tempo total de execução: ${executionTimeSeconds}s`);
    console.log(`Artigos salvos: ${savedArticles.length}`);
    console.log(`Posts nas redes sociais: ${socialMediaPosts.length}`);
    
    // Verificar se publicamos pelo menos um artigo do dia atual
    const publishedTodayArticles = savedArticles.filter(article => {
      const articleDate = article.publishedAt.split('T')[0];
      return articleDate === currentDate;
    });
    
    console.log(`Artigos do dia atual publicados: ${publishedTodayArticles.length}`);

    return {
      success: true,
      savedArticles,
      socialMediaPosts,
      message: `Successfully saved ${savedArticles.length} new articles and posted content to Facebook${savedArticles.length > 0 ? ' along with the latest product' : ''}`
    };
  } catch (error) {
    console.error(`Erro na execução principal: ${error}`);
    return {
      success: false,
      savedArticles,
      socialMediaPosts,
      message: error.message
    };
  }
}
