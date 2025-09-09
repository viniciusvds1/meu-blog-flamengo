import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Eye, FileText } from 'lucide-react';

const HeroSection = ({ featuredPost, stats }) => {
  return (
    <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-black text-white pt-16">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px] py-20">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <span className="inline-block bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                🔥 Blog Oficial do Mengão
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="block">Blog do</span>
              <span className="block text-yellow-400">Flamengo</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-red-100 mb-8 leading-relaxed">
              Sua fonte oficial para notícias, história e tudo sobre o 
              <strong className="text-white"> Clube de Regatas do Flamengo</strong>
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="w-6 h-6 text-yellow-400 mr-2" />
                  <span className="text-2xl font-bold">{stats.total_posts || 0}</span>
                </div>
                <p className="text-red-100 text-sm">Artigos</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Eye className="w-6 h-6 text-yellow-400 mr-2" />
                  <span className="text-2xl font-bold">{(stats.total_views || 0).toLocaleString()}</span>
                </div>
                <p className="text-red-100 text-sm">Visualizações</p>
              </div>
              
              <div className="text-center col-span-2 md:col-span-1">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-yellow-400 mr-2" />
                  <span className="text-2xl font-bold">+1M</span>
                </div>
                <p className="text-red-100 text-sm">Torcedores</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/category/noticias"
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center group"
              >
                Ver Notícias
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/category/historia"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-all duration-200 flex items-center justify-center"
              >
                Nossa História
              </Link>
            </div>
          </div>

          {/* Right content - Featured Post */}
          {featuredPost && (
            <div className="lg:pl-8">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                <div className="flex items-center text-yellow-400 text-sm font-medium mb-4">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Destaque da Semana
                </div>
                
                {featuredPost.image_url && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                      src={featuredPost.image_url}
                      alt={featuredPost.title}
                      className="w-full h-48 object-cover"
                      loading="eager"
                    />
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-3 line-clamp-2">
                  {featuredPost.title}
                </h3>
                
                <p className="text-red-100 mb-4 line-clamp-3 text-sm">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-red-200 text-xs">
                    <span className="bg-red-500 px-2 py-1 rounded text-white mr-2">
                      {featuredPost.category}
                    </span>
                    <Eye className="w-3 h-3 mr-1" />
                    {featuredPost.views} visualizações
                  </div>
                  
                  <Link
                    to={`/post/${featuredPost.slug}`}
                    className="text-yellow-400 hover:text-yellow-300 font-medium text-sm flex items-center group"
                  >
                    Ler artigo
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 fill-gray-50">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;