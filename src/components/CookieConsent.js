"use client";

import CookieConsent from 'react-cookie-consent';

const CookieConsentBanner = ({ message = "Este site utiliza cookies para melhorar a experiência do usuário.", buttonText = "Aceitar" }) => (
  <CookieConsent
    location="bottom"
    buttonText={buttonText}
    cookieName="myAwesomeCookieName2"
    style={{ background: "#000000", color: "#FF0000", position: "fixed" }}
    buttonStyle={{ background: "#FF0000", color: "#FFFFFF", fontSize: "13px" }}
    expires={150}
  >
    {message}
  </CookieConsent>
);

export default CookieConsentBanner;
