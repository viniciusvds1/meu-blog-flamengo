import CookieConsent from 'react-cookie-consent';

/**
 * Componente de banner de consentimento de cookies.
 *
 * @param {string} message - Mensagem a ser exibida no banner.
 * @param {string} buttonText - Texto do botão de consentimento.
 * @returns {JSX.Element} - Elemento JSX do componente de consentimento de cookies.
 */
const CookieConsentBanner = ({ message = "Este site utiliza cookies para melhorar a experiência do usuário.", buttonText = "Aceitar" }) => {
  // Verificar se a mensagem e o texto do botão estão definidos
  if (!message || !buttonText) {
    console.error('A mensagem e o texto do botão são obrigatórios.');
    return null; // Retorna null se as props não estiverem definidas
  }

  try {
    return (
      <CookieConsent
        location="bottom"
        buttonText={buttonText}
        cookieName="myAwesomeCookieName2"
        style={{ background: "#000000", color: "#FF0000", position: "fixed" }}
        buttonStyle={{ background: "#FF0000", color: "#FFFFFF", fontSize: "13px" }}
        expires={150}
        aria-label="Consentimento de cookies"
      >
        {message}
      </CookieConsent>
    );
  } catch (error) {
    console.error('Erro ao renderizar o banner de consentimento de cookies:', error);
    return null; // Retorna null se ocorrer um erro
  }
};

export default CookieConsentBanner;
