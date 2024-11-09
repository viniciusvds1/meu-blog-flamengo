import localFont from "next/font/local";
import "./globals.css";
import Navbar from '../components/NavBar';
import Footer from "@/components/Footer";



export const metadata = {
  title: 'Blog do Flamengo',
  description: 'As últimas notícias e resultados do Flamengo',
  openGraph: {
    title: 'Blog do Flamengo',
    description: 'As últimas notícias e atualizações.',
    url: 'https://www.seusite.com',
    siteName: 'Blog do Flamengo',
    images: [
      {
        url: 'https://www.seusite.com/og-image.jpg',
        width: 800,
        height: 600,
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meu Blog de Notícias',
    description: 'As últimas notícias e atualizações.',
    images: ['https://www.seusite.com/twitter-image.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head />
      <body>
        <Navbar />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
