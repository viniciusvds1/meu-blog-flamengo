import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Search as SearchIcon, X } from 'lucide-react';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { blogApi } from '../services/api';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery, skip = 0) => {
    if (!searchQuery.trim()) return;

    try {
      if (skip === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await blogApi.searchPosts(searchQuery, {
        skip,
        limit: 12
      });

      const newPosts = response.data;
      
      if (skip === 0) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(newPosts.length === 12);
    } catch (error) {
      console.error('Error searching posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const loadSuggestions = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await blogApi.getSearchSuggestions(searchQuery);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error loading suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length >= 2) {
      loadSuggestions(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    setSearchParams({ q: suggestion.title });
  };

  const clearSearch = () => {
    setQuery('');
    setPosts([]);
    setSearchParams({});
  };

  const loadMorePosts = () => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      performSearch(searchQuery, posts.length);
    }
  };

  const currentQuery = searchParams.get('q');

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Helmet>
        <title>
          {currentQuery ? `Busca: ${currentQuery} | Blog do Flamengo` : 'Buscar | Blog do Flamengo'}
        </title>
        <meta name="description" content="Busque por artigos, notícias e conteúdo sobre o Flamengo" />
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Search Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Buscar no Blog do Flamengo
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Digite sua busca... (ex: títulos, notícias, jogadores)"
                className="w-full px-4 py-3 pl-12 pr-12 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">{suggestion.title}</div>
                    <div className="text-sm text-red-600">{suggestion.category}</div>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && !currentQuery ? (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Digite algo para começar a buscar</p>
          </div>
        ) : loading ? (
          <LoadingSpinner />
        ) : currentQuery ? (
          <>
            {/* Search Info */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Resultados para "{currentQuery}"
              </h2>
              <p className="text-gray-600">
                {posts.length} {posts.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </p>
            </div>

            {/* Results */}
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
                        'Carregar mais resultados'
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <SearchIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Tente buscar por outros termos ou palavras-chave diferentes.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p><strong>Dicas:</strong></p>
                  <p>• Verifique se as palavras estão escritas corretamente</p>
                  <p>• Tente termos mais gerais como "flamengo", "jogadores", "história"</p>
                  <p>• Use palavras-chave específicas como nomes de jogadores ou títulos</p>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Search;