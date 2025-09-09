'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-red-600 mb-4">Oops!</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Algo deu errado
        </h2>
        <p className="text-gray-600 mb-8">
          Ocorreu um erro inesperado. Por favor, tente novamente.
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-block"
          >
            Voltar para a Home
          </Link>
        </div>
      </div>
    </div>
  );
}
