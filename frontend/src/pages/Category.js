import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { blogApi } from '../services/api';

const Category = () => {
  const { categorySlug } = useParams();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const categoryInfo = {
    'noticias': {
      name: 'Notícias',
      description: 'Últimas notícias e atualizações do Flamengo',
      color: '#FF0000'
    },
    'jogadores': {
      name: 'Jogadores',
      description: 'Tudo sobre os craques do Mengão',
      color: '#000000'
    },
    'historia': {
      name: 'História',
      description: 'A rica história do Clube de Regatas do Flamengo',
      color: '#FF0000'
    },
    'maracana': {
      name: 'Maracanã',
      description: 'Nossa casa, nosso templo sagrado',
      color: '#FF0000'
    },
    'tacas': {
      name: 'Taças',
      description: 'Conquistas e títulos do Flamengo',
      color: '#FFD700'
    }
  };

  useEffect(() => {
    const loadCategoryPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await blogApi.getPosts({
          category: categoryInfo[categorySlug]?.name,
          limit: 12
        });
        
        setPosts(response.data);
        setCategory(categoryInfo[categorySlug]);
        setHasMore(response.data.length === 12);
      } catch (error) {
        console.error('Error loading category posts:', error);
        setError('Erro ao carregar os posts da categoria');
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug && categoryInfo[categorySlug]) {
      loadCategoryPosts();
    } else {
      setError('Categoria não encontrada');
      setLoading(false);
    }
  }, [categorySlug]);

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      
      const response = await blogApi.getPosts({
        category: category?.name,
        skip: posts.length,
        limit: 12
      });
      
      const newPosts = response.data;
      setPosts(prev => [...prev, ...newPosts]);
      setHasMore(newPosts.length === 12);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Categoria não encontrada'}
          </h1>
          <a 
            href="/" 
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Helmet>
        <title>{category.name} | Blog do Flamengo</title>
        <meta name="description" content={category.description} />
        <meta name="keywords" content={`flamengo, ${category.name.toLowerCase()}, mengão`} />
        <meta property="og:title" content={`${category.name} | Blog do Flamengo`} />
        <meta property="og:description" content={category.description} />
        <link rel="canonical" href={`https://rubro-negro-blog.preview.emergentagent.com/category/${categorySlug}`} />
      </Helmet>

      {/* Category Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <span 
                className="text-2xl font-bold"
                style={{ color: category.color }}
              >
                {category.name.charAt(0)}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {category.name}
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {category.description}
            </p>
            
            <div className="mt-4 text-sm text-gray-500">
              {posts.length} {posts.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post}
                  className="card-hover"
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMorePosts}
                  disabled={loadingMore}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Carregando...
                    </div>
                  ) : (
                    'Carregar mais artigos'
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h14l-2 14.5a2 2 0 01-2 1.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Nenhum artigo encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Ainda não há conteúdo disponível nesta categoria.
            </p>
            <a 
              href="/" 
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Ver todos os artigos
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;