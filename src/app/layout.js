import "./globals.css";
import "@/styles/custom-animations.css";
import "@/styles/flamengo-theme.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { Inter, Roboto_Serif } from "next/font/google";
import GoogleAdsense from "@/components/GoogleAdsense";
import { GoogleAnalytics } from "@next/third-parties/google";
import InbendaScripts from "@/components/InbedaScripts"
import WebStory from "@/components/webstories";
import CookieConsentBanner from "@/components/CookieConsent";
import ProvidersWrapper from "@/components/ProvidersWrapper";

// Optimized font loading
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-roboto-serif',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#E20E0E',
  colorScheme: 'light dark',
};

export const metadata = {
  title: {
    template: '%s | Blog do Flamengo - O Portal do Mengão',
    default: 'Blog do Flamengo - Notícias, História e Paixão Rubro-Negra',
  },
  description: 'O maior blog independente do Flamengo! Notícias atualizadas, análises exclusivas, história do clube e tudo sobre o Clube de Regatas do Flamengo.',
  keywords: ['flamengo', 'mengão', 'notícias', 'futebol', 'brasileiro', 'rubro-negro', 'maracanã'],
  authors: [{ name: 'Blog do Flamengo', url: 'https://www.orubronegronews.com' }],
  creator: 'Blog do Flamengo',
  publisher: 'Blog do Flamengo',
  metadataBase: new URL(process.env.SITE_URL || 'https://www.orubronegronews.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.SITE_URL || 'https://www.orubronegronews.com',
    siteName: 'Blog do Flamengo',
    title: 'Blog do Flamengo - O Portal do Mengão',
    description: 'O maior blog independente do Flamengo! Notícias, análises e tudo sobre o Clube de Regatas do Flamengo.',
    images: [{
      url: '/assets/logooficialrubronews.png',
      width: 1200,
      height: 630,
      alt: 'Blog do Flamengo - Logo Oficial',
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog do Flamengo - O Portal do Mengão",
    description: "O maior blog independente do Flamengo! Notícias, análises e tudo sobre o Mengão.",
    images: [{
      url: "/assets/logooficialrubronews.png",
      alt: "Blog do Flamengo - Logo",
    }],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'sports',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${robotoSerif.variable} scroll-smooth`}>
      <head>
        {/* Critical resource hints */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.prismic.io" crossOrigin="anonymous" />
        
        {/* Preload critical images */}
        <link rel="preload" href="/assets/logooficialrubronews.png" as="image" fetchPriority="high" />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#E20E0E" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Blog do Flamengo",
              "description": "O maior blog independente do Flamengo! Notícias, análises e história do Mengão.",
              "url": process.env.SITE_URL || "https://www.orubronegronews.com",
              "publisher": {
                "@type": "Organization",
                "name": "Blog do Flamengo",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${process.env.SITE_URL || "https://www.orubronegronews.com"}/assets/logooficialrubronews.png`
                }
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${process.env.SITE_URL || "https://www.orubronegronews.com"}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      
      <body className="font-sans antialiased bg-gray-50 selection:bg-red-600 selection:text-white">
        <ProvidersWrapper>
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600" />
          
          {/* Navigation */}
          <NavBar />
          
          {/* Main content */}
          <main className="min-h-screen">
            {children}
          </main>
          
          {/* Footer */}
          <Footer />
        </ProvidersWrapper>
        
        {/* Third-party scripts */}
        <div id="fb-root" />
        
        {/* Analytics - only in production */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics />
            {process.env.NEXT_PUBLIC_GTM_ID && (
              <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GTM_ID} />
            )}
            {process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID && (
              <GoogleAdsense pId={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID} />
            )}
          </>
        )}
        
        <InbendaScripts />
        <WebStory embedURL={process.env.SITE_URL || "https://www.orubronegronews.com/"} />
        
        {/* Cookie consent */}
        <CookieConsentBanner 
          buttonText="Aceitar Cookies"
          className="animate-slide-in-up"
        />
      </body>
    </html>
  );
}