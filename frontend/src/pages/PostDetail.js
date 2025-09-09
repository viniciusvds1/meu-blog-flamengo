import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Calendar, Eye, ArrowLeft, Share2, Twitter, Facebook, Clock, User, Tag } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { blogApi } from '../services/api';

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [postResponse, relatedResponse] = await Promise.all([
          blogApi.getPostBySlug(slug),
          blogApi.getPosts({ limit: 3 })
        ]);
        
        setPost(postResponse.data);
        // Filter out current post from related posts
        setRelatedPosts(relatedResponse.data.filter(p => p.slug !== slug).slice(0, 3));
      } catch (error) {
        console.error('Error loading post:', error);
        setError(error.response?.status === 404 ? 'Post não encontrado' : 'Erro ao carregar o post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadPost();
    }
  }, [slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sharePost = (platform) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
          <Link 
            to="/" 
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Helmet>
        <title>{post.title} | Blog do Flamengo</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags?.join(', ')} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        {post.image_url && <meta property="og:image" content={post.image_url} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        {post.image_url && <meta name="twitter:image" content={post.image_url} />}
        <link rel="canonical" href={`https://rubro-negro-blog.preview.emergentagent.com/post/${post.slug}`} />
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao blog
          </Link>
        </div>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
            {post.tags?.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs flex items-center">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4 text-gray-600">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(post.created_at)}
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {post.views} visualizações
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {Math.ceil(post.content.length / 200)} min de leitura
              </div>
            </div>
            
            {/* Share buttons */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 mr-2">Compartilhar:</span>
              <button
                onClick={() => sharePost('twitter')}
                className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Compartilhar no Twitter"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={() => sharePost('facebook')}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Compartilhar no Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={() => sharePost('whatsapp')}
                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                aria-label="Compartilhar no WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Featured image */}
        {post.image_url && (
          <div className="mb-8">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Artigos Relacionados</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map(relatedPost => (
                <article key={relatedPost.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  {relatedPost.image_url && (
                    <img
                      src={relatedPost.image_url}
                      alt={relatedPost.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium mr-3">
                        {relatedPost.category}
                      </span>
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(relatedPost.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                      <Link 
                        to={`/post/${relatedPost.slug}`}
                        className="hover:text-red-600 transition-colors"
                      >
                        {relatedPost.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {relatedPost.excerpt}
                    </p>
                    
                    <Link
                      to={`/post/${relatedPost.slug}`}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Ler mais →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PostDetail;