"use client";
import Script from "next/script";

/**
 * Componente para carregar o script do Google AdSense.
 *
 * @returns {JSX.Element} - Elemento JSX que carrega o script do AdSense.
 */
const GoogleAdsense = () => {
  // Verificar se a variável de ambiente está definida
  const googleAdsClientId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID;
  if (!googleAdsClientId) {
    console.error('A variável de ambiente NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID não está definida.');
    return null; // Retorna null se a variável não estiver definida
  }

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${googleAdsClientId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onError={(e) => {
          console.error('Erro ao carregar script do AdSense:', e);
        }}
        aria-label="Script do Google AdSense"
      />
    </>
  );
};

export default GoogleAdsense;
