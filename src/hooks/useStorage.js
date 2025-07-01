'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * Hook para manipular localStorage e sessionStorage com segurança
 * @param {string} key - Chave para armazenamento
 * @param {any} initialValue - Valor inicial caso a chave não exista
 * @param {Object} options - Opções de configuração
 * @param {string} [options.type='local'] - Tipo de storage ('local' ou 'session')
 * @param {boolean} [options.serialize=true] - Se deve serializar/deserializar valores automaticamente
 * @returns {Array} - [storedValue, setValue, removeValue, error]
 */
export function useStorage(
  key,
  initialValue,
  { type = 'local', serialize = true } = {}
) {
  // Determinar o storage a ser usado
  const storageType = type === 'session' ? 'sessionStorage' : 'localStorage';
  
  // Estado para o valor armazenado
  const [storedValue, setStoredValue] = useState(initialValue);
  // Estado para armazenar erros
  const [error, setError] = useState(null);
  // Flag para indicar se o hook está rodando no cliente
  const [isClient, setIsClient] = useState(false);

  // Funções auxiliares para serialização/deserialização
  const safeSerialize = useCallback((value) => {
    if (!serialize) return value;
    try {
      return JSON.stringify(value);
    } catch (e) {
      setError(new Error(`Falha ao serializar valor: ${e.message}`));
      return initialValue;
    }
  }, [serialize, initialValue]);

  const safeDeserialize = useCallback((value) => {
    if (!serialize) return value;
    if (!value) return initialValue;
    try {
      return JSON.parse(value);
    } catch (e) {
      setError(new Error(`Falha ao deserializar valor: ${e.message}`));
      return initialValue;
    }
  }, [serialize, initialValue]);

  // Função para obter o valor do storage
  const getValueFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return initialValue;
    
    try {
      const item = window[storageType].getItem(key);
      return item ? safeDeserialize(item) : initialValue;
    } catch (e) {
      setError(new Error(`Erro ao acessar ${storageType}: ${e.message}`));
      return initialValue;
    }
  }, [key, initialValue, storageType, safeDeserialize]);

  // Função para definir o valor no storage
  const setValue = useCallback((value) => {
    try {
      // Permitir que o valor seja uma função
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Atualizar o estado React
      setStoredValue(valueToStore);
      
      // Atualizar o storage se estivermos no cliente
      if (typeof window !== 'undefined') {
        window[storageType].setItem(key, safeSerialize(valueToStore));
      }
      
      // Limpar qualquer erro anterior
      if (error) setError(null);
    } catch (e) {
      setError(new Error(`Erro ao salvar em ${storageType}: ${e.message}`));
    }
  }, [storedValue, key, storageType, safeSerialize, error]);

  // Função para remover o item do storage
  const removeValue = useCallback(() => {
    try {
      // Atualizar o estado React
      setStoredValue(initialValue);
      
      // Remover do storage se estivermos no cliente
      if (typeof window !== 'undefined') {
        window[storageType].removeItem(key);
      }
      
      // Limpar qualquer erro anterior
      if (error) setError(null);
    } catch (e) {
      setError(new Error(`Erro ao remover de ${storageType}: ${e.message}`));
    }
  }, [key, storageType, initialValue, error]);

  // Inicializar no cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
      setStoredValue(getValueFromStorage());
    }
  }, [getValueFromStorage]);

  // Registrar event listener para sincronizar entre abas (localStorage)
  useEffect(() => {
    if (typeof window !== 'undefined' && type === 'local') {
      // Atualizar quando o localStorage mudar em outra aba
      const handleStorageChange = (e) => {
        if (e.key === key) {
          try {
            setStoredValue(e.newValue ? safeDeserialize(e.newValue) : initialValue);
          } catch (error) {
            setError(new Error(`Erro ao sincronizar entre abas: ${error.message}`));
          }
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [key, safeDeserialize, initialValue, type]);

  return [
    storedValue,
    setValue,
    removeValue,
    error
  ];
}

// Hooks específicos para cada tipo de armazenamento
export function useLocalStorage(key, initialValue, options = {}) {
  return useStorage(key, initialValue, { ...options, type: 'local' });
}

export function useSessionStorage(key, initialValue, options = {}) {
  return useStorage(key, initialValue, { ...options, type: 'session' });
}

export default useStorage;
