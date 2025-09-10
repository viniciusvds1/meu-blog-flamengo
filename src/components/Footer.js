import Link from 'next/link';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter,
  Mail, 
  MapPin, 
  Phone, 
  Heart,
  ExternalLink,
  Trophy,
  Calendar,
  Users
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Navegação',
      links: [
        { label: 'Início', href: '/' },
        { label: 'Notícias', href: '/noticias' },
        { label: 'Jogos', href: '/jogos' },
        { label: 'Elenco', href: '/elenco' },
        { label: 'História', href: '/historia' }
      ]
    },
    {
      title: 'Conteúdo',
      links: [
        { label: 'Últimas Notícias', href: '/noticias' },
        { label: 'Análises', href: '/analises' },
        { label: 'Entrevistas', href: '/entrevistas' },
        { label: 'Bastidores', href: '/bastidores' }
      ]
    },
    {
      title: 'Flamengo',
      links: [
        { label: 'Site Oficial', href: 'https://flamengo.com.br', external: true },
        { label: 'Loja Oficial', href: 'https://loja.flamengo.com.br', external: true },
        { label: 'Ingressos', href: 'https://ingressos.flamengo.com.br', external: true },
        { label: 'Sócio-Torcedor', href: 'https://socio.flamengo.com.br', external: true }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/FlamengoOficial', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Instagram, href: 'https://instagram.com/flamengo', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: Youtube, href: 'https://youtube.com/flamengo', label: 'YouTube', color: 'hover:text-red-600' },
    { icon: Twitter, href: 'https://twitter.com/flamengo', label: 'Twitter', color: 'hover:text-blue-400' }
  ];

  const quickStats = [
    { icon: Trophy, value: '45+', label: 'Títulos' },
    { icon: Calendar, value: '130', label: 'Anos' },
    { icon: Users, value: '42M', label: 'Torcedores' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Blog do Flamengo</h3>
                <p className="text-gray-400 text-sm">Mengão de Coração</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed">
              O maior blog independente do Flamengo. Notícias, análises, história e tudo sobre o Clube de Regatas do Flamengo.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {quickStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex flex-col items-center space-y-1">
                      <IconComponent className="text-red-500" size={20} />
                      <div className="text-lg font-bold">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-gray-800 rounded-full transition-all duration-300 ${social.color} hover:scale-110 hover:bg-gray-700`}
                    aria-label={social.label}
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-lg font-semibold text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center space-x-1 group"
                      >
                        <span>{link.label}</span>
                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-red-400 transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Fique por dentro!</h3>
              <p className="text-red-100">
                Receba as principais notícias do Mengão direto no seu email
              </p>
            </div>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Seu email aqui"
                className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-red-100 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Assinar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <span>© {currentYear} Blog do Flamengo.</span>
              <span>Feito com</span>
              <Heart size={16} className="text-red-500" />
              <span>para a Nação Rubro-Negra</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/termos" className="text-gray-400 hover:text-white transition-colors">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="text-gray-400 hover:text-white transition-colors">
                Privacidade
              </Link>
              <Link href="/contato" className="text-gray-400 hover:text-white transition-colors">
                Contato
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;