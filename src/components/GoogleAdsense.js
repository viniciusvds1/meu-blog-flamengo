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
  
  // Verificar modo de economia de dados e inicializar AdSense corretamente
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Verificar modo de economia de dados
    if (navigator.connection && navigator.connection.saveData) {
      console.log('Modo de economia de dados ativado - carregamento de anúncios reduzido');
      return; // Não carrega anúncios em modo de economia de dados
    }

    // Inicialização controlada do AdSense para evitar duplicação
    if (window.adsbygoogle && !window.adsbygoogleInitialized) {
      try {
        window.adsbygoogleInitialized = true;
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('Erro ao inicializar AdSense:', error);
      }
    }
  }, []);

  if (!googleAdsClientId) {
    console.error('ID do cliente Google AdSense não encontrado');
    return null;
  }

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
        strategy="afterInteractive" // Mudar para afterInteractive para evitar problemas de inicialização
        onError={(e) => {
          console.error('Erro ao carregar script do AdSense:', e);
        }}
        onLoad={() => {
          console.log('Script do AdSense carregado com sucesso');
        }}
      />
      
      {/* Container para anúncios do AdSense */}
      <div key="adsense-container" className="w-full my-4 text-center">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={`ca-pub-${googleAdsClientId}`}
          data-ad-slot="5962665573"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </>
  );
};

export default GoogleAdsense;
