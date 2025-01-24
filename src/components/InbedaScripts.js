// components/InbedaScripts.js
'use client';
import Script from 'next/script';
import { useEffect } from 'react';

const InbendaScripts = () => {
  useEffect(() => {
    // Load Facebook SDK
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v12.0&appId=1277752713485967";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);
  return (
    <>
    <Script async defer crossorigin="anonymous" src="https://connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v22.0&appId=1277752713485967"></Script>
      <Script
        id="iubenda-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var _iub = _iub || [];
            _iub.csConfiguration = {
              "siteId": 3887130,
              "cookiePolicyId": 16891695,
              "lang": "pt-BR",
              "storage": { "useSiteId": true }
            };
          `,
        }}
      />
      <Script
        src="https://cs.iubenda.com/autoblocking/3887130.js"
        strategy="afterInteractive"
        id="iubenda-cs"
      />
      <Script
        src="//cdn.iubenda.com/cs/gpp/stub.js"
        strategy="lazyOnload"
        id="iubenda-stub"
      />
      <Script
        src="//cdn.iubenda.com/cs/iubenda_cs.js"
        strategy="lazyOnload"
        id="iubenda-main"
        async
      />
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TKDPTXNH');
          `,
        }}
      />
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-TKDPTXNH"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
};

export default InbendaScripts;