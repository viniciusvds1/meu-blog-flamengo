/**
 * Componente de filtro de categorias de notícias.
 * 
 * @param {string} currentCategory - Categoria de notícias atualmente selecionada.
 * @returns {JSX.Element} - Elemento JSX do componente de filtro de categorias.
 * @throws {Error} - Se a prop currentCategory não estiver def
 * inida.
 */
import Link from 'next/link';
export default function CategoryFilter({ currentCategory }) {
  // Verificar se currentCategory está definido
  if (typeof currentCategory === 'undefined') {
    throw new Error('currentCategory não está definido.'); // Lança um erro se a prop não estiver definida
  }

  try {
    return (
      <div className="mb-8" role="navigation" aria-label="Filtro de categorias">
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href="/noticias"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !currentCategory ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-label="Filtrar por todas as notícias"
            aria-current={!currentCategory ? 'page' : undefined}
          >
            Todas
          </Link>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <Link
              key={value}
              href={`/categoria/${value}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                currentCategory === value ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label={`Filtrar por ${label}`}
              aria-current={currentCategory === value ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erro ao renderizar o componente de filtro de categorias:', error);
    return null; // Retorna null se ocorrer um erro
  }
}
