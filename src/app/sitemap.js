
import { client } from '@/prismic';

export default async function sitemap() {
  try {
    const noticias = await client.getAllByType('noticia');

    const noticiasUrls = noticias.map((noticia) => ({
      url: `https://www.orubronegronews.com/noticias/${noticia.uid}`,
      lastModified: noticia.last_publication_date || new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    const staticRoutes = [
      { route: '', priority: 1.0, changeFrequency: 'daily' },
      { route: '/noticias', priority: 0.9, changeFrequency: 'daily' },
      { route: '/resultados', priority: 0.8, changeFrequency: 'daily' },
      { route: '/elenco', priority: 0.7, changeFrequency: 'weekly' },
      { route: '/historia', priority: 0.6, changeFrequency: 'monthly' },
      { route: '/galeria', priority: 0.5, changeFrequency: 'weekly' },
      { route: '/loja', priority: 0.6, changeFrequency: 'weekly' },
      { route: '/sobre-nos', priority: 0.4, changeFrequency: 'monthly' },
      { route: '/termos', priority: 0.3, changeFrequency: 'yearly' },
      { route: '/politica-de-privacidade', priority: 0.3, changeFrequency: 'yearly' },
    ].map(({ route, priority, changeFrequency }) => ({
      url: `https://www.orubronegronews.com${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency,
      priority,
    }));

    return [...staticRoutes, ...noticiasUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback sitemap with basic routes
    return [
      {
        url: 'https://www.orubronegronews.com',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: 'https://www.orubronegronews.com/noticias',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];
  }
}
