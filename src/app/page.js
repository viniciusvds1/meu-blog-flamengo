import Image from 'next/image';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import * as prismic from '@prismicio/client';
import { getAllNews } from '@/lib/getNews';

// Componentes com carregamento dinâmico
const HeroSlider = dynamic(() => import('@/components/HeroSlider'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-[400px] rounded-lg" />
});

const LastResultAndNextGame = dynamic(() => import('@/components/LastResultAndNextGame'));
const NewsletterSignup = dynamic(() => import('@/components/NewsletterSignup'));
const SearchBar = dynamic(() => import('@/components/SearchBar'));
const NoticiasSection = dynamic(() => import('@/components/NoticiasSection'));
const AddBanner = dynamic(() => import('@/components/AddBanner'));
const CookieConsent = dynamic(() => import('@/components/CookieConsent'));
const ProductShelf = dynamic(() => import('@/components/ProductShelf'), {
  ssr: false,
});

// Loading components para melhor UX
const SidebarSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="bg-gray-200 h-64 rounded-lg" />
    <div className="bg-gray-200 h-48 rounded-lg" />
    <div className="bg-gray-200 h-32 rounded-lg" />
  </div>
);

export const revalidate = 3600; // Revalidar a página a cada hora

export default async function Home() {
  const { news: initialNoticias } = await getAllNews({ pageSize: 6 });
  
  // Fetch products from Prismic
  const client = prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });
  
  const products = await client.getAllByType('produtos');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-8">
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-[400px] rounded-lg" />}>
          <HeroSlider news={initialNoticias} />
        </Suspense>
      </section>

      {/* Search Section */}
      <section className="mb-8">
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-12 rounded-lg max-w-2xl mx-auto" />}>
          <SearchBar className="max-w-2xl mx-auto" />
        </Suspense>
      </section>


      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 order-2 lg:order-1">
          <div className="sticky top-4 space-y-6">
            <Suspense fallback={<SidebarSkeleton />}>
              <section className="bg-white rounded-xl shadow-sm p-4">
                <LastResultAndNextGame />
              </section>

              <section className="bg-white rounded-xl shadow-sm p-4">
                <NewsletterSignup />
              </section>
              
              <section className="bg-white rounded-xl shadow-sm p-4">
                {products && products.length > 0 && (
                  <ProductShelf products={products} />
                )}
              </section>
              
              <section className="bg-white rounded-xl shadow-sm p-4">
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
                  <div key={i} className="bg-gray-200 h-64 rounded-xl" />
                ))}
              </div>
            }
          >
            <NoticiasSection 
              initialNoticias={initialNoticias}
              className="bg-white rounded-xl shadow-sm p-4" 
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}