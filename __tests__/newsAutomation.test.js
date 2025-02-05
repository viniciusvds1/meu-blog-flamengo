import { fetchAndCreateFlamengoNews, NewsService } from '../src/utils/newsAutomation';
import { client } from '../src/prismic';

// Mock do fetch global
global.fetch = jest.fn();

// Mock do Prismic client
jest.mock('../src/prismic', () => ({
  client: {
    getByUID: jest.fn(),
    createDocument: jest.fn()
  }
}));

describe('News Automation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and process Flamengo news successfully', async () => {
    const mockArticles = [{
      title: 'Flamengo vence jogo importante',
      description: 'Grande vitória do Flamengo',
      content: 'Conteúdo da notícia...',
      source: { name: 'Globo Esporte' },
      url: 'https://exemplo.com/noticia',
      urlToImage: 'https://exemplo.com/imagem.jpg',
      publishedAt: '2024-02-04T19:00:00Z'
    }];

    // Mock da resposta do fetch
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ articles: mockArticles })
    });

    // Mock do Prismic - notícia não existe
    client.getByUID.mockRejectedValueOnce(new Error('Not found'));
    client.createDocument.mockResolvedValueOnce({ id: 'mock-id' });

    const result = await fetchAndCreateFlamengoNews();

    expect(result.success).toBe(true);
    expect(result.message).toContain('Processadas 1 notícias');
    expect(client.createDocument).toHaveBeenCalledTimes(1);
    expect(client.createDocument).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'noticias',
        data: expect.objectContaining({
          title: mockArticles[0].title
        })
      })
    );
  });

  it('should handle API errors gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API Error'));

    const result = await fetchAndCreateFlamengoNews();

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(client.createDocument).not.toHaveBeenCalled();
  });

  it('should avoid duplicate news', async () => {
    const mockArticles = [{
      title: 'Notícia Existente',
      description: 'Descrição...',
      source: { name: 'Fonte' },
      url: 'https://exemplo.com',
      publishedAt: new Date().toISOString()
    }];

    global.fetch.mockResolvedValueOnce({
      json: async () => ({ articles: mockArticles })
    });

    // Simular que a notícia já existe
    client.getByUID.mockResolvedValueOnce({ id: 'existing-id' });

    const result = await fetchAndCreateFlamengoNews();

    expect(result.success).toBe(true);
    expect(client.createDocument).not.toHaveBeenCalled();
  });
});
