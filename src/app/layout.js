import "./globals.css";
import Navbar from "../components/NavBar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import GoogleAdsense from "@/components/GoogleAdsense";
import { GoogleAnalytics } from "@next/third-parties/google";
import InbendaScripts from "@/components/InbedaScripts"
import WebStory from "@/components/webstories";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
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
    <html lang="pt-BR" className={inter.className}>
      <head>
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
          rel="preload" 
          href="/assets/logooficialrubronews.png" 
          as="image"
        />
        <link
          rel="preconnect"
          href="https://images.prismic.io"
          crossOrigin="anonymous"
        />
        <link 
          rel="dns-prefetch" 
          href="https://images.prismic.io"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <GoogleAdsense pId={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID} />
      </head>
      <body className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <div id="fb-root"></div>
        <Analytics />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GTM_ID} />
        <GoogleAdsense />
        <InbendaScripts />
        <WebStory 
          embedURL="https://www.orubronegronews.com/"
        />
      </body>
    </html>
  );
}