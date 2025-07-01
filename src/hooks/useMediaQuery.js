'use client';

import { useState, useEffect, useMemo } from 'react';

/**
 * Hook para detectar media queries e responder a mudanças de tamanho de tela
 * @param {string} query - CSS media query para monitorar (ex: '(min-width: 768px)')
 * @returns {boolean} - Retorna true se a media query corresponder
 */
export function useMediaQuery(query) {
  // Usar undefined como estado inicial para evitar problemas com SSR
  const [matches, setMatches] = useState(false);
  // Flag para saber se estamos no cliente ou servidor
  const [isClient, setIsClient] = useState(false);

  // Memorizar a query para evitar recriação a cada render
  const mediaQuery = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return window.matchMedia(query);
  }, [query]);

  // Efeito para inicializar o estado no cliente
  useEffect(() => {
    setIsClient(true);
    
    // Verificar o match inicial
    if (mediaQuery) {
      setMatches(mediaQuery.matches);
    }
    
    // Função para atualizar o estado quando a query mudar
    const handleChange = (e) => {
      setMatches(e.matches);
    };

    // Adicionar listener
    if (mediaQuery) {
      // API moderna
      mediaQuery.addEventListener('change', handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery) {
        // API moderna
        mediaQuery.removeEventListener('change', handleChange);
      }
    };
  }, [mediaQuery]);

  // No SSR, retornamos false (ou um valor padrão configurável)
  return isClient ? matches : false;
}

// Helper functions para breakpoints comuns (compatíveis com Tailwind)
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)');
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)');
}

export function useIsLargeDesktop() {
  return useMediaQuery('(min-width: 1280px)');
}

export default useMediaQuery;
