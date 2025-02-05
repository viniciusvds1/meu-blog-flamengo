'use client';

import { useEffect } from 'react';

const FacebookComments = ({ url }) => {
  useEffect(() => {
    // Load Facebook SDK
    if (window.FB) {
      window.FB.XFBML.parse();
    } else {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v18.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
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
      />
    </div>
  );
};

export default FacebookComments;