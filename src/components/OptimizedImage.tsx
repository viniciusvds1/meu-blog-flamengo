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
  onLoad?: () => void;
}

const OptimizedImage: FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  aspectRatio = 'aspect-video',
  objectFit = 'object-fill',
  width,
  height,
  quality = 75,
  loading = "lazy",
  onLoad
}) => {
  // Ensure src is a string and not undefined
  const imageSrc = src || '/placeholder.jpg';

  // If width and height are provided, use them
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
        onLoad={onLoad}
      />
    );
  }

  // Otherwise, use fill mode with a container
  return (
    <div className={`relative text-white ${aspectRatio}`} style={{ width: '100%', height: '100%' }}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        quality={quality}
        loading={loading}
        className={`${className} ${objectFit}`}
        priority={priority}
        onLoad={onLoad}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};

export default OptimizedImage;