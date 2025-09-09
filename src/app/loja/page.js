import React from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { client } from '@/prismic';
import { ShoppingBag, ShoppingCart, Heart, Star } from 'lucide-react';

export default async function Loja() {
  // Buscar todos os produtos do Prismic
  const products = await client.getAllByType('produtos');

  // Formatar preu00e7o em moeda brasileira
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Loja Oficial do Flamengo</h1>
          <p className="text-lg text-gray-600 mb-8">Produtos oficiais para a Nação Rubro-Negra</p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
              Todos os Produtos
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors">
              Camisas
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors">
              Acessórios
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors">
              Infantil
            </button>
          </div>
        </div>
        
        {/* Grid de produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const hasDiscount = product.data.full_price && product.data.full_price > product.data.price;
            
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative p-4">
                  <div className="relative aspect-square mb-4">
                    <OptimizedImage
                      src={product.data.image?.url || '/assets/bannerubro.png'}
                      alt={product.data.title?.[0]?.text || 'Produto Flamengo'}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-[1.05]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    {hasDiscount && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                        Oferta
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
                      {product.data.title?.[0]?.text || 'Produto Flamengo'}
                    </h3>
                    <div className="flex items-center text-yellow-500 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                      <span className="text-gray-600 text-xs ml-1">(5.0)</span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {product.data.description?.[0]?.text || ''}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      {hasDiscount && (
                        <span className="text-gray-500 text-sm line-through mr-2">
                          {formatPrice(product.data.full_price)}
                        </span>
                      )}
                      <span className="text-xl font-bold text-red-600">
                        {formatPrice(product.data.price)}
                      </span>
                    </div>
                    <button 
                      aria-label="Adicionar aos favoritos"
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart size={20} />
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <a
                      href={product.data.link_product?.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-red-600 text-white py-2 rounded-md flex items-center justify-center hover:bg-red-700 transition-colors"
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      Comprar
                    </a>
                    <button 
                      className="bg-gray-200 p-2 rounded-md hover:bg-gray-300 transition-colors"
                      aria-label="Ver detalhes"
                    >
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-16">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500">Os produtos seru00e3o adicionados em breve!</p>
          </div>
        )}
      </div>
    </div>
  );
}
