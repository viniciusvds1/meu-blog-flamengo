import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and error handling
api.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and data transformation
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Enhanced error handling
    const errorMessage = error.response?.data?.detail || error.message || 'An error occurred';
    const errorStatus = error.response?.status;
    
    console.error('API Error:', {
      status: errorStatus,
      message: errorMessage,
      url: error.config?.url,
      method: error.config?.method
    });

    // Transform error for better UX
    const transformedError = {
      ...error,
      userMessage: getUserFriendlyMessage(errorStatus, errorMessage)
    };

    return Promise.reject(transformedError);
  }
);

// Helper function to get user-friendly error messages
function getUserFriendlyMessage(status, message) {
  switch (status) {
    case 404:
      return 'Conteúdo não encontrado';
    case 500:
      return 'Erro interno do servidor. Tente novamente mais tarde.';
    case 503:
      return 'Serviço temporariamente indisponível';
    case 429:
      return 'Muitas tentativas. Aguarde um momento.';
    default:
      return message || 'Erro inesperado. Tente novamente.';
  }
}

// API service functions
export const blogApi = {
  // Posts
  getPosts: (params = {}) => api.get('/posts', { params }),
  getPostBySlug: (slug) => api.get(`/posts/${slug}`),
  getPopularPosts: (limit = 5) => api.get(`/posts/popular?limit=${limit}`),
  getRecentPosts: (limit = 5) => api.get(`/posts/recent?limit=${limit}`),
  
  // Categories
  getCategories: () => api.get('/categories'),
  
  // Tags
  getTags: () => api.get('/tags'),
  
  // Search
  searchPosts: (query, params = {}) => api.get('/posts', { 
    params: { search: query, ...params } 
  }),
  getSearchSuggestions: (query) => api.get(`/search/suggestions?q=${encodeURIComponent(query)}`),
  
  // Statistics
  getStats: () => api.get('/stats'),
  
  // Initialize data
  initializeData: () => api.post('/init-data'),
  
  // Health check
  healthCheck: () => api.get('/health')
};

export default api;