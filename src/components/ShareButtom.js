// ShareButton.js
"use client"; // Isso define que esse componente é um Client Component

import { Share2 } from "lucide-react";

const ShareButton = ({ url, title }) => {
  const shareContent = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          url: url,
        })
        .catch(console.error);
    }
  };

  return (
    <button
      onClick={shareContent}
      className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
    >
      <Share2 size={20} />
      <span>Compartilhar</span>
    </button>
  );
};

export default ShareButton;
