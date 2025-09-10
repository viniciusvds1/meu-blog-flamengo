'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  Trophy, 
  ArrowRight,
  Clock,
  Star,
  MessageCircle
} from 'lucide-react';

const Sidebar = () => {
  const [popularPosts, setPopularPosts] = useState([
    {
      id: 1,
      title: 'Flamengo vence clássico no Maracanã',
      views: 12500,
      readTime: '3 min',
      category: 'Jogos'
    },
    {
      id: 2, 
      title: 'Nova contratação chega ao Ninho',
      views: 8200,
      readTime: '2 min',
      category: 'Transferências'
    },
    {
      id: 3,
      title: 'Treino tático marca a semana',
      views: 5800,
      readTime: '4 min',
      category: 'Bastidores'
    }
  ]);

  const [nextGame, setNextGame] = useState({
    opponent: 'Vasco da Gama',
    date: '2025-01-15',
    time: '16:00',
    venue: 'Maracanã',
    championship: 'Carioca'
  });

  const quickLinks = [
    { icon: Trophy, label: 'Títulos', href: '/titulos', count: '45+' },
    { icon: Users, label: 'Elenco', href: '/elenco', count: '30' },
    { icon: Calendar, label: 'Calendário', href: '/calendario', count: '12' },
    { icon: Star, label: 'História', href: '/historia', count: '130 anos' }
  ];

  return (
    <div className="space-y-6">
      {/* Next Game Widget */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-red-200" size={20} />
          <span className="font-semibold">Próximo Jogo</span>
        </div>
        
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-2xl font-bold">{nextGame.opponent}</div>
            <div className="text-red-200 text-sm">{nextGame.championship}</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
            <div className="text-lg font-semibold">
              {new Date(nextGame.date).toLocaleDateString('pt-BR', { 
                day: 'numeric', 
                month: 'short' 
              })}
            </div>
            <div className="text-red-200 text-sm">{nextGame.time} - {nextGame.venue}</div>
          </div>
        </div>
      </div>

      {/* Popular Posts */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-red-600" size={20} />
          <span className="font-bold text-gray-900">Mais Lidas</span>
        </div>
        
        <div className="space-y-4">
          {popularPosts.map((post, index) => (
            <div key={post.id} className="group flex items-start gap-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
              <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-red-600 transition-colors">
                  <Link href={`/noticias/${post.id}`}>
                    {post.title}
                  </Link>
                </h4>
                
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded-full">{post.category}</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={12} />
                    {post.views.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Link 
          href="/populares" 
          className="flex items-center justify-center gap-2 mt-4 text-red-600 font-semibold text-sm hover:gap-3 transition-all duration-300"
        >
          Ver mais populares
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-bold text-gray-900 mb-4">Acesso Rápido</h3>
        
        <div className="space-y-3">
          {quickLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={index}
                href={link.href}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-red-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                    <IconComponent className="text-red-600" size={16} />
                  </div>
                  <span className="font-medium text-gray-700">{link.label}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 font-semibold">{link.count}</span>
                  <ArrowRight 
                    size={16} 
                    className="text-gray-400 group-hover:translate-x-1 transition-transform duration-300" 
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-6 shadow-lg">
        <div className="text-center space-y-4">
          <div className="text-2xl">📧</div>
          <div>
            <h3 className="font-bold text-lg mb-2">Newsletter Rubro-Negra</h3>
            <p className="text-gray-300 text-sm">
              Receba as últimas notícias do Mengão direto no seu email
            </p>
          </div>
          
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Seu melhor email"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Assinar Grátis
            </button>
          </div>
          
          <p className="text-xs text-gray-400">
            Sem spam. Cancele quando quiser.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;