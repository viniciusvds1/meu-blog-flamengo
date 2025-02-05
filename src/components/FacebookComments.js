'use client';

import { useEffect } from 'react';

const FacebookComments = ({ url }) => {
  useEffect(() => {
    // Initialize Facebook SDK
    if (typeof window !== 'undefined') {
      window.fbAsyncInit = function() {
        FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
          xfbml: true,
          version: 'v18.0'
        });
      };

      // Load Facebook SDK
      if (!document.getElementById('facebook-jssdk')) {
        const script = document.createElement('script');
        script.id = 'facebook-jssdk';
        script.src = 'https://connect.facebook.net/pt_BR/sdk.js';
        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';
        document.body.appendChild(script);

        script.onload = () => {
          if (window.FB) {
            window.FB.XFBML.parse();
          }
        };
      } else if (window.FB) {
        window.FB.XFBML.parse();
      }
    }
  }, [url]);

  return (
    <div className="fb-comments-container card bg-base-100 shadow-xl p-8 mt-8">
      <h3 className="text-xl font-semibold mb-4">Comentários</h3>
      <div
        className="fb-comments"
        data-href={url}
        data-width="100%"
        data-numposts="5"
        data-order-by="reverse_time"
        data-colorscheme="light"
        data-mobile="true"
      />
    </div>
  );
};

export default FacebookComments;