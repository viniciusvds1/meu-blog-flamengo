'use client'

import { AuthProvider } from '@/context/AuthContext'
import { NextAuthProvider } from '@/context/NextAuthContext'
import { SessionProvider } from 'next-auth/react'

export default function ProvidersWrapper({ children }) {
  return (
    <SessionProvider>
      <NextAuthProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </NextAuthProvider>
    </SessionProvider>
  )
}
