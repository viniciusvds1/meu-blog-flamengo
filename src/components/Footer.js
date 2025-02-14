import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-xl mb-4 text-white">Blog do Flamengo</h3>
            <p className="text-gray-100">Seu portal de notícias rubro-negras</p>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-xl mb-4 text-white">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre-nos" className="text-gray-100 hover:text-red-500 transition-colors font-medium">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-gray-100 hover:text-red-500 transition-colors font-medium">
                  Termos e Condições
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="text-gray-100 hover:text-red-500 transition-colors font-medium">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-center md:text-right">
            <h3 className="font-bold text-xl mb-4 text-white">Contato</h3>
            <p className="text-gray-100">orubronegronews@gmail.com</p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-100">&copy; {new Date().getFullYear()} Blog do Flamengo. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}