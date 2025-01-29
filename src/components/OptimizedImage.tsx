// components/OptimizedImage.tsx
import Image from 'next/image';
import { FC } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  aspectRatio?: string;
  objectFit?: string;
  width?: number;
  height?: number;
  quality?: number;
  loading?: "lazy" | "eager";
}

const OptimizedImage: FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className, 
  priority = false,
  aspectRatio = 'aspect-video',
  objectFit = 'object-contain',
  width,
  height,
  quality = 75,
  loading = "lazy"
}) => {
  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        loading={loading}
        className={`${className || ''} ${objectFit}`}
        priority={priority}
      />
    );
  }

  return (
    <div className={`relative ${aspectRatio}`} style={{ width: '100%', height: '100%' }}>
      <Image
        src={src}
        alt={alt}
        fill
        quality={quality}
        loading={loading}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: objectFit === 'object-contain' ? 'contain' : 'cover' }}
        className={className || ''}
        priority={priority}
      />
    </div>
  );
};

export default OptimizedImage;