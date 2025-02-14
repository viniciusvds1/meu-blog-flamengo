"use client";
import Script from "next/script";

const GoogleAdsense = () => {
  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onError={(e) => {
          console.error('Erro ao carregar script do AdSense:', e);
        }}
      />
    </>
  );
};

export default GoogleAdsense;
