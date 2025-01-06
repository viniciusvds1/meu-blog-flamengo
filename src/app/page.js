// app/page.js
import { client } from '../prismic';
import Image from 'next/image';
import LastResultAndNextGame from '@/components/LastResultAndNextGame';
import NewsletterSignup from '@/components/NewsletterSignup';
import SearchBar from '@/components/SearchBar';
import AdBanner from '@/components/_AdsBanner';
import NoticiasSection from '@/components/NoticiasSection';
import AdSenseComponent from '@/components/AdSenseComponent';

export default async function Home() {
  // Buscar notícias iniciais no servidor
  const noticiasResponse = await client.getByType('noticias', {
    orderings: [
      { field: 'document.first_publication_date', direction: 'desc' },
    ],
    pageSize: 6,
  });

  return (
    <div className="bg-base-100 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Hero Banner */}
        <AdSenseComponent />
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
            <NoticiasSection initialNoticias={noticiasResponse.results} />
          </div>
        </div>
      </div>
    </div>
  );
}