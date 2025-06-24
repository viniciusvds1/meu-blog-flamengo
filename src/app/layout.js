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
  'accept-ch': 'DPR, Width, Viewport-Width', // Client hints para otimizações
};

export const metadata = {
  title: {
    template: '%s | Blog do Flamengo',
    default: 'Blog do Flamengo - Notícias e Atualizações do Mengão',
  },
  description: 'Acompanhe as últimas notícias, resultados e informações sobre o Clube de Regatas do Flamengo.',
  metadataBase: new URL('https://www.orubronegronews.com'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://www.orubronegronews.com',
    siteName: 'Blog do Flamengo',
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog de notícias do Flamengo",
    description: "As últimas notícias e atualizações.",
    images: [{
      url: "assets/logooficialrubronews.png"
    }],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black',
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
        
        {/* Preload para imagens e recursos críticos na primeira renderização */}
        <link 
          rel="preload" 
          href="/assets/logooficialrubronews.png" 
          as="image"
        />
        <link 
          rel="preload" 
          href="/assets/bannerubro.png" 
          as="image"
          fetchpriority="high"
        />
        
        {/* Conexões antecipadas para API */}
        <link
          rel="preconnect"
          href="https://images.prismic.io"
          crossOrigin="anonymous"
        />
        <link 
          rel="dns-prefetch" 
          href="https://images.prismic.io"
        />
        
        {/* Configurações PWA e mobile */}
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="format-detection" content="telephone=no" />
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
          <main className="flex-grow pt-4 container-flamengo">
            {children}
          </main>
          
          {/* Footer com informações do site */}
          <Footer />
        </ProvidersWrapper>
          
          {/* Scripts e componentes de terceiros */}
          <div id="fb-root"></div>
          <Analytics />
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GTM_ID} />
          <GoogleAdsense pId={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID} />
          <InbendaScripts />
          <WebStory 
            embedURL="https://www.orubronegronews.com/"
          />
          
          {/* Banner de consentimento de cookies otimizado */}
          <CookieConsentBanner 
            buttonText="Aceitar Cookies"
          />
      </body>
    </html>
  );
}