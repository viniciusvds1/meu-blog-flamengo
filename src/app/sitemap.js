
import { client } from '@/prismic';

export default async function sitemap() {
  const noticias = await client.getAllByType('noticia');

  const noticiasUrls = noticias.map((noticia) => ({
    url: `https://www.orubronegronews.com/noticias/${noticia.uid}`,
    lastModified: noticia.last_publication_date || new Date().toISOString(),
  }));

  const routes = ['', '/sobre', '/contato'].map((route) => ({
    url: `https://www.orubronegronews.com/{route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...noticiasUrls];
}
