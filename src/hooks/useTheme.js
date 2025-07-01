'use client';

import { useState, useEffect, useCallback } from 'react';

export function useTheme(defaultTheme = 'light') {
  // Estado para armazenar o tema atual
  const [theme, setTheme] = useState(defaultTheme);
  // Estado para controlar se o tema já foi inicializado
  const [isInitialized, setIsInitialized] = useState(false);

  // Função para alternar entre temas (light/dark)
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Salvar o tema no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      // Atualizar o atributo 'data-theme' no documento
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  }, [theme]);

  // Função para definir um tema específico
  const setSpecificTheme = useCallback((newTheme) => {
    if (newTheme !== 'light' && newTheme !== 'dark') {
      console.warn('Tema inválido. Use "light" ou "dark".');
      return;
    }
    
    setTheme(newTheme);
    // Salvar o tema no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      // Atualizar o atributo 'data-theme' no documento
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  }, []);

  // Efeito para inicializar o tema
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      // Verificar se existe um tema salvo no localStorage
      const savedTheme = localStorage.getItem('theme');
      
      // Verificar preferência de cores do sistema
      const prefersDark = window.matchMedia && 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Determinar tema inicial
      let initialTheme;
      if (savedTheme) {
        // Se existe tema salvo, usar ele
        initialTheme = savedTheme;
      } else if (prefersDark) {
        // Se não tem tema salvo mas o sistema prefere dark mode
        initialTheme = 'dark';
      } else {
        // Caso contrário, usar o tema padrão
        initialTheme = defaultTheme;
      }
      
      // Atualizar o estado
      setTheme(initialTheme);
      // Atualizar o atributo data-theme no documento
      document.documentElement.setAttribute('data-theme', initialTheme);
      // Marcar como inicializado
      setIsInitialized(true);
    }
  }, [defaultTheme, isInitialized]);

  // Efeito para detectar mudanças nas preferências do sistema
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        // Só mudar automaticamente se o usuário não tiver escolhido um tema manualmente
        if (!localStorage.getItem('theme')) {
          const newTheme = e.matches ? 'dark' : 'light';
          setTheme(newTheme);
          document.documentElement.setAttribute('data-theme', newTheme);
        }
      };
      
      // Event listener para mudanças de preferência
      mediaQuery.addEventListener('change', handleChange);
      
      // Cleanup ao desmontar componente
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, []);

  return { 
    theme, 
    toggleTheme, 
    setTheme: setSpecificTheme,
    isDarkMode: theme === 'dark', 
    isLightMode: theme === 'light'
  };
}

export default useTheme;
