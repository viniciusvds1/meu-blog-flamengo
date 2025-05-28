/**
 * Componente para exibir comentários do Facebook.
 *
 * @returns {JSX.Element} - Elemento JSX do componente de comentários do Facebook.
 */
'use client';
import { useEffect, useState, useRef } from 'react';

/**
 * Componente de comentários do Facebook.
 *
 * @description Carrega o SDK do Facebook e exibe os comentários.
 */
const FacebookComments = ({ url }) => {
  // Use URL fornecido como prop ou fallback para URL atual
  const [currentUrl, setCurrentUrl] = useState('');
  const [error, setError] = useState(null);
  const initializationComplete = useRef(false);

  useEffect(() => {
    // Garantir que este código só executa no navegador
    if (typeof window === 'undefined') return;
    
    // Função para inicializar o FB SDK com tratamento de erros adequado
    const initFacebookSDK = () => {
      try {
        // Usar a URL fornecida ou obter a URL atual
        const pageUrl = url || window.location.href;
        setCurrentUrl(pageUrl);
        
        // Evitar múltiplas inicializações
        if (initializationComplete.current) return;
        initializationComplete.current = true;
        
        if (!document.getElementById('facebook-jssdk')) {
          const script = document.createElement('script');
          script.id = 'facebook-jssdk';
          script.src = 'https://connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v17.0&appId=1277752713485967&autoLogAppEvents=1';
          script.crossOrigin = 'anonymous'; // Adicionar crossOrigin para resolver o erro
          script.async = true;
          script.defer = true;
          
          // Anexar o script ao final do body
          document.body.appendChild(script);
          
          // Configurar o callback para quando o script carregar
          script.onload = () => {
            if (window.FB) {
              window.FB.init({
                appId: '1277752713485967',
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v17.0',
              });
              // Analisar os elementos do XFBML para renderizar os comentários
              window.FB.XFBML.parse();
            }
          };
        } else if (window.FB) {
          // Se o SDK já estiver carregado, apenas re-parse os elementos
          window.FB.XFBML.parse();
        }
      } catch (err) {
        setError(err);
        console.error('Erro ao carregar o SDK do Facebook:', err);
      }
    };
    
    // Inicializar o SDK
    initFacebookSDK();
    
    // Cleanup ao desmontar
    return () => {
      initializationComplete.current = false;
    };
  }, [url]); // Dependência na URL para re-inicializar quando mudar

  if (error) {
    return (
      <div className="container mx-auto px-4 max-w-4xl mt-8">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Erro</h2>
          <p className="text-lg text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl mt-8">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Comentários</h2>
        <div 
          className="fb-comments" 
          data-href={currentUrl} 
          data-width="100%" 
          data-numposts="5"
          aria-label="Comentários do Facebook"
        ></div>
      </div>
    </div>
  );
};

export default FacebookComments;