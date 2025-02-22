"use client"
import { useEffect } from 'react';

/**
 * Componente de banner de anúncio.
 * 
 * @param {string} adClient - ID do cliente de anúncios.
 * @param {string} adSlot - ID do slot de anúncios.
 * @param {string} [adFormat="auto"] - Formato do anúncio.
 * @returns {JSX.Element|null} O componente de banner de anúncio ou null se as props não estiverem definidas.
 */
const AdBanner = ({ adClient, adSlot, adFormat = "auto" }) => {
  // Verificar se adClient e adSlot estão definidos
  if (!adClient || !adSlot) {
    console.error('adClient e adSlot são obrigatórios para o AdBanner.');
    return null; // Retorna null se as props não estiverem definidas
  }

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('Erro ao carregar anúncio:', e);
      // Aqui você pode adicionar um fallback ou mensagem de erro para o usuário
    }
  }, []);

  return (
    <div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      ></ins>
      <noscript>
        <div style={{ textAlign: 'center', color: '#FF0000' }}>
          Publicidade não disponível. Por favor, habilite o JavaScript para visualizar os anúncios.
        </div>
      </noscript>
    </div>
  );
};

/**
 * Verifica se as props adClient e adSlot estão definidas.
 * 
 * @param {object} props - Props do componente.
 * @param {string} props.adClient - ID do cliente de anúncios.
 * @param {string} props.adSlot - ID do slot de anúncios.
 * @returns {boolean} True se as props estiverem definidas, false caso contrário.
 */
const validateProps = (props) => {
  if (!props.adClient || !props.adSlot) {
    console.error('adClient e adSlot são obrigatórios para o AdBanner.');
    return false;
  }
  return true;
};

/**
 * Carrega o anúncio.
 * 
 * @param {object} props - Props do componente.
 * @param {string} props.adClient - ID do cliente de anúncios.
 * @param {string} props.adSlot - ID do slot de anúncios.
 * @param {string} props.adFormat - Formato do anúncio.
 */
const loadAd = (props) => {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {
    console.error('Erro ao carregar anúncio:', e);
    // Aqui você pode adicionar um fallback ou mensagem de erro para o usuário
  }
};

export default AdBanner;
