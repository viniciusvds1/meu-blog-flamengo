import "./globals.css";
import Navbar from "../components/NavBar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import GoogleAdsense from "@/components/GoogleAdsense";
import { GoogleAnalytics } from "@next/third-parties/google";
import InbendaScripts from "@/components/InbedaScripts"
import WebStory from "@/components/webstories";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blog do Flamengo",
  description: "As últimas notícias e resultados do Flamengo",
  openGraph: {
    title: "Blog do Flamengo",
    description: "As últimas notícias e atualizações.",
    url: "https://www.ogubronegronews.com",
    siteName: "Blog do Flamengo",
    images: [
      {
        url: "assets/logooficialrubronews.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog de notícias do Flamengo",
    description: "As últimas notícias e atualizações.",
    images: [{
      url: "assets/logooficialrubronews.png"
    }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Analytics />
        <Navbar />
        {children}
        <div id="fb-root"></div>
        <Footer />
        
      <WebStory 
        embedURL="https://www.orubronegronews.com/"
      />
      </body>
      <InbendaScripts/>
      <GoogleAdsense pId={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID} />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GTM_ID}/>
    </html>
  );
}