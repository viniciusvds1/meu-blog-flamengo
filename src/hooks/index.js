// Exportando todos os hooks para facilitar imports

// Hook de formatação de data
export { default as useFormatDate } from './useFormatDate';

// Hook de tema (claro/escuro)
export { default as useTheme } from './useTheme';

// Hooks de responsividade
export { 
  default as useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLargeDesktop
} from './useMediaQuery';

// Hook de scroll
export { default as useScrollPosition } from './useScrollPosition';

// Hooks de storage
export { 
  default as useStorage,
  useLocalStorage,
  useSessionStorage
} from './useStorage';

// Hook de formulário
export { default as useForm } from './useForm';

// Hook de notificações
export { default as useNotification, NotificationProvider } from './useNotification';
