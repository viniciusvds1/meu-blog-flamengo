'use client';

import { createContext, useContext, useEffect, useReducer, useMemo, useCallback, useRef } from 'react';
import { 
  signIn as supabaseSignIn, 
  signUp as supabaseSignUp, 
  signOut as supabaseSignOut, 
  getCurrentSession, 
  getCurrentUser,
  saveLeadInfo,
  getLeadInfo,
  signInWithGoogle as supabaseSignInWithGoogle
} from '@/lib/supabase';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Estado inicial
const initialState = {
  user: null,
  session: null,
  leadInfo: null,
  isLoading: true,
  error: null,
  authSource: null, // 'supabase' ou 'nextauth'
};

// Ações do reducer
const AUTH_ACTIONS = {
  SET_USER: 'SET_USER',
  SET_SESSION: 'SET_SESSION',
  SET_LEAD_INFO: 'SET_LEAD_INFO',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_AUTH_SOURCE: 'SET_AUTH_SOURCE',
  CLEAR_USER: 'CLEAR_USER',
  RESET_ERROR: 'RESET_ERROR'
};

// Reducer para gerenciar estados de autenticação
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_USER:
      return { ...state, user: action.payload, isLoading: false };
    case AUTH_ACTIONS.SET_SESSION:
      return { ...state, session: action.payload, isLoading: false };
    case AUTH_ACTIONS.SET_LEAD_INFO:
      return { ...state, leadInfo: action.payload };
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case AUTH_ACTIONS.SET_AUTH_SOURCE:
      return { ...state, authSource: action.payload };
    case AUTH_ACTIONS.CLEAR_USER:
      return { ...state, user: null, session: null, leadInfo: null, isLoading: false, authSource: null };
    case AUTH_ACTIONS.RESET_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
}

// Criando o contexto
const AuthContext = createContext(undefined);

// Provider do contexto
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();
  const router = useRouter();
  const checkSessionRef = useRef(false);
  
  // Função para verificar sessão Supabase
  const checkSupabaseSession = useCallback(async () => {
    try {
      const { session, error: sessionError } = await getCurrentSession();
      
      if (sessionError) throw sessionError;
      
      if (session) {
        dispatch({ type: AUTH_ACTIONS.SET_SESSION, payload: session });
        dispatch({ type: AUTH_ACTIONS.SET_AUTH_SOURCE, payload: 'supabase' });
        
        const { user, error: userError } = await getCurrentUser();
        if (userError) throw userError;
        
        if (user) {
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
          
          // Buscar informações adicionais do lead
          const { data: leadInfo } = await getLeadInfo(user.id);
          if (leadInfo) {
            dispatch({ type: AUTH_ACTIONS.SET_LEAD_INFO, payload: leadInfo });
          }
        }
        
        return true; // Sessão encontrada
      }
      
      return false; // Nenhuma sessão encontrada
    } catch (error) {
      console.error('Erro ao verificar sessão Supabase:', error);
      return false;
    }
  }, []);

  // Verificar sessões de autenticação ao iniciar
  useEffect(() => {
    if (checkSessionRef.current) return; // Evitar verificação dupla
    
    const checkAuthSessions = async () => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        checkSessionRef.current = true;
        
        // Verificar sessão Supabase primeiro
        const hasSupabaseSession = await checkSupabaseSession();
        
        // Se não tem sessão Supabase, verificar NextAuth
        if (!hasSupabaseSession && nextAuthStatus === 'authenticated' && nextAuthSession) {
          dispatch({ type: AUTH_ACTIONS.SET_AUTH_SOURCE, payload: 'nextauth' });
          dispatch({ 
            type: AUTH_ACTIONS.SET_USER, 
            payload: {
              id: nextAuthSession.user.supabaseUserId || nextAuthSession.user.id,
              email: nextAuthSession.user.email,
              name: nextAuthSession.user.name,
              image: nextAuthSession.user.image,
            }
          });
          dispatch({ type: AUTH_ACTIONS.SET_SESSION, payload: nextAuthSession });
        }
        
        // Se nenhuma sessão encontrada, limpar usuário
        if (!hasSupabaseSession && nextAuthStatus !== 'authenticated') {
          dispatch({ type: AUTH_ACTIONS.CLEAR_USER });
        }
      } catch (error) {
        console.error('Erro ao verificar sessões:', error);
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
        dispatch({ type: AUTH_ACTIONS.CLEAR_USER });
      } finally {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };
    
    checkAuthSessions();
    
    return () => {
      checkSessionRef.current = false;
    };
  }, [checkSupabaseSession, nextAuthSession, nextAuthStatus]);
  
  // Função para login com Supabase
  const loginWithSupabase = useCallback(async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.RESET_ERROR });
      
      const { data, error } = await supabaseSignIn(email, password);
      if (error) throw error;
      
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: data.user });
      dispatch({ type: AUTH_ACTIONS.SET_SESSION, payload: data.session });
      dispatch({ type: AUTH_ACTIONS.SET_AUTH_SOURCE, payload: 'supabase' });
      
      // Buscar informações adicionais do lead
      if (data.user) {
        const { data: leadInfo } = await getLeadInfo(data.user.id);
        if (leadInfo) {
          dispatch({ type: AUTH_ACTIONS.SET_LEAD_INFO, payload: leadInfo });
        }
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro no login Supabase:', error);
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      return { data: null, error };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);
  
  // Função para login com NextAuth
  const loginWithNextAuth = useCallback(async (provider) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.RESET_ERROR });
      
      await nextAuthSignIn(provider, { callbackUrl: '/' });
      
      // NextAuth redirecionará, então o restante será tratado após o retorno
      return { error: null };
    } catch (error) {
      console.error(`Erro no login com ${provider} (NextAuth):`, error);
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      return { error };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);
  
  // Função para login geral (interface unificada)
  const login = useCallback(async (email, password) => {
    // Utilizamos Supabase para email/senha
    return loginWithSupabase(email, password);
  }, [loginWithSupabase]);
  
  // Função para login com Google
  const loginWithGoogle = useCallback(async () => {
    // Preferimos NextAuth para login com Google, mas podemos cair para Supabase
    try {
      return await loginWithNextAuth('google');
    } catch (error) {
      console.log('Erro no login com Google via NextAuth, tentando Supabase...');
      const { data, error: supabaseError } = await supabaseSignInWithGoogle();
      
      if (supabaseError) throw supabaseError;
      
      return { data, error: null };
    }
  }, [loginWithNextAuth]);
  
  // Função para registro (só com Supabase)
  const register = useCallback(async (email, password, userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.RESET_ERROR });
      
      const { data, error } = await supabaseSignUp(email, password, userData);
      if (error) throw error;
      
      // No Supabase, o usuário geralmente precisa confirmar o email
      // então não definimos o estado de autenticado aqui
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro no registro:', error);
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      return { data: null, error };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);
  
  // Função para logout
  const logout = useCallback(async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      if (state.authSource === 'supabase') {
        const { error } = await supabaseSignOut();
        if (error) throw error;
      } else if (state.authSource === 'nextauth') {
        await nextAuthSignOut({ callbackUrl: '/' });
      }
      
      dispatch({ type: AUTH_ACTIONS.CLEAR_USER });
      router.push('/');
      return { error: null };
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      return { error };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, [state.authSource, router]);
  
  // Função para atualizar dados de lead
  const updateLeadInfo = useCallback(async (leadData) => {
    try {
      if (!state.user) throw new Error('Usuário não autenticado');
      
      const { data, error } = await saveLeadInfo(state.user.id, leadData);
      if (error) throw error;
      
      dispatch({ type: AUTH_ACTIONS.SET_LEAD_INFO, payload: data });
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar dados do lead:', error);
      return { data: null, error };
    }
  }, [state.user]);
  
  // Valores memoizados para evitar renderizações desnecessárias
  const value = useMemo(() => ({
    user: state.user,
    session: state.session,
    leadInfo: state.leadInfo,
    isLoading: state.isLoading,
    isAuthenticated: !!state.user && (!!state.session || state.authSource === 'nextauth'),
    error: state.error,
    authSource: state.authSource,
    login,
    register,
    logout,
    updateLeadInfo,
    loginWithGoogle
  }), [
    state.user,
    state.session,
    state.leadInfo,
    state.isLoading,
    state.error,
    state.authSource,
    login,
    register,
    logout,
    updateLeadInfo,
    loginWithGoogle
  ]);
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
