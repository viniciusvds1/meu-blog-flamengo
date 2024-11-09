import { client } from '../prismic';
import Image from 'next/image';
import LastResultAndNextGame from '@/components/LastResultAndNextGame';
import NewsCard from '@/components/NewCard';
import NewsletterSignup from '@/components/NewsletterSignup';
import SearchBar from '@/components/SearchBar';
import LoadMoreButton from '@/components/LoadMoreButton';

export const metadata = {
  title: 'Blog do Flamengo - Últimas Notícias e Atualizações',
  description: 'Acompanhe as últimas notícias, resultados e agenda de jogos do Flamengo',
  keywords: 'Flamengo, futebol, notícias, brasileirão'
};

export default async function Home() {
  const noticiasResponse = await client.getByType('noticia', {
    orderings: [
      { field: 'document.first_publication_date', direction: 'desc' },
    ],
    pageSize: 6,
  });

  const noticias = noticiasResponse.results;

  return (
    <div className="bg-base-100 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Hero Banner */}
        <div className="relative my-8">
          <Image
            src="/assets/banner.jpeg"
            alt="Banner do Flamengo"
            width={1200}
            height={400}
            className="w-full h-[400px] object-cover rounded-lg"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg" />
          <div className="absolute bottom-8 left-8 text-white">
            <h1 className="text-4xl font-bold mb-2">Blog do Flamengo</h1>
            <p className="text-xl">Todas as notícias do Mengão em um só lugar</p>
          </div>
        </div>

        <SearchBar />

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="sticky top-4">
              <LastResultAndNextGame />
              <NewsletterSignup />
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-red-600">
                Últimas Notícias
              </h2>
              <select className="select select-bordered w-auto">
                <option>Todas as categorias</option>
                <option>Jogos</option>
                <option>Contratações</option>
                <option>Bastidores</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {noticias.map((noticia) => (
                <NewsCard key={noticia.uid} noticia={noticia} />
              ))}
            </div>

            <LoadMoreButton />
          </div>
        </div>
      </div>
    </div>
  );
}