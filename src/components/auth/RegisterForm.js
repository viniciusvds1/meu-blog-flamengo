'use client'

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts'
import { useForm, useNotification, useTheme } from '@/hooks'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function RegisterForm() {
  const router = useRouter()
  const { register, login, loginWithGoogle } = useAuth()
  const { theme } = useTheme()
  const { notify } = useNotification()
  const [googleLoading, setGoogleLoading] = useState(false)
  
  // Validação do formulário
  const validationSchema = useMemo(() => {
    return {
      name: (value) => {
        if (!value) return 'Nome é obrigatório';
        if (value.length < 3) return 'Nome deve ter pelo menos 3 caracteres';
        return '';
      },
      email: (value) => {
        if (!value) return 'Email é obrigatório';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Email inválido';
        }
        return '';
      },
      password: (value) => {
        if (!value) return 'Senha é obrigatória';
        if (value.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
        return '';
      },
      acceptTerms: (value) => {
        return value === true ? '' : 'Você precisa aceitar os termos e condições';
      }
    };
  }, [])
  
  // Inicialização do useForm
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue
  } = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      interests: [],
      acceptTerms: false
    },
    validationSchema,
    validateOnChange: true, // Habilitando validação em tempo real
    validateOnBlur: true,
    onSubmit: async (formData) => {
      try {
        const userData = {
          name: formData.name,
          interests: formData.interests,
          created_at: new Date().toISOString(),
          user_type: 'lead',
        }

        // Registro do usuário
        const result = await register(formData.email, formData.password, userData)
        if (result.error) {
          throw new Error(result.error.message || 'Erro ao cadastrar usuário')
        }
        
        notify({
          type: 'success',
          title: 'Cadastro realizado!',
          message: 'Sua conta foi criada com sucesso.'
        })
        
        // Login automático após o cadastro
        const loginResult = await login(formData.email, formData.password)
        if (loginResult.error) {
          console.warn('Usuário registrado, mas falha no login automático:', loginResult.error)
          notify({
            type: 'warning',
            title: 'Login automático falhou',
            message: 'Por favor, faça login manualmente.'
          })
        } else {
          console.log('Usuário registrado e logado com sucesso')
        }
        
        // Sempre redirecionar para a página de confirmação de email
        router.push('/auth/welcome')
      } catch (error) {
        console.error('Erro no cadastro:', error)
        notify({
          type: 'error',
          title: 'Erro no cadastro',
          message: error.message || 'Ocorreu um erro durante o cadastro.'
        })
      }
    }
  })

  // Interesses relacionados ao Flamengo que os usuários podem selecionar
  const interestOptions = [
    { id: 'news', label: 'Notícias diárias' },
    { id: 'transfers', label: 'Transferências' },
    { id: 'youth', label: 'Categorias de base' },
    { id: 'statistics', label: 'Estatísticas' },
    { id: 'history', label: 'História do clube' }
  ]
  
  // Handler personalizado para interesses (checkboxes)
  const handleInterestChange = useCallback((e) => {
    const { value, checked } = e.target;
    
    setFieldValue('interests', checked 
      ? [...values.interests, value] 
      : values.interests.filter(interest => interest !== value)
    );
  }, [values.interests, setFieldValue]);
  
  const handleGoogleLogin = useCallback(async () => {
    try {
      setGoogleLoading(true)
      
      const result = await loginWithGoogle()
      if (result.error) {
        throw new Error(result.error.message || 'Erro ao fazer login com Google')
      }
      
      // O redirecionamento para o Google acontece automaticamente
      // O callback irá redirecionar para a página inicial após o login bem-sucedido
      notify({
        type: 'info',
        title: 'Redirecionando...',
        message: 'Você será redirecionado para o Google para fazer login.'
      })
    } catch (error) {
      console.error('Erro no login com Google:', error)
      notify({
        type: 'error',
        title: 'Falha na autenticação',
        message: 'Erro ao conectar com Google. Tente novamente.'
      })
      setGoogleLoading(false)
    }
  }, [loginWithGoogle, notify]);

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-center mb-6" id="register-title">
          Cadastre-se no RubroNews
        </h2>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-control">
            <label htmlFor="name" className="label">
              <span className="label-text">Nome Completo</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input input-bordered ${touched.name && errors.name ? 'input-error' : ''}`}
              aria-required="true"
              aria-invalid={touched.name && errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
              disabled={isSubmitting || googleLoading}
            />
            {touched.name && errors.name && (
              <div className="text-error text-xs mt-1" id="name-error" role="alert">
                <AlertCircle className="inline mr-1" size={12} />
                {errors.name}
              </div>
            )}
          </div>
          
          <div className="form-control mt-3">
            <label htmlFor="email" className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input input-bordered ${touched.email && errors.email ? 'input-error' : ''}`}
              aria-required="true"
              aria-invalid={touched.email && errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              disabled={isSubmitting || googleLoading}
            />
            {touched.email && errors.email && (
              <div className="text-error text-xs mt-1" id="email-error" role="alert">
                <AlertCircle className="inline mr-1" size={12} />
                {errors.email}
              </div>
            )}
          </div>
          
          <div className="form-control mt-3">
            <label htmlFor="password" className="label">
              <span className="label-text">Senha</span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input input-bordered ${touched.password && errors.password ? 'input-error' : ''}`}
              aria-required="true"
              aria-invalid={touched.password && errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'password-error' : 'password-hint'}
              disabled={isSubmitting || googleLoading}
            />
            {touched.password && errors.password ? (
              <div className="text-error text-xs mt-1" id="password-error" role="alert">
                <AlertCircle className="inline mr-1" size={12} />
                {errors.password}
              </div>
            ) : (
              <label className="label pt-1" id="password-hint">
                <span className="label-text-alt">Mínimo de 6 caracteres</span>
              </label>
            )}
          </div>
          
          <div className="form-control mt-3">
            <label className="label">
              <span className="label-text font-medium">Interesses</span>
              <span className="label-text-alt">Opcional</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {interestOptions.map(option => (
                <label key={option.id} className="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    name="interests"
                    value={option.id}
                    checked={values.interests.includes(option.id)}
                    onChange={handleInterestChange}
                    disabled={isSubmitting || googleLoading}
                  />
                  <span className="label-text">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="form-control mt-4">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                id="accept-terms"
                type="checkbox"
                name="acceptTerms"
                checked={values.acceptTerms}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`checkbox ${touched.acceptTerms && errors.acceptTerms ? 'checkbox-error' : 'checkbox-primary'}`}
                aria-required="true"
                aria-invalid={touched.acceptTerms && errors.acceptTerms ? 'true' : 'false'}
                aria-describedby={errors.acceptTerms ? 'terms-error' : undefined}
                disabled={isSubmitting || googleLoading}
              />
              <span className="label-text">
                Aceito os <Link href="/termos" className="link link-primary">termos e condições</Link>
              </span>
            </label>
            {touched.acceptTerms && errors.acceptTerms && (
              <div className="text-error text-xs mt-1" id="terms-error" role="alert">
                <AlertCircle className="inline mr-1" size={12} />
                {errors.acceptTerms}
              </div>
            )}
          </div>
          
          <div className="form-control mt-6">
            <button 
              type="submit" 
              className="btn btn-primary relative"
              disabled={isSubmitting || googleLoading}
              aria-label={isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-xs absolute left-4"></span>
                  <span>Cadastrando...</span>
                </>
              ) : 'Cadastrar'}
            </button>
          </div>
          
          <div className="divider mt-6">OU</div>
          
          <button 
            type="button"
            className="btn btn-outline w-full relative"
            onClick={handleGoogleLogin}
            disabled={isSubmitting || googleLoading}
            aria-label="Continuar com Google"
          >
            {googleLoading ? (
              <span className="loading loading-spinner loading-xs absolute left-4"></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="w-4 h-4 mr-2" aria-hidden="true">
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
              </svg>
            )}
            {googleLoading ? 'Conectando...' : 'Continuar com Google'}
          </button>
          
          <div className="text-center mt-4">
            <p>Já tem uma conta? <Link href="/auth/login" className="link link-primary" aria-label="Ir para página de login">Entrar</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}
