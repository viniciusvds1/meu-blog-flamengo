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
  fill,
  ...props 
}) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Convert image URL to WebP if it's not already
  const imageUrl = src.startsWith('data:') || src.endsWith('.webp') 
    ? src 
    : `${src}?format=webp`;

  // Default dimensions for the shimmer effect
  const shimmerWidth = width || 1200;
  const shimmerHeight = height || 630;

  const imageProps = {
    src: imageUrl,
    alt,
    className: `
      transition-opacity duration-500 ease-in-out
      ${isLoading ? 'opacity-0' : 'opacity-100'}
      ${className}
    `,
    loading: priority ? 'eager' : 'lazy',
    quality: props.quality || 75,
    placeholder: "blur",
    blurDataURL: `data:image/svg+xml;base64,${toBase64(shimmer(shimmerWidth, shimmerHeight))}`,
    onLoad: () => setIsLoading(false),
    ...props
  };

  // If fill mode is enabled
  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          {...imageProps}
          fill
          sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          style={{ objectFit: props.objectFit || 'cover' }}
          alt={alt} // Certifique-se de que todas as imagens tenham um alt definido.
        />
      </div>
    );
  }

  // If width and height are provided
  if (width && height) {
    return (
      <div className={`relative ${className}`}>
        <Image
          {...imageProps}
          width={width}
          height={height}
          alt={alt} // Certifique-se de que todas as imagens tenham um alt definido.
        />
      </div>
    );
  }

  // Default case: use fixed dimensions of 1200x630
  return (
    <div className={`relative ${className}`}>
      <Image
        {...imageProps}
        width={1200}
        height={630}
        alt={alt} // Certifique-se de que todas as imagens tenham um alt definido.
      />
    </div>
  );
}
