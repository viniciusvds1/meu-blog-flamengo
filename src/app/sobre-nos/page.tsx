import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function SobreNos() {
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
              Sobre Nós
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                O Blog do Flamengo é um portal dedicado a trazer as últimas notícias, análises e conteúdo exclusivo sobre o Clube de Regatas do Flamengo. Fundado por torcedores apaixonados, nosso objetivo é manter a Nação Rubro-Negra sempre bem informada.
              </p>

              <h2 className="text-3xl font-semibold text-gray-800 my-6 leading-tight">
                Nossa Missão
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Fornecer cobertura jornalística de qualidade sobre o Flamengo, com compromisso com a verdade e respeito aos nossos leitores. Buscamos ser a fonte mais confiável de informações sobre o clube mais querido do Brasil.
              </p>

              <h2 className="text-3xl font-semibold text-gray-800 my-6 leading-tight">
                Nossa Equipe
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Nossa equipe é formada por colaboradores que vivem e respiram o Flamengo. Todos os dias, trabalhamos para trazer o melhor conteúdo sobre o Mengão.
              </p>

              <h2 className="text-3xl font-semibold text-gray-800 my-6 leading-tight">
                Contato
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Para entrar em contato conosco, envie um e-mail para orubronegronews@gmail.com
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
    title: 'Sobre Nós | Blog do Flamengo',
    description: 'Conheça mais sobre o Blog do Flamengo, sua fonte confiável de notícias sobre o Mengão.',
  };
}