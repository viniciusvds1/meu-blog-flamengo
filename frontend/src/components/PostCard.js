import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ArrowRight, Clock } from 'lucide-react';

const PostCard = ({ post, featured = false, className = '' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const CardContent = () => (
    <>
      {/* Image */}
      {post.image_url && !imageError && (
        <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            </div>
          )}
          <img
            src={post.image_url}
            alt={post.title}
            className={`w-full h-full object-cover transition-all duration-300 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } group-hover:scale-110`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Meta information */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-2">
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
              {post.category}
            </span>
            {post.tags && post.tags[0] && (
              <span className="text-gray-400">•</span>
            )}
            {post.tags && post.tags[0] && (
              <span className="text-xs text-gray-500">#{post.tags[0]}</span>
            )}
          </div>
          {post.views > 0 && (
            <div className="flex items-center text-xs text-gray-400">
              <Eye className="w-3 h-3 mr-1" />
              {post.views}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-200 ${
          featured ? 'text-xl' : 'text-lg'
        }`}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            <time dateTime={post.created_at}>
              {formatDate(post.created_at)}
            </time>
          </div>
          
          <div className="flex items-center text-red-600 text-sm font-medium group-hover:text-red-700 transition-colors">
            <span className="mr-1">Ler mais</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <article className={`bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 ${className}`}>
      <Link to={`/post/${post.slug}`} className="block h-full">
        <CardContent />
      </Link>
    </article>
  );
};

export default PostCard;