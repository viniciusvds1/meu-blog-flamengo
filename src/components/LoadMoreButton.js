'use client'

import { ChevronDown } from 'lucide-react';

export default function LoadMoreButton() {
  return (
    <button className="btn btn-outline w-full mt-8">
      Carregar mais notícias
      <ChevronDown className="ml-2" />
    </button>
  );
}