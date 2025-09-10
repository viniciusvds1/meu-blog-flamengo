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
import { Suspense } from "react";

// Carregamento otimizado das fontes - limitando ao mínimo necessário
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  weight: ['400', '500', '700'], // Apenas os pesos que realmente usamos
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Arial', 'sans-serif'],
  adjustFontFallback: true,
  variable: '--font-inter',
});

const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  weight: ['400', '700'], // Reduzindo para apenas os pesos essenciais
  variable: '--font-roboto-serif',
});

// Configurações otimizadas de viewport para melhor responsividade
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#e20e0e', // Vermelho Flamengo como tema principal
  colorScheme: 'light dark',
};

export const metadata = {
  title: {
    template: '%s | Blog do Flamengo',
    default: 'Blog do Flamengo - Notícias e Atualizações do Mengão',
  },
  description: 'Acompanhe as últimas notícias, resultados, elenco e informações exclusivas sobre o Clube de Regatas do Flamengo. O maior portal rubro-negro do Brasil.',
  keywords: 'Flamengo, Mengão, CRF, notícias Flamengo, resultados Flamengo, elenco Flamengo, Clube de Regatas do Flamengo, futebol brasileiro',
  authors: [{ name: 'Blog do Flamengo', url: 'https://www.orubronegronews.com' }],
  creator: 'Blog do Flamengo',
  publisher: 'Blog do Flamengo',
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
  metadataBase: new URL('https://www.orubronegronews.com'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://www.orubronegronews.com',
    siteName: 'Blog do Flamengo',
    title: 'Blog do Flamengo - Notícias e Atualizações do Mengão',
    description: 'Acompanhe as últimas notícias, resultados, elenco e informações exclusivas sobre o Clube de Regatas do Flamengo.',
    images: [
      {
        url: '/assets/logooficialrubronews.png',
        width: 1200,
        height: 630,
        alt: 'Blog do Flamengo Logo',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog do Flamengo - Notícias e Atualizações do Mengão",
    description: "Acompanhe as últimas notícias, resultados e informações exclusivas sobre o Flamengo.",
    images: ['/assets/logooficialrubronews.png'],
    creator: '@orubronegronews',
  },
  alternates: {
    canonical: 'https://www.orubronegronews.com',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  category: 'sports',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black',
    'apple-mobile-web-app-title': 'Blog do Flamengo',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${robotoSerif.variable}`}>
      <head>
        {/* Otimização crítica: Preconnect para domínios externos */}
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://www.google-analytics.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://images.prismic.io"
          crossOrigin="anonymous"
        />
        
        {/* Preload para imagens e recursos críticos na primeira renderização */}
        <link 
          rel="preload" 
          href="/assets/logooficialrubronews.png" 
          as="image"
          type="image/png"
        />
        <link 
          rel="preload" 
          href="/assets/bannerubro.png" 
          as="image"
          fetchpriority="high"
          type="image/png"
        />
        
        <link 
          rel="dns-prefetch" 
          href="https://images.prismic.io"
        />
        <link 
          rel="dns-prefetch" 
          href="https://pagead2.googlesyndication.com"
        />
        
        {/* Configurações PWA e mobile */}
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Blog do Flamengo",
              "alternateName": "RubroNews",
              "url": "https://www.orubronegronews.com",
              "description": "Portal de notícias oficial sobre o Clube de Regatas do Flamengo",
              "publisher": {
                "@type": "Organization",
                "name": "Blog do Flamengo",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.orubronegronews.com/assets/logooficialrubronews.png"
                }
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.orubronegronews.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-gray-50 font-sans" style={{
        '--font-sans': 'var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        '--font-serif': 'var(--font-roboto-serif), Georgia, "Times New Roman", serif',
        scrollBehavior: 'smooth', // Melhor UX para rolagem
        textRendering: 'optimizeLegibility', // Melhor renderização de texto
      }}>
        {/* Wrapper que contém todos os providers de autenticação como Client Component */}
        <ProvidersWrapper>
          {/* Faixa superior nas cores do Flamengo */}
          <div className="h-1 w-full bg-flamengo-gradient"></div>
          
          {/* Header com navegação */}
          <header className="sticky top-0 z-50 w-full bg-white shadow-md">
            <Navbar />
          </header>
          
          {/* Conteúdo principal com otimizações para anúncios */}
          <main className="flex-grow pt-4 container-flamengo" role="main">
            {children}
          </main>
          
          {/* Footer com informações do site */}
          <Suspense fallback={<div className="h-32 bg-black animate-pulse" />}>
            <Footer />
          </Suspense>
        </ProvidersWrapper>
          
          {/* Scripts e componentes de terceiros */}
          <div id="fb-root"></div>
          <Suspense fallback={null}>
            <Analytics />
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GTM_ID} />
            <GoogleAdsense pId={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID} />
            <InbendaScripts />
            <WebStory 
              embedURL="https://www.orubronegronews.com/"
            />
          </Suspense>
          
          {/* Banner de consentimento de cookies otimizado */}
          <Suspense fallback={null}>
            <CookieConsentBanner 
              buttonText="Aceitar Cookies"
            />
          </Suspense>
      </body>
    </html>
  );
}