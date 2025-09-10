import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { getAllNews } from '@/lib/getNews';
import HeroSection from '@/components/modern/HeroSection';
import StatsBar from '@/components/modern/StatsBar';
import NewsGrid from '@/components/modern/NewsGrid';
import Sidebar from '@/components/modern/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Dynamic imports for better performance
const NewsletterCTA = dynamic(() => import('@/components/modern/NewsletterCTA'), {
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-xl" />
});

const SocialFeed = dynamic(() => import('@/components/modern/SocialFeed'), {
  ssr: false
});

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const { news: initialNews } = await getAllNews({ pageSize: 12 });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Hero Section - Redesigned with better performance */}
      <section className="relative">
        <HeroSection news={initialNews.slice(0, 3)} />
      </section>

      {/* Stats Bar - New addition */}
      <section className="py-8 bg-white/80 backdrop-blur-sm border-y border-red-100">
        <div className="max-w-7xl mx-auto px-4">
          <StatsBar />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content - 3/4 width */}
            <main className="lg:col-span-3">
              <Suspense fallback={<LoadingSpinner />}>
                <NewsGrid 
                  initialNews={initialNews} 
                  title="Últimas do Mengão"
                  className="mb-12"
                />
              </Suspense>

              {/* Newsletter CTA */}
              <div className="mb-12">
                <NewsletterCTA />
              </div>

              {/* Social Feed */}
              <SocialFeed />
            </main>

            {/* Sidebar - 1/4 width */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-xl" />}>
                  <Sidebar />
                </Suspense>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}