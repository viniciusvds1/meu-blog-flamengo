import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-600 mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link
          href="/"
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          Voltar para a Home
        </Link>
      </div>
    </div>
  );
}
