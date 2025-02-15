'use client';

import Image from 'next/image';
import { useState } from 'react';

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="20%" />
      <stop stop-color="#f6f7f8" offset="40%" />
      <stop stop-color="#f6f7f8" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export default function OptimizedImage({ 
  src,
  priority = false, 
  className = '', 
  alt = '',
  width,
  height,
  ...props 
}) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Convert image URL to WebP if it's not already
  const imageUrl = src.startsWith('data:') || src.endsWith('.webp') 
    ? src 
    : `${src}?format=webp`;

  // Calculate placeholder size
  const placeholderSize = {
    width: typeof width === 'number' ? width : '100%',
    height: typeof height === 'number' ? height : '100%',
  };

  return (
    <div className={`relative ${className}`} style={placeholderSize}>
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className={`
          transition-opacity duration-500 ease-in-out
          ${isLoading ? 'opacity-0' : 'opacity-100'}
        `}
        loading={priority ? 'eager' : 'lazy'}
        quality={props.quality || 75}
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(width || 700, height || 475))}`}
        onLoadingComplete={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
}
