import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Calendar, Eye, ArrowRight, TrendingUp, Clock } from 'lucide-react';
import PostCard from '../components/PostCard';
import CategorySection from '../components/CategorySection';
import HeroSection from '../components/HeroSection';
import { api } from '../services/api';

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_posts: 0, total_views: 0 });

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        
        // Load all data in parallel for better performance
        const [postsResponse, popularResponse, statsResponse] = await Promise.all([
          api.get('/posts?limit=6'),
          api.get('/posts/popular?limit=5'),
          api.get('/stats')
        ]);

        const allPosts = postsResponse.data;
        setFeaturedPosts(allPosts.slice(0, 3));
        setRecentPosts(allPosts.slice(3, 6));
        setPopularPosts(popularResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="pt-16">
          {/* Hero skeleton */}
          <div className="bg-red-600 h-96 flex items-center justify-center">
            <div className="animate-pulse text-white text-center">
              <div className="w-32 h-8 bg-red-500 rounded mx-auto mb-4"></div>
              <div className="w-64 h-4 bg-red-500 rounded mx-auto"></div>
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="w-3/4 h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Blog do Flamengo - Mengão de Coração | Notícias, História e Paixão</title>
        <meta name="description" content="O maior blog do Flamengo! Notícias atualizadas, história do clube, jogadores e tudo sobre o Clube de Regatas do Flamengo. Mengão de Coração!" />
        <meta name="keywords" content="flamengo, mengão, notícias, futebol, brasileiro, história, jogadores, maracanã" />
        <meta property="og:title" content="Blog do Flamengo - Mengão de Coração" />
        <meta property="og:description" content="O maior blog do Flamengo! Notícias atualizadas, história do clube, jogadores e tudo sobre o Clube de Regatas do Flamengo." />
        <link rel="canonical" href="https://rubro-negro-blog.preview.emergentagent.com" />
      </Helmet>

      {/* Hero Section */}
      <HeroSection featuredPost={featuredPosts[0]} stats={stats} />

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="w-8 h-8 text-red-600 mr-3" />
                Destaques
              </h2>
              <Link 
                to="/category/noticias" 
                className="text-red-600 hover:text-red-700 font-medium flex items-center group"
              >
                Ver todas as notícias
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  featured={index === 0}
                  className="card-hover"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts and Popular Posts */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Recent Posts */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Clock className="w-6 h-6 text-red-600 mr-2" />
                  Artigos Recentes
                </h2>
              </div>
              
              <div className="space-y-8">
                {recentPosts.map(post => (
                  <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
                    <div className="md:flex">
                      {post.image_url && (
                        <div className="md:w-1/3">
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-48 md:h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className={`p-6 ${post.image_url ? 'md:w-2/3' : 'w-full'}`}>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium mr-3">
                            {post.category}
                          </span>
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(post.created_at).toLocaleDateString('pt-BR')}
                          <Eye className="w-4 h-4 ml-4 mr-1" />
                          {post.views} visualizações
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-red-600 transition-colors">
                          <Link to={`/post/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <Link
                          to={`/post/${post.slug}`}
                          className="text-red-600 hover:text-red-700 font-medium flex items-center group"
                        >
                          Ler mais
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Popular Posts */}
              {popularPosts.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="w-5 h-5 text-red-600 mr-2" />
                    Mais Lidos
                  </h3>
                  
                  <div className="space-y-4">
                    {popularPosts.map((post, index) => (
                      <article key={post.id} className="flex items-start space-x-3 group">
                        <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                            <Link to={`/post/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h4>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Eye className="w-3 h-3 mr-1" />
                            {post.views} visualizações
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              <CategorySection />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;