"use client"
import { useEffect } from 'react';

const AdBanner = ({ adClient, adSlot, adFormat = "auto" }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('Erro ao carregar anúncio:', e);
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

export default AdBanner;
