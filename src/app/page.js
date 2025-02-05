import Image from 'next/image';
import { Suspense } from 'react';
import LastResultAndNextGame from '@/components/LastResultAndNextGame';
import NewsletterSignup from '@/components/NewsletterSignup';
import SearchBar from '@/components/SearchBar';
import NoticiasSection from '@/components/NoticiasSection';
import AddBanner from '@/components/AddBanner';
import StoreSection from '@/components/StoreSection';
import { getAllNews } from '@/lib/getNews';

// Loading components for better UX
const SidebarSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="bg-gray-200 h-64 rounded-lg" />
    <div className="bg-gray-200 h-48 rounded-lg" />
    <div className="bg-gray-200 h-32 rounded-lg" />
  </div>
);

export default async function Home() {
  const { news: initialNoticias } = await getAllNews({ pageSize: 6 });

  return (
    <main className="bg-base-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="relative mb-12">
          <div className="relative aspect-[21/9] md:aspect-[3/1] w-full overflow-hidden rounded-xl">
            <Image
              src="/assets/bannerubro.png"
              alt="Banner do Flamengo"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
              <div className="max-w-3xl">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  Blog do Flamengo
                </h1>
                <p className="text-lg md:text-xl text-gray-100">
                  Todas as notícias do Mengão em um só lugar
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="mb-8">
          <SearchBar className="max-w-2xl mx-auto" />
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
    </main>
  );
}

// Add metadata
export const metadata = {
  title: 'Blog do Flamengo - Todas as notícias do Mengão',
  description: 'Acompanhe as últimas notícias, resultados e informações sobre o Clube de Regatas do Flamengo.',
  openGraph: {
    title: 'Blog do Flamengo',
    description: 'Todas as notícias do Mengão em um só lugar',
    images: [{ url: '/assets/banner.jpeg' }],
    type: 'website',
    site_name: 'Blog do Flamengo',
  },
};