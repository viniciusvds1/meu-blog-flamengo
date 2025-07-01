'use client'

import { useCallback, useRef, memo, useState } from 'react';
import { Search, X, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm, useNotification } from '@/hooks';

function SearchBarComponent() {
  const router = useRouter();
  const { notify } = useNotification();
  const inputRef = useRef(null);

  // Validação para o campo de busca
  const validationSchema = {
    searchTerm: (value) => {
      if (!value || !value.trim()) return 'Digite algo para buscar';
      if (value.trim().length < 2) return 'Digite pelo menos 2 caracteres';
      return '';
    }
  };

  // Função para realizar a busca
  const handleSearchSubmit = useCallback(async (values, { setSubmitting }) => {
    try {
      // Aqui seria a navegação real para a página de resultados
      // router.push(`/search?q=${encodeURIComponent(values.searchTerm)}`);
      
      // Simulação de busca
      notify({
        type: 'info',
        title: 'Buscando...',
        message: `Procurando por "${values.searchTerm}"`,
        duration: 2000
      });
      
      // Simular delay de busca
      await new Promise(resolve => setTimeout(resolve, 800));
      
      notify({
        type: 'success',
        title: 'Busca realizada',
        message: `Resultados para "${values.searchTerm}"`,
        duration: 3000
      });
    } catch (error) {
      console.error('Erro na busca:', error);
      notify({
        type: 'error',
        title: 'Erro na busca',
        message: 'Não foi possível completar a busca. Tente novamente.'
      });
    } finally {
      setSubmitting(false);
    }
  }, [notify]);

  // Usando nosso hook personalizado useForm
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm
  } = useForm({
    initialValues: {
      searchTerm: ''
    },
    validationSchema,
    validateOnChange: false, // Validar apenas no submit para melhor UX
    onSubmit: handleSearchSubmit
  });
  
  // Estado de foco do campo
  const [isFocused, setIsFocused] = useState(false);

  const clearSearch = useCallback(() => {
    resetForm();
    inputRef.current?.focus();
  }, [resetForm]);

  const handleKeyDown = useCallback((e) => {
    // Add escape key to clear search
    if (e.key === 'Escape') {
      clearSearch();
    }
  }, [clearSearch]);

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative animate-fade-in" 
      role="search"
      aria-label="Buscar notícias no blog"
    >
      <div className={`relative flex items-center transition-all duration-300 ${
        isFocused ? 'transform scale-[1.02]' : ''
      }`}>
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="search"
            name="searchTerm"
            value={values.searchTerm}
            onChange={handleChange}
            onBlur={(e) => {
              handleBlur(e);
              setIsFocused(false);
            }}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar notícias..."
            className={`w-full rounded-full pl-12 pr-28 py-3
                     bg-white dark:bg-neutral-800 shadow-md
                     border ${touched.searchTerm && errors.searchTerm 
                       ? 'border-red-500 dark:border-red-400' 
                       : 'border-gray-200 dark:border-gray-700'}
                     placeholder-gray-400 dark:placeholder-gray-500
                     text-gray-800 dark:text-gray-100
                     focus:outline-none focus:ring-2 ${touched.searchTerm && errors.searchTerm
                       ? 'focus:ring-red-400/50'
                       : 'focus:ring-flamengo-red/50'}
                     transition-all duration-300`}
            aria-label="Campo de busca"
            aria-invalid={touched.searchTerm && errors.searchTerm ? 'true' : 'false'}
            autoComplete="off"
            disabled={isSubmitting}
          />
          <div className={`absolute left-4 top-1/2 transform -translate-y-1/2
                    transition-all duration-300
                    ${isFocused ? 'text-flamengo-red' : 
                      (touched.searchTerm && errors.searchTerm ? 'text-red-500' : 'text-gray-400')}`}>
            <Search size={18} aria-hidden="true" />
          </div>
          
          {values.searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-[90px] top-1/2 transform -translate-y-1/2
                     text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                     p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
                     transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Limpar busca"
              disabled={isSubmitting}
            >
              <X size={16} className="transform transition-transform duration-300 hover:rotate-90" />
            </button>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting || !values.searchTerm?.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2
                   bg-gradient-to-r from-flamengo-red to-flamengo-red-dark
                   text-white font-medium rounded-full px-4 py-1.5
                   transition-all duration-300 hover:shadow-md
                   disabled:opacity-70 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-flamengo-red/50"
            aria-label="Executar busca"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader2 size={16} className="animate-spin mr-1" />
                <span>Buscando</span>
              </span>
            ) : (
              <span>Buscar</span>
            )}
          </button>
          
          {touched.searchTerm && errors.searchTerm && (
            <div className="absolute top-full left-4 mt-1 text-red-500 text-sm flex items-center">
              <AlertCircle size={14} className="mr-1" />
              <span>{errors.searchTerm}</span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

// Memoize the component to prevent unnecessary re-renders
const SearchBar = memo(SearchBarComponent);

export default SearchBar;