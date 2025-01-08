'use client'

import Script from 'next/script'
import { useState } from 'react'

export default function AdSenseIntegration() {
  const [adLoaded, setAdLoaded] = useState(false)

  return (
    <div className="container mx-auto p-4">
      {/* Google AdSense Script */}
      <Script 
        id="google-adsense"
        async 
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2748482520534761"
        onLoad={() => setAdLoaded(true)}
        onError={(e) => {
          console.error('AdSense script failed to load', e)
          setAdLoaded(false)
        }}
      />

      {/* Example Ad Unit */}
      {adLoaded && (
        <div className="my-4">
          <ins 
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-2748482520534761"
            data-ad-slot="2749349669"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          <Script 
            id="adsbygoogle" 
            strategy="afterInteractive"
          >
            {`(adsbygoogle = window.adsbygoogle || []).push({});`}
          </Script>
        </div>
      )}

      {/* Fallback content if ads don't load */}
      {!adLoaded && (
        <div className="text-gray-500 p-4 border rounded">
          Advertisements loading...
        </div>
      )}
    </div>
  )
}