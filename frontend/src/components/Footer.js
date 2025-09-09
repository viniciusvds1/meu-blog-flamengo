import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Twitter, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, url: '#', color: 'hover:text-blue-400' },
    { name: 'Facebook', icon: Facebook, url: '#', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: Instagram, url: '#', color: 'hover:text-pink-500' },
    { name: 'YouTube', icon: Youtube, url: '#', color: 'hover:text-red-500' },
  ];

  const footerLinks = [
    {
      title: 'Blog',
      links: [
        { name: 'Início', path: '/' },
        { name: 'Notícias', path: '/category/noticias' },
        { name: 'História', path: '/category/historia' },
        { name: 'Jogadores', path: '/category/jogadores' },
      ]
    },
    {
      title: 'Clube',
      links: [
        { name: 'Site Oficial', path: '#' },
        { name: 'Loja Oficial', path: '#' },
        { name: 'Maracanã', path: '/category/maracana' },
        { name: 'Taças', path: '/category/tacas' },
      ]
    }
  ];

  return (
    <footer className="bg-black text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">Blog do Flamengo</h3>
                <p className="text-gray-400 text-sm">Mengão de Coração</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md">
              O maior blog do Flamengo! Acompanhe as últimas notícias, história, 
              jogadores e tudo sobre o Clube de Regatas do Flamengo.
            </p>

            {/* Social media links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    className={`text-gray-400 ${social.color} transition-colors duration-200`}
                    aria-label={social.name}
                  >
                    <IconComponent size={24} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>© {currentYear} Blog do Flamengo. Feito com</span>
              <Heart size={16} className="text-red-500" />
              <span>para a Nação Rubro-Negra</span>
            </div>
            
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link 
                to="#" 
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                Privacidade
              </Link>
              <Link 
                to="#" 
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                Termos
              </Link>
              <Link 
                to="#" 
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
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