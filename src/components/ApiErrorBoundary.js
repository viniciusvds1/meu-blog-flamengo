'use client';

import { Component } from 'react';
import { AlertTriangle, RefreshCw, ChevronRight, AlertCircle } from 'lucide-react';

/**
 * Boundary específico para erros de API e carregamento de dados
 * com funcionalidades de retry, fallback e sugestões para o usuário.
 */
class ApiErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log do erro
    console.error('ApiErrorBoundary capturou erro:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Categorizar o erro para tratamento específico
    let errorType = 'unknown';
    
    if (error.message?.includes('network') || error.message?.includes('fetch') || error.name === 'TypeError') {
      errorType = 'network';
    } else if (error.status === 401 || error.status === 403) {
      errorType = 'auth';
    } else if (error.status === 404) {
      errorType = 'not_found';
    } else if (error.status >= 500) {
      errorType = 'server';
    }
    
    // Enviar para analytics
    if (window.gtag) {
      window.gtag('event', 'api_error', {
        'event_category': 'error',
        'event_label': errorType,
        'value': error.status || 0,
        'component': this.props.componentName || 'unknown'
      });
    }
  }

  handleRetry = async () => {
    this.setState({ isRetrying: true, retryCount: this.state.retryCount + 1 });
    
    try {
      // Se foi fornecida uma função de retry, execute-a
      if (typeof this.props.onRetry === 'function') {
        await this.props.onRetry();
      }
      
      // Reset do estado de erro
      this.setState({ hasError: false, error: null, errorInfo: null, isRetrying: false });
    } catch (error) {
      this.setState({ 
        hasError: true, 
        error, 
        isRetrying: false 
      });
    }
  }

  // Determina uma mensagem amigável com base no erro
  getErrorMessage() {
    const { error } = this.state;
    const { fallbackMessage } = this.props;
    
    if (fallbackMessage) return fallbackMessage;
    
    if (!error) return 'Ocorreu um erro desconhecido';
    
    // Mensagens personalizadas por tipo de erro
    if (!navigator.onLine) {
      return 'Você parece estar offline. Verifique sua conexão com a internet e tente novamente.';
    }
    
    if (error.message?.includes('network') || error.message?.includes('fetch') || error.name === 'TypeError') {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.';
    }
    
    if (error.status === 401 || error.status === 403) {
      return 'Você não tem permissão para acessar este recurso. Tente fazer login novamente.';
    }
    
    if (error.status === 404) {
      return 'O recurso solicitado não foi encontrado. Pode ter sido removido ou movido.';
    }
    
    if (error.status >= 500) {
      return 'Nosso servidor está enfrentando problemas. Estamos trabalhando para resolver isso rapidamente.';
    }
    
    return error.message || 'Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.';
  }

  render() {
    const { hasError, isRetrying, retryCount } = this.state;
    const { fallbackUI, maxRetries = 3, showHeader = true } = this.props;
    
    if (hasError) {
      // Usar UI personalizada se fornecida
      if (fallbackUI) {
        return typeof fallbackUI === 'function' 
          ? fallbackUI(this.state.error, this.handleRetry)
          : fallbackUI;
      }
      
      // UI padrão de erro
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md border border-gray-200 dark:border-gray-700">
          {showHeader && (
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-amber-500 mr-2 h-5 w-5" />
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                Falha ao carregar dados
              </h3>
            </div>
          )}
          
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {this.getErrorMessage()}
          </p>
          
          {retryCount < maxRetries && (
            <button 
              onClick={this.handleRetry}
              disabled={isRetrying}
              className={`
                flex items-center px-4 py-2 rounded-md 
                ${isRetrying 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-flamengo-red hover:bg-red-700'} 
                text-white transition-colors
              `}
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Tentando novamente...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar novamente
                </>
              )}
            </button>
          )}

          {retryCount >= maxRetries && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-900 rounded-md">
              <div className="flex items-center mb-2">
                <AlertCircle className="text-red-500 w-4 h-4 mr-2" />
                <span className="text-sm font-medium text-red-500">
                  Várias tentativas falharam
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Não conseguimos carregar os dados após {maxRetries} tentativas. Você pode:
              </p>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-6 list-disc">
                <li>Verificar sua conexão com a internet</li>
                <li>Aguardar alguns minutos e recarregar a página</li>
                <li>Limpar o cache do navegador e tentar novamente</li>
              </ul>
              <button 
                onClick={() => window.location.reload()} 
                className="flex items-center text-sm text-flamengo-red hover:text-red-700 mt-3 font-medium"
              >
                Recarregar página
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-5 p-3 bg-gray-100 dark:bg-gray-900 rounded-md overflow-auto">
              <details>
                <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Detalhes do erro (apenas ambiente de desenvolvimento)
                </summary>
                <div className="mt-2">
                  <p className="text-xs font-mono text-red-600 dark:text-red-400">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="mt-2 text-xs font-mono text-gray-700 dark:text-gray-400 overflow-auto p-2">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            </div>
          )}
        </div>
      );
    }

    // Renderização normal quando não há erro
    return this.props.children;
  }
}

export default ApiErrorBoundary;
