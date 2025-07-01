'use client';

import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import OptimizedImage from './OptimizedImage';
import ApiErrorBoundary from './ApiErrorBoundary';

// Product item component - memoizado para evitar re-renderizações desnecessárias
const ProductItem = memo(function ProductItem({ product, hasDiscount, formatPrice, priority }) {
  return (
    <div className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <figure className="relative pt-4 px-4">
        {product.data.image?.url && (
          <div className="relative w-full h-64">
            <OptimizedImage
              src={product.data.image.url}
              alt={product.data.title?.[0]?.text || "Produto Flamengo"}
              fill
              className="object-contain rounded-lg"
              sizes="(max-width: 768px) 100vw, 384px"
              quality={75}
              priority={priority}
            />
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-6 right-6 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
            Oferta
          </div>
        )}
      </figure>
      <div className="card-body p-6">
        <h2 className="card-title text-xl font-bold text-gray-800 mb-2">
          {product.data.title?.[0]?.text || "Produto Flamengo"}
        </h2>
        <p className="text-gray-600 mb-4">
          {product.data.description?.[0]?.text?.slice(0, 100) + (product.data.description?.[0]?.text?.length > 100 ? '...' : '') || ""}
        </p>
        <div className="flex flex-col items-center mb-4">
          {hasDiscount && (
            <span className="text-gray-500 line-through mb-1">
              {formatPrice(product.data.full_price)}
            </span>
          )}
          <span className="text-2xl font-bold text-red-600">
            {formatPrice(product.data.price)}
          </span>
        </div>
        <div className="card-actions justify-center">
          <a
            href={product.data.link_product?.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary bg-red-600 hover:bg-red-700 text-white w-full transition-colors duration-300"
          >
            Comprar Agora
          </a>
        </div>
      </div>
    </div>
  );
});

// Bullet navigation - memoizado para evitar re-renderizações desnecessárias
const BulletNavigation = memo(function BulletNavigation({ products, currentIndex, onNavigate }) {
  return (
    <div className="flex justify-center gap-2 mt-4">
      {products.map((_, idx) => (
        <button
          key={idx}
          onClick={() => onNavigate(idx)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            currentIndex === idx ? 'bg-red-600 w-4' : 'bg-gray-300'
          }`}
          aria-label={`Ir para produto ${idx + 1}`}
        />
      ))}
    </div>
  );
});

function ProductShelf({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Memoizar função updateIndex com useCallback para evitar recriação entre renderizações
  const updateIndex = useCallback((index) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (!products || products.length === 0) return;

    const timer = setInterval(() => {
      updateIndex(currentIndex === products.length - 1 ? 0 : currentIndex + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, [products, currentIndex]);

  // Memoizar função formatPrice com useCallback
  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }, []);

  if (!products || products.length === 0) {
    return (
      <div className="w-full py-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-red-600">
          Produtos em Destaque
        </h2>
        <div className="max-w-sm mx-auto bg-white shadow-xl rounded-lg p-4">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Usar useMemo para computações derivadas que dependem de currentIndex
  const { product, hasDiscount } = useMemo(() => {
    const currentProduct = products[currentIndex];
    return {
      product: currentProduct,
      hasDiscount: currentProduct.data.full_price && currentProduct.data.full_price > currentProduct.data.price
    };
  }, [products, currentIndex]);

  return (
    <ApiErrorBoundary>
      <div className="w-full py-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-red-600">
          Produtos em Destaque
        </h2>
        <div 
          className={`
            max-w-sm mx-auto transform transition-all duration-1000 ease-in-out
            ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
          `}
        >
          <ProductItem 
            product={product} 
            hasDiscount={hasDiscount} 
            formatPrice={formatPrice}
            priority={currentIndex === 0}
          />
        </div>
        
        <BulletNavigation 
          products={products}
          currentIndex={currentIndex}
          onNavigate={updateIndex}
        />
      </div>
    </ApiErrorBoundary>
  );
}

export default memo(ProductShelf);
