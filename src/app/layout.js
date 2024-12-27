import "./globals.css";
import Navbar from "../components/NavBar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

export const metadata = {
  title: "Blog do Flamengo",
  description: "As últimas notícias e resultados do Flamengo",
  openGraph: {
    title: "Blog do Flamengo",
    description: "As últimas notícias e atualizações.",
    url: "https://www.seusite.com",
    siteName: "Blog do Flamengo",
    images: [
      {
        url: "https://www.seusite.com/og-image.jpg",
        width: 800,
        height: 600,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meu Blog de Notícias",
    description: "As últimas notícias e atualizações.",
    images: ["https://www.seusite.com/twitter-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2748482520534761"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Analytics />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
