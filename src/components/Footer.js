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
            <p className="text-gray-100">Seu portal de notícias rubro-negras</p>
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
            <p className="text-gray-100">orubronegronews@gmail.com</p>
          </div>
          <div className="text-center ">
            <h3 className="font-bold text-xl mb-4 text-white">Redes Sociais</h3>
            <ul className="flex md:flex-col flex-row justify-center space-x-4 md:space-x-0 ">
              <li>
                <Link href="https://www.facebook.com/orubronegronews" className="text-gray-100 hover:text-red-500 transition-colors font-medium" aria-label="Facebook">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="https://www.instagram.com/orubronegronews" className="text-gray-100 hover:text-red-500 transition-colors font-medium" aria-label="Instagram">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="https://www.youtube.com/orubronegronews" className="text-gray-100 hover:text-red-500 transition-colors font-medium" aria-label="YouTube">
                  YouTube
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center">
          <p
            className="text-gray-100"
            id="copyright"
            aria-label="Direitos autorais"
          >
            &copy; {new Date().getFullYear()} Blog do Flamengo. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}