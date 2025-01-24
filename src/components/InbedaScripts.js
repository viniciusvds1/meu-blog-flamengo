// components/InbedaScripts.js
'use client';
import Script from 'next/script';

const InbendaScripts = () => {
  
  return (
    <>
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
      <Script async defer crossorigin="anonymous" src="https://connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v22.0&appId=1277752713485967"/>
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
    </>
  );
};

export default InbendaScripts;