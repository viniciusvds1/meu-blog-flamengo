export const metadata = {
  title: 'Política de Privacidade | Blog do Flamengo',
  description: 'Política de Privacidade do Blog do Flamengo - Saiba como tratamos seus dados',
};

export default function PoliticaPrivacidade() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Informações Gerais</h2>
        <p className="mb-4">
          Esta Política de Privacidade descreve como o Blog do Flamengo coleta, usa e protege as informações pessoais que você fornece em nosso site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Coleta de Dados</h2>
        <p className="mb-4">
          Coletamos informações quando você:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>Visita nosso website</li>
          <li>Se inscreve em nossa newsletter</li>
          <li>Comenta em nossas publicações</li>
          <li>Interage com nossos anúncios</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Uso de Cookies</h2>
        <p className="mb-4">
          Utilizamos cookies para melhorar sua experiência em nosso site. Isso inclui:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>Cookies essenciais para o funcionamento do site</li>
          <li>Cookies analíticos para entender como você usa nosso site</li>
          <li>Cookies de publicidade para mostrar anúncios relevantes</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Google AdSense</h2>
        <p className="mb-4">
          Utilizamos o Google AdSense para exibir anúncios em nosso site. O Google AdSense usa cookies para:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>Exibir anúncios personalizados com base em suas visitas anteriores ao nosso site ou outros sites</li>
          <li>Evitar que você veja os mesmos anúncios repetidamente</li>
          <li>Entender como você interage com os anúncios</li>
        </ul>
        <p className="mb-4">
          Você pode optar por desativar a publicidade personalizada visitando as {' '}
          <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            Configurações de Anúncios do Google
          </a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Seus Direitos</h2>
        <p className="mb-4">
          Você tem o direito de:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>Acessar seus dados pessoais</li>
          <li>Corrigir dados imprecisos</li>
          <li>Solicitar a exclusão de seus dados</li>
          <li>Retirar seu consentimento a qualquer momento</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Contato</h2>
        <p className="mb-4">
          Para questões relacionadas à privacidade, entre em contato através do email: [seu-email@dominio.com]
        </p>
      </section>

      <p className="text-sm text-gray-600">
        Última atualização: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
