'use client'

import { createContext, useContext, useEffect, useReducer, useMemo, useCallback } from 'react'
import { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentSession, 
  getCurrentUser,
  saveLeadInfo,
  getLeadInfo,
  signInWithGoogle
} from '@/lib/supabase'

// Estado inicial
const initialState = {
  user: null,
  session: null,
  leadInfo: null,
  isLoading: true,
  error: null
}

// Ações do reducer
const AUTH_ACTIONS = {
  SET_USER: 'SET_USER',
  SET_SESSION: 'SET_SESSION',
  SET_LEAD_INFO: 'SET_LEAD_INFO',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_USER: 'CLEAR_USER',
  RESET_ERROR: 'RESET_ERROR'
}

// Reducer para gerenciar estados de autenticação
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_USER:
      return { ...state, user: action.payload, isLoading: false }
    case AUTH_ACTIONS.SET_SESSION:
      return { ...state, session: action.payload, isLoading: false }
    case AUTH_ACTIONS.SET_LEAD_INFO:
      return { ...state, leadInfo: action.payload }
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload }
    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false }
    case AUTH_ACTIONS.CLEAR_USER:
      return { ...state, user: null, session: null, leadInfo: null, isLoading: false }
    case AUTH_ACTIONS.RESET_ERROR:
      return { ...state, error: null }
    default:
      return state
  }
}

// Criando o contexto
const AuthContext = createContext(undefined)

// Provider do contexto
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  
  // Verificar sessão ao iniciar
  useEffect(() => {
    const checkSession = async () => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
        
        // Verificar sessão e usuário atual
        const { session, error: sessionError } = await getCurrentSession()
        
        if (sessionError) throw sessionError
        
        if (session) {
          dispatch({ type: AUTH_ACTIONS.SET_SESSION, payload: session })
          
          const { user, error: userError } = await getCurrentUser()
          if (userError) throw userError
          
          if (user) {
            dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user })
            
            // Buscar informações adicionais do lead
            const { data: leadInfo } = await getLeadInfo(user.id)
            if (leadInfo) {
              dispatch({ type: AUTH_ACTIONS.SET_LEAD_INFO, payload: leadInfo })
            }
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.CLEAR_USER })
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message })
        dispatch({ type: AUTH_ACTIONS.CLEAR_USER })
      } finally {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
      }
    }
    
    checkSession()
    
    // Opcional: Implementar listener para mudanças de autenticação em tempo real (Supabase)
    // Este código seria adicionado aqui quando necessário
  }, [])
  
  // Função para login
  const login = useCallback(async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: AUTH_ACTIONS.RESET_ERROR })
      
      const { data, error } = await signIn(email, password)
      if (error) throw error
      
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: data.user })
      dispatch({ type: AUTH_ACTIONS.SET_SESSION, payload: data.session })
      
      // Buscar informações adicionais do lead
      if (data.user) {
        const { data: leadInfo } = await getLeadInfo(data.user.id)
        if (leadInfo) {
          dispatch({ type: AUTH_ACTIONS.SET_LEAD_INFO, payload: leadInfo })
        }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Erro no login:', error)
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message })
      return { data: null, error }
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
    }
  }, [])
  
  // Função para registro
  const register = useCallback(async (email, password, userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: AUTH_ACTIONS.RESET_ERROR })
      
      const { data, error } = await signUp(email, password, userData)
      if (error) throw error
      
      // No Supabase, o usuário geralmente precisa confirmar o email
      // então não definimos o estado de autenticado aqui
      
      return { data, error: null }
    } catch (error) {
      console.error('Erro no registro:', error)
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message })
      return { data: null, error }
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
    }
  }, [])
  
  // Função para logout
  const logout = useCallback(async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
      
      const { error } = await signOut()
      if (error) throw error
      
      dispatch({ type: AUTH_ACTIONS.CLEAR_USER })
      return { error: null }
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message })
      return { error }
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
    }
  }, [])
  
  // Função para atualizar dados de lead
  const updateLeadInfo = useCallback(async (leadData) => {
    try {
      if (!state.user) throw new Error('Usuário não autenticado')
      
      const { data, error } = await saveLeadInfo(state.user.id, leadData)
      if (error) throw error
      
      dispatch({ type: AUTH_ACTIONS.SET_LEAD_INFO, payload: data })
      return { data, error: null }
    } catch (error) {
      console.error('Erro ao atualizar dados do lead:', error)
      return { data: null, error }
    }
  }, [state.user])
  
  // Função para login com Google
  const loginWithGoogle = useCallback(async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: AUTH_ACTIONS.RESET_ERROR })
      
      const { data, error } = await signInWithGoogle()
      if (error) throw error
      
      // Com OAuth, não recebemos dados do usuário imediatamente
      // O usuário será redirecionado para o Google e depois de volta para a página de callback
      // Onde a sessão será processada
      
      return { data, error: null }
    } catch (error) {
      console.error('Erro no login com Google:', error)
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message })
      return { data: null, error }
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
    }
  }, [])
  
  // Valores memoizados para evitar renderizações desnecessárias
  const value = useMemo(() => ({
    user: state.user,
    session: state.session,
    leadInfo: state.leadInfo,
    isLoading: state.isLoading,
    isAuthenticated: !!state.user && !!state.session,
    error: state.error,
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
    login,
    register,
    logout,
    updateLeadInfo,
    loginWithGoogle
  ])
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
