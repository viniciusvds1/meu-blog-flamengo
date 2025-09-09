'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const NextAuthContext = createContext()

export function NextAuthProvider({ children }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true)
      return
    }

    if (status === 'authenticated' && session) {
      setUser({
        id: session.user.supabaseUserId || session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        isAuthenticated: true
      })
    } else {
      setUser(null)
    }
    
    setLoading(false)
  }, [session, status])

  // Login com Google usando NextAuth
  const loginWithGoogle = async () => {
    try {
      await signIn('google', { callbackUrl: '/' })
      return { error: null }
    } catch (error) {
      console.error('Erro ao fazer login com Google (NextAuth):', error)
      return { error }
    }
  }

  // Login com email/senha (vai usar Supabase)
  const login = async (email, password) => {
    // Implementar integração com Supabase se necessário
    console.log("Login com email não implementado no NextAuthContext")
    return { error: new Error("Login com email não implementado no NextAuthContext") }
  }

  // Registro com email/senha (vai usar Supabase)
  const register = async (email, password, userData) => {
    // Implementar integração com Supabase se necessário
    console.log("Registro não implementado no NextAuthContext")
    return { error: new Error("Registro não implementado no NextAuthContext") }
  }

  // Logout
  const logout = async () => {
    try {
      await signOut({ callbackUrl: '/' })
      return { error: null }
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      return { error }
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    loginWithGoogle,
    register,
    logout
  }

  return (
    <NextAuthContext.Provider value={value}>
      {children}
    </NextAuthContext.Provider>
  )
}

export function useNextAuth() {
  const context = useContext(NextAuthContext)
  if (context === undefined) {
    throw new Error('useNextAuth deve ser usado dentro de NextAuthProvider')
  }
  return context
}
