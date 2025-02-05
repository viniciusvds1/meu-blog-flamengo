'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function OptimizedImage({ 
  priority = false, 
  className = '', 
  alt = '', 
  ...props 
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <div className={`animate-pulse bg-gray-200 ${className}`} />
      )}
      <Image
        {...props}
        alt={alt}
        className={`
          ${className}
          ${isLoading ? 'opacity-0' : 'opacity-100'}
          transition-opacity duration-300
        `}
        loading={priority ? 'eager' : 'lazy'}
        quality={props.quality || 75}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </>
  );
}
