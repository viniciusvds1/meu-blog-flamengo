'use client'

import { ChevronDown } from 'lucide-react';

export default function LoadMoreButton({ onClick, loading }) {
  return (
    <button 
      className="btn btn-outline w-full mt-8"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <>
          Carregar mais notícias
          <ChevronDown className="ml-2" />
        </>
      )}
    </button>
  );
}