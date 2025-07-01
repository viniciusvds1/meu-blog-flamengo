'use client';

import { useState, useCallback, useContext, createContext, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// Contexto para o sistema de notificações
const NotificationContext = createContext(undefined);

// ID único para cada notificação
let notificationId = 0;

/**
 * Provider do sistema de notificações
 */
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  
  // Adicionar uma nova notificação
  const addNotification = useCallback((notification) => {
    const id = ++notificationId;
    const notificationWithId = { 
      ...notification,
      id,
      duration: notification.duration || 5000, // Duração padrão 5s
    };
    
    setNotifications(prev => [...prev, notificationWithId]);
    
    // Configurar timer para remover a notificação após a duração
    if (notificationWithId.duration !== Infinity) {
      setTimeout(() => {
        removeNotification(id);
      }, notificationWithId.duration);
    }
    
    return id;
  }, []);
  
  // Remover uma notificação pelo ID
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  // Remover todas as notificações
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  // Valor do contexto
  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    // Helper functions para tipos comuns de notificações
    success: useCallback((message, options = {}) => {
      return addNotification({ 
        type: 'success', 
        message, 
        ...options 
      });
    }, [addNotification]),
    
    error: useCallback((message, options = {}) => {
      return addNotification({ 
        type: 'error', 
        message, 
        ...options 
      });
    }, [addNotification]),
    
    warning: useCallback((message, options = {}) => {
      return addNotification({ 
        type: 'warning', 
        message, 
        ...options 
      });
    }, [addNotification]),
    
    info: useCallback((message, options = {}) => {
      return addNotification({ 
        type: 'info', 
        message, 
        ...options 
      });
    }, [addNotification])
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
    </NotificationContext.Provider>
  );
}

/**
 * Componente de contêiner para renderizar todas as notificações
 */
function NotificationContainer({ notifications, removeNotification }) {
  const rootRef = useRef(null);
  const containerRootRef = useRef(null);
  
  // Setup notification container once on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Criar o portal para renderizar as notificações no topo da árvore DOM
    let notificationRoot = document.getElementById('notification-root');
    if (!notificationRoot) {
      notificationRoot = document.createElement('div');
      notificationRoot.id = 'notification-root';
      notificationRoot.style.position = 'fixed';
      notificationRoot.style.top = '20px';
      notificationRoot.style.right = '20px';
      notificationRoot.style.zIndex = '9999';
      document.body.appendChild(notificationRoot);
      
      rootRef.current = notificationRoot;
      containerRootRef.current = createRoot(notificationRoot);
    } else {
      rootRef.current = notificationRoot;
      containerRootRef.current = createRoot(notificationRoot);
    }
    
    // Cleanup on unmount
    return () => {
      if (containerRootRef.current) {
        containerRootRef.current.unmount();
      }
      if (rootRef.current && rootRef.current.parentNode) {
        rootRef.current.parentNode.removeChild(rootRef.current);
      }
    };
  }, []);
  
  // Update notifications when they change
  useEffect(() => {
    if (!containerRootRef.current) return;
    
    containerRootRef.current.render(
      <div className="notification-container">
        {notifications.map(notification => (
          <Notification 
            key={notification.id} 
            notification={notification} 
            onClose={() => removeNotification(notification.id)} 
          />
        ))}
      </div>
    );
  }, [notifications, removeNotification]);
  
  return null;
}

/**
 * Componente individual de notificação
 */
function Notification({ notification, onClose }) {
  const { type, message, title } = notification;
  
  // Mapear tipos para classes CSS do Tailwind
  const typeClasses = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info'
  };
  
  return (
    <div className={`alert ${typeClasses[type] || 'alert-info'} shadow-lg mb-4 max-w-sm`}>
      {getIconForType(type)}
      <div>
        {title && <h3 className="font-bold">{title}</h3>}
        <div className="text-sm">{message}</div>
      </div>
      <button className="btn btn-circle btn-xs" onClick={onClose}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

/**
 * Helper para obter o ícone com base no tipo de notificação
 */
function getIconForType(type) {
  switch (type) {
    case 'success':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'error':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'warning':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case 'info':
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

/**
 * Hook para usar o sistema de notificações
 */
export function useNotification() {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotification deve ser usado dentro de NotificationProvider');
  }
  
  return context;
}

export default useNotification;
