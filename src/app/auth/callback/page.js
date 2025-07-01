'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts'

export default function AuthCallbackPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  
  useEffect(() => {
    // Depois de processar o callback, o contexto de auth deve ser atualizado
    // Redirecionamos para a página inicial quando o usuário estiver definido
    const checkAuthAndRedirect = async () => {
      if (!isLoading) {
        if (user) {
          router.push('/')
        } else {
          // Se ainda não há usuário após o callback, algo deu errado
          // Pode ser necessário algum tempo para que o supabase processe
          setTimeout(() => {
            if (user) {
              router.push('/')
            } else {
              router.push('/auth/login?error=auth_callback_failed')
            }
          }, 2000) // esperamos 2 segundos adicionais
        }
      }
    }
    
    checkAuthAndRedirect()
  }, [user, isLoading, router])
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-flamengoRed"></span>
        <p className="mt-4 text-xl">Autenticando...</p>
        <p className="mt-2 text-sm text-gray-500">Você será redirecionado automaticamente.</p>
      </div>
    </div>
  )
}
