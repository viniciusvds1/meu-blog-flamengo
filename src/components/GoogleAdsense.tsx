'use client';

import Script from "next/script";
import React, { useEffect } from "react";

type Props = {
  pId: string;
};

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function GoogleAdsense({ pId }: Props) {
  useEffect(() => {
    try {
      const adsbygoogle = window.adsbygoogle || [];
      adsbygoogle.push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={`ca-pub-${pId}`}
        data-ad-slot="AUTO"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </>
  );
}
