import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone, Heart, ExternalLink } from 'lucide-react';

/**
 * Componente do rodapé do site.
 *
 * @description Este componente renderiza o rodapé do site, contendo informações de contato, links úteis e direitos autorais.
 * @returns {JSX.Element} - Elemento JSX do rodapé.
 */
export default function Footer() {
  return (
    <footer
      className="bg-black text-white py-8"
      aria-label="Rodapé do site"
      role="contentinfo"
    >
      {/* Structured Data for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Blog do Flamengo",
            "url": "https://www.orubronegronews.com",
            "logo": "https://www.orubronegronews.com/assets/logooficialrubronews.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "orubronegronews@gmail.com",
              "contactType": "customer service"
            },
            "sameAs": [
              "https://www.facebook.com/orubronegronews",
              "https://www.instagram.com/orubronegronews",
              "https://www.youtube.com/orubronegronews"
            ]
          })
        }}
      />
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          <div className="text-center md:text-left">
            <h3
              className="font-bold text-xl mb-4 text-white"
              id="blog-title"
              aria-label="Título do blog"
            >
              Blog do Flamengo
            </h3>
            <p className="text-gray-100">Seu portal oficial de notícias rubro-negras</p>
            <div className="mt-4 flex justify-center md:justify-start">
              <Image
                src="/assets/logooficialrubronews.png"
                alt="Logo Blog do Flamengo"
                width={80}
                height={80}
                className="opacity-80"
              />
            </div>
          </div>
          <div className="text-center">
            <h3
              className="font-bold text-xl mb-4 text-white"
              id="useful-links"
              aria-label="Links úteis"
            >
              Links Úteis
            </h3>
            <ul
              className="space-y-2"
              aria-labelledby="useful-links"
              role="list"
            >
              <li role="listitem">
                <Link
                  href="/sobre-nos"
                  className="text-gray-100 hover:text-red-500 transition-colors font-medium"
                  aria-label="Sobre Nós"
                >
                  Sobre Nós
                </Link>
              </li>
              <li role="listitem">
                <Link
                  href="/termos"
                  className="text-gray-100 hover:text-red-500 transition-colors font-medium"
                  aria-label="Termos e Condições"
                >
                  Termos e Condições
                </Link>
              </li>
              <li role="listitem">
                <Link
                  href="/politica-de-privacidade"
                  className="text-gray-100 hover:text-red-500 transition-colors font-medium"
                  aria-label="Política de Privacidade"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li role="listitem">
                <Link
                  href="/sitemap.xml"
                  className="text-gray-100 hover:text-red-500 transition-colors font-medium focus:outline-none focus:text-red-500"
                  aria-label="Mapa do Site"
                >
                  Mapa do Site
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-center md:text-right">
            <h3
              className="font-bold text-xl mb-4 text-white"
              id="contact"
              aria-label="Contato"
            >
              Contato
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-end">
                <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                <a 
                  href="mailto:orubronegronews@gmail.com"
                  className="text-gray-100 hover:text-red-500 transition-colors focus:outline-none focus:text-red-500"
                  aria-label="Enviar email para orubronegronews@gmail.com"
                >
                  orubronegronews@gmail.com
                </a>
              </div>
            </div>
          </div>
          <div className="text-center ">
            <h3 className="font-bold text-xl mb-4 text-white" id="social-media">Redes Sociais</h3>
            <ul className="flex md:flex-col flex-row justify-center space-x-4 md:space-x-0 md:space-y-2" aria-labelledby="social-media">
              <li>
                <Link 
                  href="https://www.facebook.com/orubronegronews" 
                  className="text-gray-100 hover:text-red-500 transition-colors font-medium flex items-center justify-center md:justify-start focus:outline-none focus:text-red-500" 
                  aria-label="Seguir no Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>Facebook</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="https://www.instagram.com/orubronegronews" 
                  className="text-gray-100 hover:text-red-500 transition-colors font-medium flex items-center justify-center md:justify-start focus:outline-none focus:text-red-500" 
                  aria-label="Seguir no Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>Instagram</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="https://www.youtube.com/orubronegronews" 
                  className="text-gray-100 hover:text-red-500 transition-colors font-medium flex items-center justify-center md:justify-start focus:outline-none focus:text-red-500" 
                  aria-label="Inscrever-se no YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>YouTube</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p
                className="text-gray-100 text-sm"
                id="copyright"
                aria-label="Direitos autorais"
              >
                &copy; {new Date().getFullYear()} Blog do Flamengo. Todos os direitos reservados.
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Desenvolvido com <Heart className="w-3 h-3 inline text-red-500" aria-hidden="true" /> para a Nação Rubro-Negra
              </p>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>Versão 2.0</span>
              <span>•</span>
              <span>Última atualização: {new Date().toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>
        
        {/* Additional SEO and Performance Info */}
        <div className="mt-4 pt-4 border-t border-gray-900 text-center">
          <p
            className="text-gray-500 text-xs"
            aria-label="Informações adicionais"
          >
            Portal não oficial dedicado aos torcedores do Clube de Regatas do Flamengo. 
            Todas as marcas e logotipos são propriedade de seus respectivos donos.
          </p>
        </div>
      </div>
    </footer>
  );
}