'use client';

/**
 * Hook para formatação de datas com diferentes formatos
 * @returns {Object} Funções de formatação de datas
 */
export const useFormatDate = () => {
  /**
   * Formata uma data no formato padrão brasileiro
   * @param {string|Date} dateString - String de data ou objeto Date
   * @returns {string} Data formatada
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  /**
   * Formata uma data apenas com dia e mês
   * @param {string|Date} dateString - String de data ou objeto Date
   * @returns {string} Data formatada
   */
  const formatShortDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  /**
   * Formata uma data incluindo informação de horário
   * @param {string|Date} dateString - String de data ou objeto Date
   * @returns {string} Data e hora formatadas
   */
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  /**
   * Retorna o tempo relativo (ex: "há 2 horas")
   * @param {string|Date} dateString - String de data ou objeto Date
   * @returns {string} Tempo relativo
   */
  const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 1) return 'agora';
    if (diffMinutes < 60) return `há ${diffMinutes} min`;
    if (diffHours < 24) return `há ${diffHours} h`;
    if (diffDays < 30) return `há ${diffDays} dias`;
    
    return formatDate(date);
  };

  return {
    formatDate,
    formatShortDate,
    formatDateTime,
    formatRelativeTime
  };
};

export default useFormatDate;
