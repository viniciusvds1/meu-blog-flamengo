'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useNextAuth } from '@/context/NextAuthContext'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { login } = useAuth()
  const { loginWithGoogle: nextAuthGoogleLogin } = useNextAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login(email, password)
      if (result.error) {
        throw new Error(result.error.message || 'Erro ao fazer login')
      }
      
      // Redireciona para a dashboard ou home
      router.push('/')
    } catch (error) {
      console.error('Erro no login:', error)
      setError('Email ou senha inválidos. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleLogin = async () => {
    try {
      setError('')
      setGoogleLoading(true)
      
      // Usando o NextAuth para login com Google
      await nextAuthGoogleLogin()
      // O redirecionamento para o Google acontece automaticamente via NextAuth
      // O callback do NextAuth irá redirecionar para a página inicial após o login bem-sucedido
    } catch (error) {
      console.error('Erro no login com Google (NextAuth):', error)
      setError('Erro ao conectar com Google. Tente novamente.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="card w-full max-w-sm bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-center mb-6">
          Entre no RubroNews
        </h2>
        
        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered"
              required
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Senha</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered"
              required
            />
            <label className="label">
              <Link href="/auth/reset-password" className="label-text-alt link link-hover">
                Esqueceu a senha?
              </Link>
            </label>
          </div>
          
          <div className="form-control mt-6">
            <button 
              type="submit" 
              className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
          
          <div className="divider">OU</div>
          
          <button 
            type="button"
            className={`btn btn-outline w-full ${googleLoading ? 'loading' : ''}`}
            onClick={handleGoogleLogin}
            disabled={isLoading || googleLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="w-4 h-4 mr-2">
              <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
            </svg>
            Continuar com Google
          </button>
          
          <div className="text-center mt-4">
            <p>Não tem uma conta? <Link href="/auth/register" className="link link-primary">Cadastre-se</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}
