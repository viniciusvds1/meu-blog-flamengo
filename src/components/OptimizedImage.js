'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Shield } from 'lucide-react';

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

// Função nativa para verificar cookies sem dependências externas
const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Componente de placeholder para mostrar quando não há consentimento
const ConsentPlaceholder = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
      <Shield className="w-8 h-8 text-flamengo-red mb-2" />
      <p className="text-sm text-center text-gray-600 dark:text-gray-300">
        Necessitamos do seu consentimento para exibir este conteúdo.
      </p>
    </div>
  );
};

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
  const [isInView, setIsInView] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const imageRef = useRef(null);
  const checkInterval = useRef(null);
  
  // Verificar consentimento de cookies
  useEffect(() => {
    // Verificar imediatamente
    const flamengoBlogConsent = getCookie('flamengoBlogConsent');
    setHasConsent(!!flamengoBlogConsent);
    
    // Continuar verificando a cada 2 segundos para atualizar quando o usuário der consentimento
    if (!flamengoBlogConsent) {
      checkInterval.current = setInterval(() => {
        const updatedConsent = getCookie('flamengoBlogConsent');
        if (updatedConsent) {
          setHasConsent(true);
          if (checkInterval.current) {
            clearInterval(checkInterval.current);
          }
        }
      }, 2000);
    }
    
    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, []);
  
  // Verificar se é uma imagem local (assets) ou externa
  const isLocalAsset = src.startsWith('/assets/') || src.startsWith('/images/');
  
  // Determinar se a imagem deve ser mostrada (prioridade, assets locais ou com consentimento)
  const shouldShowImage = priority || isLocalAsset || hasConsent;
  
  // Tratar URLs externas e internas de forma diferente
  let imageUrl = src;
  
  // Detectar se estamos no navegador com suporte a WebP
  const supportsWebP = typeof window !== 'undefined' && 
    window.document?.createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') === 0;
  
  // Apenas converter para WebP se for uma URL interna (começando com /)
  if (src.startsWith('/') && !src.startsWith('data:') && !src.endsWith('.webp') && supportsWebP) {
    imageUrl = `${src}?format=webp`;
  }

  // Default dimensions for the shimmer effect
  const shimmerWidth = width || 1200;
  const shimmerHeight = height || 630;

  // Setup Intersection Observer for smarter lazy loading
  const onIntersection = useCallback((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      setIsInView(true);
      // Desconectar o observer após a detecção
      if (observer.current && imageRef.current) {
        observer.current.unobserve(imageRef.current);
      }
    }
  }, []);

  const observer = useRef(null);

  useEffect(() => {
    // Não usar Observer para imagens prioritárias
    if (priority) {
      setIsInView(true);
      return;
    }

    // Verificar suporte para Intersection Observer
    if ('IntersectionObserver' in window && imageRef.current) {
      observer.current = new IntersectionObserver(onIntersection, {
        rootMargin: '200px', // Começar carregamento quando estiver a 200px de distância
        threshold: 0.1
      });
      observer.current.observe(imageRef.current);
    } else {
      // Fallback para browsers sem suporte
      setIsInView(true);
    }

    return () => {
      if (observer.current && imageRef.current) {
        observer.current.unobserve(imageRef.current);
        observer.current = null;
      }
    };
  }, [priority, onIntersection]);

  const imageProps = {
    src: imageUrl,
    alt,
    className: `
      transition-opacity duration-500 ease-in-out
      ${isLoading ? 'opacity-0' : 'opacity-100'}
      ${className}
    `,
    loading: priority ? 'eager' : 'lazy',
    quality: priority ? 90 : (props.quality || 75), // Melhor qualidade para imagens prioritárias
    placeholder: "blur",
    fetchPriority: priority ? 'high' : 'auto', // Nova propriedade para melhorar LCP
    blurDataURL: `data:image/svg+xml;base64,${toBase64(shimmer(shimmerWidth, shimmerHeight))}`,
    onLoad: () => setIsLoading(false),
    ...props
  };

  // If fill mode is enabled
  if (fill) {
    return (
      <div className="relative w-full h-full" ref={imageRef}>
        {(isInView || priority) ? (
          shouldShowImage ? (
            <Image
              {...imageProps}
              fill
              sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
              style={{ objectFit: props.objectFit || 'cover' }}
              alt={alt} // Certifique-se de que todas as imagens tenham um alt definido.
            />
          ) : (
            <ConsentPlaceholder className="w-full h-full" />
          )
        ) : (
          <div 
            className="w-full h-full bg-gray-200 animate-pulse" 
            style={{ aspectRatio: width && height ? `${width}/${height}` : '16/9' }}
            aria-label={`Carregando imagem: ${alt}`}
          />
        )}
      </div>
    );
  }

  // If width and height are provided
  if (width && height) {
    return (
      <div 
        className={`relative ${className}`} 
        ref={imageRef}
        style={{ aspectRatio: `${width}/${height}` }}
      >
        {(isInView || priority) ? (
          shouldShowImage ? (
            <Image
              {...imageProps}
              width={width}
              height={height}
              alt={alt} // Certifique-se de que todas as imagens tenham um alt definido.
            />
          ) : (
            <ConsentPlaceholder className="w-full h-full" />
          )
        ) : (
          <div 
            className="w-full h-full bg-gray-200 animate-pulse" 
            style={{ aspectRatio: `${width}/${height}` }}
            aria-label={`Carregando imagem: ${alt}`}
          />
        )}
      </div>
    );
  }

  // Default case: use fixed dimensions of 1200x630
  return (
    <div className={`relative ${className}`} ref={imageRef}>
      {(isInView || priority) ? (
        shouldShowImage ? (
          <Image
            {...imageProps}
            width={1200}
            height={630}
            alt={alt} // Certifique-se de que todas as imagens tenham um alt definido.
          />
        ) : (
          <ConsentPlaceholder className="w-full h-full" />
        )
      ) : (
        <div 
          className="w-full h-full bg-gray-200 animate-pulse" 
          style={{ aspectRatio: '1200/630' }}
          aria-label={`Carregando imagem: ${alt}`}
        />
      )}
    </div>
  );
}
