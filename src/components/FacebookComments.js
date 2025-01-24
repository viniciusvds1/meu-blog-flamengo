'use client';
import { useEffect, useState } from 'react';

const FacebookComments = () => {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
    if (!document.getElementById('facebook-jssdk')) {
      let script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v17.0&appId=1277752713485967&autoLogAppEvents=1';
      document.body.appendChild(script);

      script.onload = () => {
        if (window.FB) {
          window.FB.init({
            appId: '1277752713485967',
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v17.0',
          });
          window.FB.XFBML.parse();
        }
      };
    } else {
      if (window.FB) {
        window.FB.XFBML.parse();
      }
    }
  }, []);

  return (
    <div className="fb-comments" data-href={currentUrl} data-width="100%" data-numposts="5"></div>

  );
};

export default FacebookComments;
