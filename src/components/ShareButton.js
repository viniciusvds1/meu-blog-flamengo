'use client';

import { Share2 } from 'lucide-react';

export default function ShareButton({ title }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: window.location.href,
      });
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center text-gray-600 hover:text-red-600"
    >
      <Share2 size={20} className="mr-2" />
      Compartilhar
    </button>
  );
}
