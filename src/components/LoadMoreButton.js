'use client'

import { memo } from 'react';
import { ChevronDown } from 'lucide-react';

const LoadMoreButton = memo(function LoadMoreButton({ onClick, loading }) {
  return (
    <button 
      className="btn btn-outline w-full mt-8 flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90"
      onClick={onClick}
      disabled={loading}
      aria-busy={loading}
      aria-label="Carregar mais notícias"
      type="button"
    >
      {loading ? (
        <span 
          className="loading loading-spinner" 
          role="status"
          aria-label="Carregando..."
        />
      ) : (
        <>
          <span>Carregar mais notícias</span>
          <ChevronDown 
            className="w-5 h-5" 
            aria-hidden="true"
          />
        </>
      )}
    </button>
  );
});

LoadMoreButton.displayName = 'LoadMoreButton';

export default LoadMoreButton;