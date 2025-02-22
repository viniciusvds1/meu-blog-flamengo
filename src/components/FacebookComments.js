/**
 * Componente para exibir comentários do Facebook.
 *
 * @returns {JSX.Element} - Elemento JSX do componente de comentários do Facebook.
 */
'use client';
import { useEffect, useState } from 'react';

/**
 * Componente de comentários do Facebook.
 *
 * @description Carrega o SDK do Facebook e exibe os comentários.
 * @throws {Error} Se houver erro ao carregar o SDK do Facebook.
 */
const FacebookComments = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setCurrentUrl(window.location.href);
      if (!document.getElementById('facebook-jssdk')) {
        let script = document.createElement('script');
        script.id = 'facebook-jssdk';
        script.src = 'https://connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v17.0&appId=1277752713485967&autoLogAppEvents=1';
        document.body.appendChild(script);
        script.onload = () => {
          if (window.FB) {
            window.FB.init({
              appId: '1277752713485967',
              autoLogAppEvents: true,
              xfbml: true,
              version: 'v17.0',
            });
            window.FB.XFBML.parse();
          }
        };
        if (window.FB) {
          window.FB.XFBML.parse();
        }
      }
    } catch (error) {
      setError(error);
      console.error('Erro ao carregar o SDK do Facebook:', error);
    }
  }, []);

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