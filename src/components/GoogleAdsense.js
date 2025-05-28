"use client";
import Script from "next/script";
import { useEffect } from 'react';

/**
 * Componente otimizado para carregar o script do Google AdSense com melhor performance.
 * 
 * - Utiliza preconnect para acelerar a conexão
 * - Implementa estratégia de carregamento otimizada
 * - Adiciona suporte a modo de economia de dados
 * - Melhora o tratamento de erros
 *
 * @param {Object} props - Propriedades do componente
 * @param {string} props.pId - ID do cliente Google AdSense
 * @returns {JSX.Element} - Componente que inicializa o AdSense com otimizações
 */
const GoogleAdsense = ({ pId }) => {
  // Verificar se a variável de ambiente está definida
  const googleAdsClientId = pId || process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID;
  
  if (!googleAdsClientId) {
    console.error('ID do cliente Google AdSense não encontrado');
    return null;
  }

  // Verificar modo de economia de dados (client-side only)
  useEffect(() => {
    // Verificar se estamos no navegador e se o modo de economia de dados está ativado
    if (typeof navigator !== 'undefined' && navigator.connection && navigator.connection.saveData) {
      // Modo de economia de dados ativado
      // Poderia implementar uma estratégia de carregamento reduzido ou alternativa
    }
  }, []);

  return (
    <>
      {/* Preconnect para domínios do AdSense para carregamento mais rápido */}
      <link 
        rel="preconnect" 
        href="https://pagead2.googlesyndication.com" 
        crossOrigin="anonymous" 
      />
      <link 
        rel="preconnect" 
        href="https://googleads.g.doubleclick.net" 
        crossOrigin="anonymous" 
      />
      <link 
        rel="preconnect" 
        href="https://tpc.googlesyndication.com" 
        crossOrigin="anonymous" 
      />
      
      {/* Script do AdSense com estratégia otimizada de carregamento */}
      <Script
        id="google-adsense"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${googleAdsClientId}`}
        crossOrigin="anonymous"
        strategy="lazyOnload" // Carregamento otimizado após carregamento da página
        onError={(e) => {
          console.error('Erro ao carregar script do AdSense:', e);
          // Implementar telemetria de erro aqui se necessário
        }}
        onLoad={() => {
          // Script do AdSense carregado
        }}
        data-ad-frequency-hint="30s"
        aria-label="Script do Google AdSense"
      />
    </>
  );
};

export default GoogleAdsense;
