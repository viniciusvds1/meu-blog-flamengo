'use client';

import { Component } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Componente de Error Boundary para capturar erros em componentes filhos
 * e exibir uma UI alternativa amigável ao invés de quebrar a aplicação toda.
 * 
 * Nota: Error Boundaries apenas funcionam em componentes React, não em:
 * - Event handlers
 * - Código assíncrono (ex: setTimeout)
 * - Renderização no servidor (SSR)
 * - Erros lançados no próprio Error Boundary (não em filhos)
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o state para que a próxima renderização mostre a UI alternativa
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Você pode logar o erro em um serviço de relatórios de erros
    console.error('Error Boundary capturou um erro:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Log para serviço de analytics ou monitoramento
    if (window.gtag) {
      window.gtag('event', 'error', {
        'event_category': 'error',
        'event_label': error.message,
        'value': this.props.componentName || 'unknown_component'
      });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render() {
    if (this.state.hasError) {
      // Interface alternativa em caso de erro
      return (
        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md border border-red-200 dark:border-red-900">
          <div className="flex items-center mb-3">
            <AlertCircle className="text-red-500 w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold text-red-500">
              {this.props.title || 'Ops! Algo deu errado'}
            </h3>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {this.props.message || 'Ocorreu um erro ao carregar este componente.'}
          </p>
          
          {this.props.showReset !== false && (
            <button
              onClick={this.handleReset}
              className="flex items-center px-4 py-2 bg-flamengo-red text-white rounded-md hover:bg-red-700 transition-colors"
              aria-label="Tentar novamente"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {this.props.resetText || 'Tentar novamente'}
            </button>
          )}
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-900 rounded overflow-auto text-xs">
              <p className="font-semibold text-red-500">{this.state.error.toString()}</p>
              {this.state.errorInfo && (
                <pre className="mt-2 text-gray-700 dark:text-gray-400">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}
        </div>
      );
    }

    // Renderização normal quando não há erro
    return this.props.children;
  }
}

export default ErrorBoundary;
