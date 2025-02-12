"use client";

import CookieConsent from 'react-cookie-consent';

const CookieConsentBanner = () => (
  <CookieConsent
    location="bottom"
    buttonText="Aceitar"
    cookieName="myAwesomeCookieName2"
    style={{ background: "#000000", color: "#FF0000", position: "fixed" }}
    buttonStyle={{ background: "#FF0000", color: "#FFFFFF", fontSize: "13px" }}
    expires={150}
  >
    Este site utiliza cookies para melhorar a experiência do usuário.
  </CookieConsent>
);

export default CookieConsentBanner;
