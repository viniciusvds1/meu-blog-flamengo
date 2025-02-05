'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function StoreSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Simulated products for now
        const dummyProducts = [
          {
            id: 1,
            name: 'Camisa Flamengo I 23/24',
            price: 'R$ 349,90',
            image: '/products/camisa-1.jpg',
            url: 'https://www.flamengo.com.br/loja'
          },
          {
            id: 2,
            name: 'Camisa Flamengo II 23/24',
            price: 'R$ 349,90',
            image: '/products/camisa-2.jpg',
            url: 'https://www.flamengo.com.br/loja'
          },
          {
            id: 3,
            name: 'Shorts Flamengo I 23/24',
            price: 'R$ 199,90',
            image: '/products/shorts-1.jpg',
            url: 'https://www.flamengo.com.br/loja'
          }
        ];
        
        setProducts(dummyProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-200 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Loja Oficial</h2>
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <Link 
            key={product.id}
            href={product.url || 'https://www.flamengo.com.br/loja'}
            target="_blank"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-red-600 font-bold">{product.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-4 text-center">
        <Link
          href="https://www.flamengo.com.br/loja"
          target="_blank"
          className="btn btn-primary"
        >
          Visitar Loja
        </Link>
      </div>
    </div>
  );
}
