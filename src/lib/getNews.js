import { client } from '../prismic';
import * as prismic from '@prismicio/client';
import { supabase } from './supabase.mjs';
import { normalizeNewsCollection, normalizeNewsData } from './newsAdapter';

export const NEWS_CATEGORIES = {
  NOTICIAS: 'noticias',
  CONTRATACOES: 'contratacoes',
  BASTIDORES: 'bastidores',
  COLETIVAS: 'coletivas',
  JOGOS: 'jogos'
};

export const CATEGORY_LABELS = {
  noticias: 'Notícias',
  contrataçoes: 'Contratações',
  bastidores: 'Bastidores',
  coletivas: 'Coletivas',
  jogos: 'Jogos'
};

export async function getAllNews({ pageSize = 6, page = 1, category = null } = {}) {
  try {
    // Mock data for testing purposes
    const mockNews = [
      {
        id: 1,
        uid: 'flamengo-vence-classico',
        title: 'Flamengo vence clássico contra o Vasco por 3x1',
        content: [{ type: 'paragraph', text: 'Em partida emocionante no Maracanã, o Flamengo derrotou o Vasco por 3x1 com gols de Pedro, Gabigol e Arrascaeta.' }],
        date: '2025-01-09T20:00:00Z',
        image: '/assets/bannerubro.png',
        tags: ['futebol', 'classico', 'vitoria'],
        category: 'noticias',
        source: 'mock'
      },
      {
        id: 2,
        uid: 'nova-contratacao-flamengo',
        title: 'Flamengo anuncia nova contratação para 2025',
        content: [{ type: 'paragraph', text: 'O clube rubro-negro oficializou a chegada de mais um reforço para a temporada 2025.' }],
        date: '2025-01-08T15:30:00Z',
        image: '/assets/bannerubro.png',
        tags: ['contratacao', 'reforco'],
        category: 'noticias',
        source: 'mock'
      },
      {
        id: 3,
        uid: 'treino-flamengo-ct',
        title: 'Elenco do Flamengo se reapresenta no CT',
        content: [{ type: 'paragraph', text: 'Jogadores retornaram aos treinos no CT do Ninho do Urubu para preparação da nova temporada.' }],
        date: '2025-01-07T10:00:00Z',
        image: '/assets/bannerubro.png',
        tags: ['treino', 'ct', 'preparacao'],
        category: 'bastidores',
        source: 'mock'
      },
      {
        id: 4,
        uid: 'flamengo-libertadores-2025',
        title: 'Flamengo confirma participação na Libertadores 2025',
        content: [{ type: 'paragraph', text: 'Clube está classificado para a principal competição sul-americana do próximo ano.' }],
        date: '2025-01-06T18:00:00Z',
        image: '/assets/bannerubro.png',
        tags: ['libertadores', 'competicao'],
        category: 'noticias',
        source: 'mock'
      },
      {
        id: 5,
        uid: 'torcida-flamengo-apoio',
        title: 'Torcida do Flamengo demonstra apoio ao time',
        content: [{ type: 'paragraph', text: 'Milhares de torcedores compareceram ao Maracanã para apoiar o Mengão.' }],
        date: '2025-01-05T16:45:00Z',
        image: '/assets/bannerubro.png',
        tags: ['torcida', 'apoio', 'maracana'],
        category: 'noticias',
        source: 'mock'
      },
      {
        id: 6,
        uid: 'historia-flamengo-titulos',
        title: 'Relembre os principais títulos do Flamengo',
        content: [{ type: 'paragraph', text: 'Uma retrospectiva dos momentos mais gloriosos da história rubro-negra.' }],
        date: '2025-01-04T14:20:00Z',
        image: '/assets/bannerubro.png',
        tags: ['historia', 'titulos', 'gloria'],
        category: 'noticias',
        source: 'mock'
      }
    ];

    // Filter by category if specified
    const filteredNews = category 
      ? mockNews.filter(news => news.category.toLowerCase() === category.toLowerCase())
      : mockNews;

    const totalNews = filteredNews.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedNews = filteredNews.slice(startIndex, endIndex);
    const totalPages = Math.ceil(totalNews / pageSize);
    const hasMore = page < totalPages;

    return {
      news: paginatedNews,
      total: totalNews,
      page,
      pageSize,
      hasMore,
      category
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      news: [],
      total: 0,
      page,
      pageSize,
      hasMore: false,
      category
    };
  }
}

export async function getNewsByUID(uid) {
  if (!uid) return null;

  try {
    // Mock data for testing purposes
    const mockNews = {
      id: 1,
      uid: uid,
      title: `Notícia: ${uid.replace(/-/g, ' ')}`,
      content: [
        { type: 'paragraph', text: 'Esta é uma notícia de exemplo para demonstrar o funcionamento do blog do Flamengo.' },
        { type: 'paragraph', text: 'O conteúdo completo da notícia seria exibido aqui com todos os detalhes.' }
      ],
      date: '2025-01-09T20:00:00Z',
      image: '/assets/bannerubro.png',
      tags: ['flamengo', 'noticias'],
      category: 'noticias',
      source: 'mock'
    };

    return mockNews;
  } catch (error) {
    console.error('Error fetching news by UID:', error);
    return null;
  }
}
