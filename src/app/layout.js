import "./globals.css";
import Navbar from "../components/NavBar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import Script from "next/script";
import GoogleAdsense from "@/components/GoogleAdsense";
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
        url: "https://www.ogubronegronews.com/og-image.jpg",
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
    images: ["https://www.ogubronegronews.com/twitter-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
       <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: "ca-pub-2748482520534761",
                enable_page_level_ads: true
              });
            `,
          }}
        />
      </Head>
      <body className={inter.className}>
        <Analytics />
        <Navbar />
        {children}
        <Footer />
      </body>
      <GoogleAdsense pId="2748482520534761" />
    </html>
  );
}