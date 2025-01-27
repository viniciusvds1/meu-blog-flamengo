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
                Bem-vindo ao Blog do Flamengo. Ao acessar e utilizar este site, você concorda com os seguintes termos e condições:
              </p>

              <h2 className="text-3xl font-semibold text-gray-800 my-6 leading-tight">
                1. Uso do Conteúdo
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Todo o conteúdo publicado no Blog do Flamengo está protegido por direitos autorais. A reprodução de material deste site é permitida apenas com autorização prévia e citação da fonte.
              </p>

              <h2 className="text-3xl font-semibold text-gray-800 my-6 leading-tight">
                2. Comentários e Interações
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Ao comentar em nosso site, você concorda em não publicar conteúdo ofensivo, ilegal ou que viole direitos de terceiros. Reservamo-nos o direito de moderar ou remover comentários inadequados.
              </p>

              <h2 className="text-3xl font-semibold text-gray-800 my-6 leading-tight">
                3. Privacidade
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Respeitamos sua privacidade. Para mais informações sobre como coletamos e utilizamos seus dados, consulte nossa Política de Privacidade.
              </p>

              <h2 className="text-3xl font-semibold text-gray-800 my-6 leading-tight">
                4. Isenção de Responsabilidade
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                As informações contidas neste site são fornecidas sem garantia de qualquer tipo. Não nos responsabilizamos por eventuais erros ou omissões no conteúdo.
              </p>

              <h2 className="text-3xl font-semibold text-gray-800 my-6 leading-tight">
                5. Modificações
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após sua publicação no site.
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
    description: 'Termos e condições de uso do Blog do Flamengo.',
  };
}