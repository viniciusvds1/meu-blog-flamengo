'use client';

import { useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';

export default function ProductShelf({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const updateIndex = (index) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 500);
  };

  useEffect(() => {
    if (!products || products.length === 0) return;

    const timer = setInterval(() => {
      updateIndex(currentIndex === products.length - 1 ? 0 : currentIndex + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, [products, currentIndex]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (!products || products.length === 0) {
    return null;
  }

  const product = products[currentIndex];
  const hasDiscount = product.data.full_price && product.data.full_price > product.data.price;

  return (
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
                  priority={currentIndex === 0}
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
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => updateIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIndex === idx ? 'bg-red-600 w-4' : 'bg-gray-300'
            }`}
            aria-label={`Ir para produto ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
