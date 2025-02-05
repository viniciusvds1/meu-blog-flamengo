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
  className = '', 
  priority = false,
  aspectRatio = 'aspect-video',
  objectFit = 'object-contain',
  width,
  height,
  quality = 75,
  loading = "lazy"
}) => {
  // Ensure src is a string and not undefined
  const imageSrc = src || '/placeholder.jpg';

  if (width && height) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        loading={loading}
        className={`${className} ${objectFit}`}
        priority={priority}
      />
    );
  }

  return (
    <div className={`relative ${aspectRatio}`} style={{ width: '100%', height: '100%' }}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        quality={quality}
        loading={loading}
        className={`${className} ${objectFit}`}
        priority={priority}
      />
    </div>
  );
};

export default OptimizedImage;