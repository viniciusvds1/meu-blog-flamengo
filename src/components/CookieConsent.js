"use client";
import { useState, useEffect, memo } from 'react';
import CookieConsent from 'react-cookie-consent';
import { COLORS } from '@/constants/theme';

/**
 * Componente otimizado de banner de consentimento de cookies.
 * Integrado com AdSense para conformidade com políticas de privacidade.
 * 
 * Melhorias:
 * - Carregamento dinâmico para melhor performance
 * - UI/UX melhorada com cores do Flamengo
 * - Integração com Google AdSense
 * - Acessibilidade aprimorada
 * - Evento de analytics para rastreamento
 *
 * @param {Object} props - Propriedades do componente
 * @param {string} props.message - Mensagem personalizada para o banner
 * @param {string} props.buttonText - Texto do botão de aceitação
 * @returns {JSX.Element} - Banner de consentimento de cookies otimizado
 */
const CookieConsentBanner = ({ 
  message = "Este site utiliza cookies e tecnologias semelhantes, incluindo o Google AdSense, para melhorar sua experiência e oferecer conteúdo personalizado.", 
  buttonText = "Aceitar"
}) => {
  const [loaded, setLoaded] = useState(false);
  
  // Carregamento dinâmico para não afetar a performance inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1500); // Atraso para melhorar LCP e CLS
    
    return () => clearTimeout(timer);
  }, []);
  
  // Estilos aprimorados para o modal de cookies
  const bannerStyle = {
    background: `linear-gradient(145deg, ${COLORS.primary.black} 0%, #1a1a1a 100%)`,
    color: '#ffffff',
    position: 'fixed',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.25)',
    zIndex: 999,
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '100%',
    fontSize: '14px',
    lineHeight: 1.6,
    borderTop: `2px solid ${COLORS.primary.red}`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '8px 8px 0 0',
    margin: '0 16px 0 16px',
    width: 'calc(100% - 32px)',
    maxWidth: '1200px',
    left: '50%',
    transform: 'translateX(-50%)'
  };
  
  // Estilo moderno do botão com efeito hover
  const buttonStyle = {
    background: `linear-gradient(135deg, ${COLORS.primary.red} 0%, #b50c0c 100%)`,
    color: '#FFFFFF',
    fontSize: '14px',
    padding: '10px 24px',
    borderRadius: '6px',
    fontWeight: 600,
    marginTop: '16px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 8px rgba(226, 14, 14, 0.25)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };
  
  // Handler para aceitação de cookies (implementado internamente)
  const handleAccept = () => {
    // Informar o Google AdSense sobre o consentimento
    try {
      if (typeof window !== 'undefined') {
        // Ativar anuncios personalizados no AdSense
        if (window.adsbygoogle) {
          if (typeof window.adsbygoogle.requestNonPersonalizedAds === 'function') {
            window.adsbygoogle.requestNonPersonalizedAds = 0; // 0 = personalizado, 1 = não personalizado
          }
          
          // Reativar requisições de anúncios se estiverem pausadas
          if (typeof window.adsbygoogle.pauseAdRequests === 'number') {
            window.adsbygoogle.pauseAdRequests = 0;
          }
        }
        
        // Registrar evento de analytics
        if (window.gtag) {
          window.gtag('event', 'cookie_consent', {
            'event_category': 'engagement',
            'event_label': 'consent_accepted'
          });
        }
        
        // Informar console sobre a aceitação para debugging
        // Cookies aceitos: AdSense configurado
      }
    } catch (e) {
      console.error('Erro ao processar aceitação de cookies:', e);
    }
  };
  
  // Não renderizar nada até que o componente seja carregado
  if (!loaded) return null;
  
  return (
    <CookieConsent
      location="bottom"
      buttonText={buttonText}
      cookieName="flamengoBlogConsent"
      style={bannerStyle}
      buttonStyle={buttonStyle}
      expires={365} // Cookie válido por 1 ano
      onAccept={handleAccept}
      enableDeclineButton={false}
      flipButtons={false}
      buttonWrapperClasses="cookie-consent-buttons"
      contentClasses="cookie-consent-content"
      overlayClasses="cookie-consent-overlay"
      ariaAcceptLabel="Aceitar cookies e tecnologias de rastreamento"
      sameSite="strict"
      debug={false}
      extraCookieOptions={{ secure: true }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center mb-1">
          <div className="w-6 h-6 mr-2 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 3V2H11V3H13M8 3V5H16V3H8M11 21H13V18H11V21M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16ZM11 10V12H13V10H11Z" />
            </svg>
          </div>
          <span className="text-base font-bold text-red-500">
            Política de Cookies do Rubro-Negro
          </span>
        </div>
        
        <p className="text-sm leading-relaxed">{message}</p>
        
        <div className="flex flex-wrap gap-3 mt-1">
          <div className="flex items-center bg-gray-800 bg-opacity-30 px-2 py-1 rounded text-xs">
            <span className="mr-1 text-green-400">✓</span> Análise de uso
          </div>
          <div className="flex items-center bg-gray-800 bg-opacity-30 px-2 py-1 rounded text-xs">
            <span className="mr-1 text-green-400">✓</span> Conteúdo personalizado
          </div>
          <div className="flex items-center bg-gray-800 bg-opacity-30 px-2 py-1 rounded text-xs">
            <span className="mr-1 text-green-400">✓</span> Anúncios relevantes
          </div>
        </div>
        
        <p className="text-xs text-gray-300 mt-2">
          Ao clicar em <strong>&quot;{buttonText}&quot;</strong>, você concorda com nossa <a href="/politica-de-privacidade" className="underline hover:text-white">política de privacidade</a>.
        </p>
      </div>
    </CookieConsent>
  );
};

// Memoizando o componente para evitar re-renderizações desnecessárias
export default memo(CookieConsentBanner);
