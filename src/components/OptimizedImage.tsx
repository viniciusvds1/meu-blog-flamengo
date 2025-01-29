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
}

const OptimizedImage: FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className, 
  priority = false,
  aspectRatio = 'aspect-video',
  objectFit = 'object-contain'
}) => {
  return (
    <div className={`relative ${aspectRatio}`} style={{ width: '100%', height: '100%' }}>
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: objectFit === 'object-contain' ? 'contain' : 'cover' }}
        className={className || ''}
        priority={priority}
      />
    </div>
  );
};

export default OptimizedImage;