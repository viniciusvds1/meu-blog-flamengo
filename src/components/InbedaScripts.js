"use client"
import Script from 'next/script';

const InbendaScripts = () => {
  return (
    <>
      <Script
        id="iubenda-config"
        strategy="beforeInteractive"
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
        strategy="beforeInteractive"
      />
      <Script
        src="//cdn.iubenda.com/cs/gpp/stub.js"
        strategy="lazyOnload"
      />
      <Script
        src="//cdn.iubenda.com/cs/iubenda_cs.js"
        strategy="lazyOnload"
        charset="UTF-8"
        async
      />
    </>
  );
};

export default InbendaScripts;
