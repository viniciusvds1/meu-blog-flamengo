"use client";

import { useEffect } from 'react';

const AdSenseComponent = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-2748482520534761"
      data-ad-slot="2749349669"
      data-ad-format="auto"
    ></ins>
  );
};

export default AdSenseComponent;
