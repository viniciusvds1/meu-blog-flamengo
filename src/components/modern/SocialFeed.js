'use client';

import { useState } from 'react';
import { MessageCircle, Heart, Share, ExternalLink, Instagram, Youtube, Twitter } from 'lucide-react';

const SocialFeed = () => {
  const [activeTab, setActiveTab] = useState('instagram');

  const socialPosts = {
    instagram: [
      {
        id: 1,
        platform: 'Instagram',
        author: '@flamengo',
        content: 'Treino finalizado no CT! Foco total na próxima partida 🔥',
        image: '/assets/bannerubro.png',
        likes: 45200,
        comments: 892,
        time: '2h'
      },
      {
        id: 2,
        platform: 'Instagram', 
        author: '@flamengo',
        content: 'O Maracanã está pronto para mais uma noite de glória rubro-negra! ⚫🔴',
        image: '/assets/bannerubro.png',
        likes: 67800,
        comments: 1205,
        time: '5h'
      }
    ],
    twitter: [
      {
        id: 3,
        platform: 'Twitter',
        author: '@flamengo',
        content: 'OFICIAL: Flamengo convoca torcida para apoiar o time na decisão! #VamosFlamengo',
        likes: 12300,
        comments: 456,
        shares: 2100,
        time: '1h'
      },
      {
        id: 4,
        platform: 'Twitter',
        author: '@flamengo', 
        content: 'Retrospectiva da semana: treinos intensos, foco total e muito Mengão! 🏆',
        likes: 8900,
        comments: 234,
        shares: 890,
        time: '4h'
      }
    ],
    youtube: [
      {
        id: 5,
        platform: 'YouTube',
        author: 'Flamengo',
        content: 'BASTIDORES: Treino tático antes do clássico',
        thumbnail: '/assets/bannerubro.png',
        views: '125K visualizações',
        time: '1 dia'
      },
      {
        id: 6,
        platform: 'YouTube',
        author: 'Flamengo',
        content: 'Melhores momentos: Flamengo 3x1 Adversário',
        thumbnail: '/assets/bannerubro.png', 
        views: '287K visualizações',
        time: '3 dias'
      }
    ]
  };

  const tabs = [
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { id: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-500' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-500' }
  ];

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-1 h-8 bg-red-600 rounded-full" />
            Redes Sociais
          </div>
          <a 
            href="https://linktr.ee/flamengo" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-2"
          >
            Ver todos
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <IconComponent size={16} className={tab.color} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-6">
          {socialPosts[activeTab]?.map((post) => (
            <div key={post.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{post.author}</div>
                  <div className="text-sm text-gray-500">{post.time}</div>
                </div>
                
                {/* Platform Icon */}
                <div className={tabs.find(tab => tab.id === activeTab)?.color}>
                  {tabs.find(tab => tab.id === activeTab)?.icon && 
                    (() => {
                      const IconComponent = tabs.find(tab => tab.id === activeTab).icon;
                      return <IconComponent size={20} />;
                    })()
                  }
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-700 mb-3 leading-relaxed">{post.content}</p>

              {/* Post Image/Thumbnail */}
              {(post.image || post.thumbnail) && (
                <div className="mb-3 rounded-lg overflow-hidden">
                  <img 
                    src={post.image || post.thumbnail} 
                    alt="Post content"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Post Stats */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {post.likes && (
                    <div className="flex items-center gap-1">
                      <Heart size={16} />
                      <span>{formatNumber(post.likes)}</span>
                    </div>
                  )}
                  {post.comments && (
                    <div className="flex items-center gap-1">
                      <MessageCircle size={16} />
                      <span>{formatNumber(post.comments)}</span>
                    </div>
                  )}
                  {post.shares && (
                    <div className="flex items-center gap-1">
                      <Share size={16} />
                      <span>{formatNumber(post.shares)}</span>
                    </div>
                  )}
                  {post.views && (
                    <div className="text-sm text-gray-600">
                      {post.views}
                    </div>
                  )}
                </div>
                
                <button className="text-gray-400 hover:text-red-600 transition-colors">
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Follow CTA */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-2">Siga o Flamengo</h3>
            <p className="text-gray-600 mb-4">
              Acompanhe todas as novidades nas redes sociais oficiais
            </p>
            
            <div className="flex justify-center gap-4">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <a
                    key={tab.id}
                    href="#"
                    className={`p-3 bg-white rounded-full hover:scale-110 transition-transform shadow-md ${tab.color}`}
                  >
                    <IconComponent size={24} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;