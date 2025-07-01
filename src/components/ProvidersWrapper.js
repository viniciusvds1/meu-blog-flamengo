'use client'

import { AuthProvider } from '@/contexts'
import { NotificationProvider } from '@/hooks'
import { SessionProvider } from 'next-auth/react'

/**
 * Componente que agrupa todos os providers da aplicação
 * Necessário para definir a ordem correta de aninhamento dos providers
 */
export default function ProvidersWrapper({ children }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </AuthProvider>
    </SessionProvider>
  )
}
