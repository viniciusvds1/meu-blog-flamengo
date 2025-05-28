"use client";
import Script from "next/script";
import { useEffect, useRef } from 'react';

/**
 * Componente otimizado para carregar o script do Google AdSense com melhor performance.
 * 
 * - Utiliza preconnect para acelerar a conexão
 * - Implementa estratégia de carregamento otimizada
 * - Adiciona suporte a modo de economia de dados
 * - Melhora o tratamento de erros
 * - Previne erros React com hooks e renderização
 *
 * @param {Object} props - Propriedades do componente
 * @param {string} props.pId - ID do cliente Google AdSense
 * @returns {JSX.Element} - Componente que inicializa o AdSense com otimizações
 */
const GoogleAdsense = ({ pId }) => {
  // Verificar se a variável de ambiente está definida
  const googleAdsClientId = pId || process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID;
  const initialized = useRef(false);
  
  // Verificar modo de economia de dados e inicializar AdSense corretamente
  useEffect(() => {
    // Verificamos se estamos no cliente e se já inicializamos
    if (typeof window === 'undefined' || initialized.current) return;
    
    // Marcar como inicializado para evitar múltiplas chamadas
    initialized.current = true;
    
    // Verificar modo de economia de dados
    if (navigator.connection && navigator.connection.saveData) {
      console.log('Modo de economia de dados ativado - carregamento de anúncios reduzido');
      return; // Não carrega anúncios em modo de economia de dados
    }

    // Espera um curto período para garantir que tudo esteja renderizado
    const initTimer = setTimeout(() => {
      try {
        // Inicialização segura do AdSense
        if (window.adsbygoogle) {
          const ads = document.querySelectorAll('.adsbygoogle');
          // Apenas inicializa anúncios que ainda não foram inicializados
          if (ads.length > 0) {
            ads.forEach(ad => {
              if (!ad.dataset.adInitialized) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                ad.dataset.adInitialized = 'true';
              }
            });
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar AdSense:', error);
      }
    }, 200); // Pequeno delay para garantir que o DOM esteja pronto
    
    // Limpeza do timer se o componente for desmontado
    return () => clearTimeout(initTimer);
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
        strategy="lazyOnload" // Mudar para lazyOnload para melhor performance
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${googleAdsClientId}`}
        crossOrigin="anonymous"
        onError={(e) => {
          console.error('Erro ao carregar script do AdSense:', e);
        }}
      />
      
      {/* Container para anúncios do AdSense com fallbacks e configurações seguras */}
      <div className="w-full my-4 text-center">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '280px' }}
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
