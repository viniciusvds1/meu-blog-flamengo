import "./globals.css";
import "@/styles/custom-animations.css";
import "@/styles/flamengo-theme.css";
import Navbar from "../components/NavBar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { Inter, Roboto_Serif } from "next/font/google";
import GoogleAdsense from "@/components/GoogleAdsense";
import { GoogleAnalytics } from "@next/third-parties/google";
import InbendaScripts from "@/components/InbedaScripts"
import WebStory from "@/components/webstories";
import CookieConsentBanner from "@/components/CookieConsent";
import ProvidersWrapper from "@/components/ProvidersWrapper";

// Carregamento otimizado das fontes para máxima performance
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'],
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Arial', 'sans-serif'],
  adjustFontFallback: true,
  variable: '--font-inter',
});

const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  weight: ['400', '700'],
  variable: '--font-roboto-serif',
});

// Viewport otimizado para todos os dispositivos
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#E20E0E',
  colorScheme: 'light dark',
  'accept-ch': 'DPR, Width, Viewport-Width',
};

// Metadata aprimorado para SEO e redes sociais
export const metadata = {
  title: {
    template: '%s | Blog do Flamengo - O Rubro Negro News',
    default: 'Blog do Flamengo - Notícias, História e Paixão Rubro-Negra | O Rubro Negro News',
  },
  description: 'O melhor blog do Flamengo! Notícias atualizadas, história do clube, resultados dos jogos e tudo sobre o Clube de Regatas do Flamengo. Mengão de Coração!',
  keywords: ['flamengo', 'mengão', 'notícias', 'futebol', 'brasileiro', 'história', 'jogadores', 'maracanã', 'rubro-negro'],
  metadataBase: new URL(process.env.SITE_URL || 'https://www.orubronegronews.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.SITE_URL || 'https://www.orubronegronews.com',
    siteName: 'Blog do Flamengo - O Rubro Negro News',
    title: 'Blog do Flamengo - Notícias e Atualizações do Mengão',
    description: 'O melhor blog do Flamengo! Notícias atualizadas, história do clube, resultados dos jogos e tudo sobre o Clube de Regatas do Flamengo.',
    images: [{
      url: '/assets/logooficialrubronews.png',
      width: 1200,
      height: 630,
      alt: 'Logo Oficial - O Rubro Negro News',
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog do Flamengo - O Rubro Negro News",
    description: "O melhor blog do Flamengo! Notícias, história e tudo sobre o Mengão.",
    images: [{
      url: "/assets/logooficialrubronews.png",
      alt: "Logo Oficial - O Rubro Negro News",
    }],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Blog do Flamengo',
    'mobile-web-app-capable': 'yes',
    'application-name': 'Blog do Flamengo',
    'msapplication-TileColor': '#E20E0E',
    'msapplication-config': '/browserconfig.xml',
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${robotoSerif.variable} scrollbar-flamengo`}>
      <head>
        {/* Conexões antecipadas críticas para performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.prismic.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.prismic.io" />
        
        {/* Preload de recursos críticos */}
        <link rel="preload" href="/assets/logooficialrubronews.png" as="image" fetchPriority="high" />
        <link rel="preload" href="/assets/bannerubro.png" as="image" fetchPriority="high" />
        
        {/* Favicons otimizados */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Meta tags para PWA */}
        <meta name="theme-color" content="#E20E0E" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Blog do Flamengo" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Blog do Flamengo - O Rubro Negro News",
              "description": "O melhor blog do Flamengo! Notícias atualizadas, história do clube e tudo sobre o Mengão.",
              "url": process.env.SITE_URL || "https://www.orubronegronews.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${process.env.SITE_URL || "https://www.orubronegronews.com"}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "O Rubro Negro News",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${process.env.SITE_URL || "https://www.orubronegronews.com"}/assets/logooficialrubronews.png`
                }
              }
            })
          }}
        />
      </head>
      <body 
        className="flex flex-col min-h-screen bg-gray-50 font-sans antialiased" 
        style={{
          '--font-sans': 'var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          '--font-serif': 'var(--font-roboto-serif), Georgia, "Times New Roman", serif',
        }}
      >
        <ProvidersWrapper>
          {/* Barra superior do Flamengo */}
          <div className="h-2 w-full bg-flamengo-gradient animate-shimmer"></div>
          
          {/* Header com navegação otimizada */}
          <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-lg border-b border-red-100">
            <Navbar />
          </header>
          
          {/* Conteúdo principal */}
          <main className="flex-grow pt-6 container-flamengo">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
          
          {/* Footer aprimorado */}
          <Footer />
        </ProvidersWrapper>
          
        {/* Scripts de terceiros otimizados */}
        <div id="fb-root"></div>
        
        {/* Analytics condicionais baseados no ambiente */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics />
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GTM_ID} />
            <GoogleAdsense pId={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID} />
          </>
        )}
        
        <InbendaScripts />
        <WebStory embedURL={process.env.SITE_URL || "https://www.orubronegronews.com/"} />
        
        {/* Banner de cookies com melhor UX */}
        <CookieConsentBanner 
          buttonText="Aceitar Todos os Cookies"
          className="animate-slide-in-up"
        />
      </body>
    </html>
  );
}