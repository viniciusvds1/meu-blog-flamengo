'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook para monitorar e controlar a posição de scroll
 * @param {Object} options - Opções de configuração
 * @param {number} [options.throttleTime=100] - Tempo em ms para throttle do evento de scroll
 * @param {boolean} [options.getScrollDirection=false] - Se deve calcular a direção do scroll
 * @returns {Object} - Objeto com informações do scroll
 */
export function useScrollPosition({
  throttleTime = 100,
  getScrollDirection = false
} = {}) {
  // Estados para armazenar informações do scroll
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('none'); // 'up', 'down', 'left', 'right', 'none'
  
  // Referência para o valor anterior do scroll
  const prevScrollY = useRef(0);
  const prevScrollX = useRef(0);
  
  // Referência para o timer de throttling
  const throttleTimeout = useRef(null);
  
  // Referência para o timer de detecção de término do scroll
  const scrollingTimeout = useRef(null);
  
  // Função para atualizar estados de scroll com throttling
  const handleScroll = useCallback(() => {
    if (throttleTimeout.current === null) {
      throttleTimeout.current = setTimeout(() => {
        const currentScrollY = window.scrollY;
        const currentScrollX = window.scrollX;
        
        setScrollY(currentScrollY);
        setScrollX(currentScrollX);
        setIsScrolling(true);
        
        // Determinar direção do scroll, se solicitado
        if (getScrollDirection) {
          if (currentScrollY > prevScrollY.current) {
            setScrollDirection('down');
          } else if (currentScrollY < prevScrollY.current) {
            setScrollDirection('up');
          } else if (currentScrollX > prevScrollX.current) {
            setScrollDirection('right');
          } else if (currentScrollX < prevScrollX.current) {
            setScrollDirection('left');
          }
        }
        
        // Atualizar valores anteriores
        prevScrollY.current = currentScrollY;
        prevScrollX.current = currentScrollX;
        
        // Limpar timeout para permitir novo evento
        throttleTimeout.current = null;
        
        // Resetar timeout de detecção de término de scroll
        if (scrollingTimeout.current) {
          clearTimeout(scrollingTimeout.current);
        }
        
        scrollingTimeout.current = setTimeout(() => {
          setIsScrolling(false);
        }, 150); // Considera o scroll terminado após 150ms de inatividade
      }, throttleTime);
    }
  }, [throttleTime, getScrollDirection]);
  
  // Função para rolar para o topo da página
  const scrollToTop = useCallback((options = { behavior: 'smooth' }) => {
    window.scrollTo({
      top: 0,
      left: 0,
      ...options
    });
  }, []);
  
  // Função para rolar até um elemento específico
  const scrollToElement = useCallback((elementId, options = { behavior: 'smooth' }) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView(options);
    } else {
      console.warn(`Elemento com ID '${elementId}' não encontrado`);
    }
  }, []);

  // Função para verificar se um elemento está visível na viewport
  const isElementInViewport = useCallback((element) => {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, []);
  
  // Efeito para adicionar o event listener na montagem e removê-lo na desmontagem
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Inicializar valores
    setScrollY(window.scrollY);
    setScrollX(window.scrollX);
    prevScrollY.current = window.scrollY;
    prevScrollX.current = window.scrollX;
    
    // Adicionar evento de scroll com opção passive para melhor performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleTimeout.current) clearTimeout(throttleTimeout.current);
      if (scrollingTimeout.current) clearTimeout(scrollingTimeout.current);
    };
  }, [handleScroll]);
  
  // Retornar dados e funções úteis
  return {
    scrollY,
    scrollX,
    isScrolling,
    scrollDirection,
    scrollToTop,
    scrollToElement,
    isElementInViewport
  };
}

export default useScrollPosition;
