import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function Termos() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-600 hover:text-red-600 mb-8 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          <span>Voltar para a página inicial</span>
        </Link>

        <article className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <h1 className="text-4xl font-bold text-red-600 mb-6 leading-tight">
              Termos e Condições
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Bem-vindo ao Blog do Flamengo. Este documento estabelece os termos e condições para o uso do nosso site e serviços relacionados, incluindo a exibição de anúncios através do Google AdSense.
              </p>

              <h2 className="text-3xl font-semibold text-gray-800 my-6 leading-tight">
                1. Uso do Site e Conteúdo
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Todo o conteúdo publicado no Blog do Flamengo está protegido por direitos autorais. A reprodução de material deste site é permitida apenas com autorização prévia e citação da fonte. Nos reservamos o direito de modificar ou remover qualquer conteúdo sem aviso prévio.
              </p>

              <h2 className="text-3xl font-semibold text-gray-800 my-6 leading-tight">
                2. Política de Anúncios
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Utilizamos o Google AdSense para exibir anúncios em nosso site. Ao utilizar nosso site, você concorda que:
              </p>
              <ul className="list-disc pl-6 mb-6 text-lg text-gray-700">
                <li className="mb-2">O Google e seus parceiros podem coletar e usar dados para personalizar anúncios</li>
                <li className="mb-2">Cookies podem ser utilizados para exibição de anúncios relevantes</li>
                <li className="mb-2">Não nos responsabilizamos pelo conteúdo dos anúncios exibidos</li>
                <li className="mb-2">É proibido clicar nos anúncios de forma fraudulenta ou usar ferramentas automatizadas</li>
              </ul>

              <h2 className="text-3xl font-semibold text-gray-800 my-6 leading-tight">
                3. Privacidade e Cookies
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência e permitir o funcionamento dos serviços de publicidade. Ao utilizar nosso site, você concorda com o uso de cookies conforme descrito em nossa Política de Privacidade.
              </p>

              <h2 className="text-3xl font-semibold text-gray-800 my-6 leading-tight">
                4. Conteúdo Proibido
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Não é permitido em nosso site:
              </p>
              <ul className="list-disc pl-6 mb-6 text-lg text-gray-700">
                <li className="mb-2">Conteúdo adulto ou pornográfico</li>
                <li className="mb-2">Incitação à violência ou discriminação</li>
                <li className="mb-2">Conteúdo que viole direitos autorais</li>
                <li className="mb-2">Spam ou conteúdo malicioso</li>
                <li className="mb-2">Venda de produtos ilegais ou restritos</li>
              </ul>

              <h2 className="text-3xl font-semibold text-gray-800 my-6 leading-tight">
                5. Responsabilidade do Usuário
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Ao utilizar nosso site, você concorda em:
              </p>
              <ul className="list-disc pl-6 mb-6 text-lg text-gray-700">
                <li className="mb-2">Não interferir com a exibição de anúncios</li>
                <li className="mb-2">Não utilizar bloqueadores de anúncios</li>
                <li className="mb-2">Não gerar tráfego artificial ou fraudulento</li>
                <li className="mb-2">Respeitar os direitos de propriedade intelectual</li>
              </ul>

              <h2 className="text-3xl font-semibold text-gray-800 my-6 leading-tight">
                6. Modificações nos Termos
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após sua publicação. O uso continuado do site após as alterações implica na aceitação dos novos termos.
              </p>

              <h2 className="text-3xl font-semibold text-gray-800 my-6 leading-tight">
                7. Contato
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Para questões relacionadas a estes termos ou ao uso de anúncios em nosso site, entre em contato conosco através dos canais disponíveis em nossa página de contato.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export function generateMetadata() {
  return {
    title: 'Termos e Condições | Blog do Flamengo',
    description: 'Termos e condições de uso do Blog do Flamengo, incluindo políticas de privacidade e publicidade.',
  };
}