import Image from 'next/image';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import * as prismic from '@prismicio/client';
import { getAllNews } from '@/lib/getNews';
import '@/styles/animations.css';
import RegistrationPrompt from '@/components/auth/RegistrationPrompt';

const HeroBanner = dynamic(() => import('@/components/HeroBanner'), {
  loading: () => <div className="animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-[500px] rounded-lg" />
});

const LastResultAndNextGame = dynamic(() => import('@/components/LastResultAndNextGame'));
const NewsletterSignup = dynamic(() => import('@/components/NewsletterSignup'));
const SearchBar = dynamic(() => import('@/components/SearchBar'));
const NoticiasGrid = dynamic(() => import('@/components/NoticiasGrid'));
const AddBanner = dynamic(() => import('@/components/AddBanner'));
const CookieConsent = dynamic(() => import('@/components/CookieConsent'));
const ProductShelf = dynamic(() => import('@/components/ProductShelf'), {
  ssr: false,
});

const SidebarSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="bg-gray-200 h-64 rounded-lg" />
    <div className="bg-gray-200 h-48 rounded-lg" />
    <div className="bg-gray-200 h-32 rounded-lg" />
  </div>
);

export const revalidate = 3600;

export default async function Home() {
  const { news: initialNoticias } = await getAllNews({ pageSize: 6 });
  
  // Fetch products from Prismic
  const client = prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });
  
  const products = await client.getAllByType('produtos');

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Registration Promotion Modal */}
      <RegistrationPrompt />
      {/* Hero Section */}
      {/* Hero Banner */}
      <section className="mb-12 -mx-4">
        <Suspense fallback={<div className="animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-[500px]" />}>
          <div className="overflow-hidden rounded-lg shadow-2xl">
            <HeroBanner slides={initialNoticias?.map(noticia => {
              const slideImage = noticia.image || '/assets/bannerubro.png';
              return {
                id: noticia.id || Math.random().toString(),
                title: noticia.title || 'Notícia Flamengo',
                description: noticia.excerpt || noticia.description || '',
                image: slideImage,
                category: noticia.category || 'Notícias',
                url: `/noticias/${noticia.uid || ''}`
              };
            })} />
          </div>
        </Suspense>
      </section>

      {/* Search Section */}
      <section className="mb-12 max-w-2xl mx-auto transform hover:scale-[1.02] transition-all duration-300">
        <Suspense fallback={<div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 h-12 rounded-full" />}>
          <div className="glass-morphism-light rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
            <SearchBar className="w-full" />
          </div>
        </Suspense>
      </section>


      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 order-2 lg:order-1">
          <div className="sticky top-4 space-y-6">
            <Suspense fallback={<SidebarSkeleton />}>
              <section className="glass-morphism rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-[1.01]">
                <LastResultAndNextGame />
              </section>

              <section className="glass-morphism-light rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-[1.01]">
                <NewsletterSignup />
              </section>
              
              <section className="glass-morphism rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-[1.01]">
                {products && products.length > 0 && (
                  <ProductShelf products={products} />
                )}
              </section>
              
              <section className="glass-morphism-light rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                <AddBanner 
                  adClient={`ca-pub-${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
                  adSlot="0987654321"
                  className="min-h-[250px]"
                />
              </section>
            </Suspense>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-3/4 order-1 lg:order-2">
          <Suspense 
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gradient-to-r from-gray-200 to-gray-300 h-64 rounded-2xl" />
                ))}
              </div>
            }
          >
            <div className="glass-morphism rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
              <NoticiasGrid
                initialNoticias={initialNoticias}
                className=""
              />
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  );
}