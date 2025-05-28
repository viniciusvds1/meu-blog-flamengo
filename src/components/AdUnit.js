"use client";
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * Componente otimizado para exibir anúncios do Google AdSense em posições estratégicas
 * @param {Object} props - Propriedades do componente
 * @param {string} props.format - Formato do anúncio (ex: 'auto', 'rectangle', 'horizontal')
 * @param {string} props.slot - ID do slot do anúncio no Google AdSense
 * @param {string} props.position - Posição do anúncio ('top', 'content', 'sidebar')
 * @returns {JSX.Element} Componente de anúncio do AdSense
 */
const AdUnit = ({ format = 'auto', slot, position = 'content' }) => {
  const [hasError, setHasError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isDataSaverEnabled, setIsDataSaverEnabled] = useState(false);
  const adRef = useRef(null);
  
  // Usando IntersectionObserver para carregar o anúncio apenas quando visível
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '200px 0px',
  });

  useEffect(() => {
    setIsClient(true);
    
    // Verificar se o modo de economia de dados está ativado
    if (navigator.connection) {
      setIsDataSaverEnabled(navigator.connection.saveData === true);
    }
    
    // Combinar o ref do IntersectionObserver com nosso ref local
    if (adRef.current) {
      ref(adRef.current);
    }
  }, [ref]);

  useEffect(() => {
    // Só tenta carregar o anúncio quando estiver visível e no cliente
    if (inView && isClient && !isDataSaverEnabled) {
      try {
        const adsbygoogle = window.adsbygoogle || [];
        adsbygoogle.push({});
      } catch (error) {
        console.error('Erro ao carregar anúncio:', error);
        setHasError(true);
      }
    }
  }, [inView, isClient, isDataSaverEnabled]);

  // Se estiver no modo de economia de dados, não exibe o anúncio
  if (isDataSaverEnabled) {
    return null;
  }

  // Estilos para diferentes posições
  const positionStyles = {
    top: 'w-full my-4 overflow-hidden min-h-[90px] bg-gray-50',
    content: 'w-full my-6 overflow-hidden min-h-[250px] bg-gray-50',
    sidebar: 'w-full lg:w-[300px] overflow-hidden min-h-[250px] sticky top-24 bg-gray-50'
  };

  // Classe base para todos os anúncios com animação de carregamento
  const baseClass = `adsbygoogle relative ${positionStyles[position] || 'w-full my-4'} `;
  
  // Adicionar skeleton loading
  const skeletonClass = !inView ? 'animate-pulse bg-gray-200 rounded' : '';

  return (
    <div className={`ad-container ${position}-ad relative`}>
      {hasError ? (
        <div className="text-xs text-gray-400 text-center p-2 hidden">Anúncio indisponível</div>
      ) : (
        <>
          {/* Indicador de anúncio para conformidade */}
          <div className="text-[10px] text-gray-400 text-center">Publicidade</div>
          
          {/* Container do anúncio com skeleton loading */}
          <div className={`${baseClass} ${skeletonClass}`} ref={adRef}>
            {isClient && (
              <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={`ca-pub-${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
                data-adtest={process.env.NODE_ENV !== 'production' ? 'on' : 'off'}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdUnit;
