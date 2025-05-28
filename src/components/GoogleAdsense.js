"use client";
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

  // Implementação direta para carregar o script do AdSense
  useEffect(() => {
    if (typeof window === 'undefined' || !googleAdsClientId) return;
    
    // Limpa scripts anteriores do AdSense para evitar duplicações
    const existingScript = document.getElementById('adsense-script');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Cria links de preconnect diretamente no head
    const createPreconnect = (href) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };
    
    // Adiciona preconnects para domínios do AdSense
    createPreconnect('https://pagead2.googlesyndication.com');
    createPreconnect('https://googleads.g.doubleclick.net');
    createPreconnect('https://tpc.googlesyndication.com');
    
    // Cria e adiciona o script do AdSense
    const script = document.createElement('script');
    script.id = 'adsense-script';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${googleAdsClientId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    // Função para inicializar os anúncios
    script.onload = () => {
      console.log('Script do AdSense carregado com sucesso');
      try {
        setTimeout(() => {
          if (window.adsbygoogle) {
            const ads = document.querySelectorAll('.adsbygoogle');
            ads.forEach(ad => {
              if (!ad.hasAttribute('data-adsbygoogle-initialized')) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                ad.setAttribute('data-adsbygoogle-initialized', 'true');
              }
            });
          }
        }, 300); // Pequeno delay para garantir que o DOM está pronto
      } catch (err) {
        console.error('Erro na inicialização do AdSense:', err);
      }
    };
    
    script.onerror = (e) => {
      console.error('Erro ao carregar script do AdSense:', e);
    };
    
    document.head.appendChild(script);
    
    // Limpeza ao desmontar
    return () => {
      const scriptToRemove = document.getElementById('adsense-script');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [googleAdsClientId]); // Só recarrega se o ID mudar
  
  if (!googleAdsClientId) {
    console.error('ID do cliente Google AdSense não encontrado');
    return null;
  }
  
  return (
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
  );
};

export default GoogleAdsense;
