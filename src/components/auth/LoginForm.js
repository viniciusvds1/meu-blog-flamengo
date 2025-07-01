'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts'
import { useForm, useNotification } from '@/hooks'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()
  const { login, loginWithGoogle } = useAuth()
  const { notify } = useNotification()
  const [googleLoading, setGoogleLoading] = useState(false)
  
  // Validações para o formulário
  const validationSchema = {
    email: (value) => {
      if (!value) return 'Email é obrigatório';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido';
      return '';
    },
    password: (value) => {
      if (!value) return 'Senha é obrigatória';
      if (value.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
      return '';
    }
  };
  
  // Função para tratar o login
  const handleLoginSubmit = useCallback(async (values, { setSubmitting, setErrors }) => {
    try {
      const result = await login(values.email, values.password)
      if (result.error) {
        throw new Error(result.error.message || 'Erro ao fazer login')
      }
      
      notify({
        type: 'success',
        title: 'Login realizado com sucesso!',
        message: 'Você será redirecionado para a página inicial.'
      })
      
      // Redireciona para a dashboard ou home
      router.push('/')
    } catch (error) {
      console.error('Erro no login:', error)
      notify({
        type: 'error',
        title: 'Falha no login',
        message: 'Email ou senha inválidos. Tente novamente.'
      })
      setErrors({ form: 'Email ou senha inválidos. Tente novamente.' })
    } finally {
      setSubmitting(false)
    }
  }, [login, notify, router])
  
  // Usando o hook useForm para gerenciar o estado e validações do formulário
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldError
  } = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true, // Habilitando validação em tempo real
    onSubmit: handleLoginSubmit
  })

  // O handleSubmit agora é gerenciado pelo hook useForm
  
  const handleGoogleLogin = useCallback(async () => {
    try {
      setGoogleLoading(true)
      
      // Usando nosso contexto unificado para login com Google
      await loginWithGoogle()
      // O redirecionamento para o Google acontece automaticamente via NextAuth
      // O callback do NextAuth irá redirecionar para a página inicial após o login bem-sucedido
      
      notify({
        type: 'info',
        title: 'Redirecionando para Google',
        message: 'Você será redirecionado para fazer login com sua conta Google.'
      })
    } catch (error) {
      console.error('Erro no login com Google:', error)
      notify({
        type: 'error',
        title: 'Falha na autenticação',
        message: 'Não foi possível conectar com Google. Tente novamente.'
      })
      setGoogleLoading(false)
    }
  }, [loginWithGoogle, notify])

  return (
    <div className="card w-full max-w-sm bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-center mb-6">
          Entre no RubroNews
        </h2>
        
        {errors.form && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{errors.form}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input input-bordered ${touched.email && errors.email ? 'input-error' : ''}`}
              disabled={isSubmitting}
              aria-label="Email"
              aria-invalid={touched.email && errors.email ? 'true' : 'false'}
            />
            {touched.email && errors.email && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.email}</span>
              </label>
            )}
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Senha</span>
            </label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input input-bordered ${touched.password && errors.password ? 'input-error' : ''}`}
              disabled={isSubmitting}
              aria-label="Senha"
              aria-invalid={touched.password && errors.password ? 'true' : 'false'}
            />
            {touched.password && errors.password && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.password}</span>
              </label>
            )}
            <label className="label">
              <Link href="/auth/reset-password" className="label-text-alt link link-hover">
                Esqueceu a senha?
              </Link>
            </label>
          </div>
          
          <div className="form-control mt-6">
            <button 
              type="submit" 
              className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
              aria-label="Entrar"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
          
          <div className="divider">OU</div>
          
          <button 
            type="button"
            className={`btn btn-outline w-full ${googleLoading ? 'loading' : ''}`}
            onClick={handleGoogleLogin}
            disabled={isSubmitting || googleLoading}
            aria-label="Continuar com Google"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="w-4 h-4 mr-2" aria-hidden="true">
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
