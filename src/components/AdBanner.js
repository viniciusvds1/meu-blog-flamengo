"use client";
import { useEffect, useRef, useState } from 'react';
import AdUnit from './AdUnit';

/**
 * Componente otimizado de banner para exibir anu00fancios em destaque acima da dobra
 * Implementa carregamento prioritu00e1rio para melhorar a monetizau00e7u00e3o
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.slot - ID do slot do anu00fancio no AdSense
 * @param {string} props.className - Classes CSS adicionais
 * @returns {JSX.Element} - Banner de anu00fancio otimizado
 */
const AdBanner = ({ slot, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const bannerRef = useRef(null);

  // Cores oficiais do Flamengo para o banner
  const flamengoRed = '#e20e0e';
  const flamengoBlack = '#000000';

  useEffect(() => {
    // Usar IntersectionObserver para detectar quando o banner fica visu00edvel
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handler para tratamento de erros
  const handleError = () => {
    setHasError(true);
    console.error('Erro ao carregar banner de anu00fancio');
  };

  return (
    <div 
      ref={bannerRef}
      className={`w-full max-w-[970px] mx-auto my-4 px-2 ${className}`}
      style={{ 
        background: `linear-gradient(135deg, ${flamengoRed} 0%, ${flamengoBlack} 100%)`,
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}
    >
      {hasError ? (
        <div className="flex items-center justify-center h-[90px] text-white text-sm">
          <span>u26A0uFE0F Conteu00fado indisponu00edvel</span>
        </div>
      ) : (
        <div className="p-1">
          <AdUnit 
            format="horizontal"
            slot={slot} 
            position="top" 
          />
        </div>
      )}
    </div>
  );
};

export default AdBanner;
