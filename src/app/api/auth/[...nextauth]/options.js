import GoogleProvider from 'next-auth/providers/google'
import { supabase } from '@/lib/supabase'

// Para integrar NextAuth com Supabase
async function linkSupabaseAccount(token, account, profile) {
  try {
    // Verificar se o usuário já existe no Supabase
    const { data: supabaseUser, error: findError } = await supabase.auth.admin.getUserByEmail(profile.email)
    
    // Se o usuário não existir no Supabase, crie-o
    if (findError || !supabaseUser) {
      const { error } = await supabase.auth.admin.createUser({
        email: profile.email,
        email_verified: true,
        user_metadata: {
          name: profile.name,
          avatar_url: profile.picture,
          provider: account.provider,
          provider_id: account.providerAccountId,
        }
      })
      
      if (error) {
        console.error('Erro ao criar usuário Supabase:', error)
      }
    }
    
    // Dados personalizados para o token do NextAuth
    return {
      ...token,
      supabaseUserId: supabaseUser?.id || null
    }
  } catch (error) {
    console.error('Erro ao vincular conta Supabase:', error)
    return token
  }
}

// Base URL para o site em produção ou localhost durante desenvolvimento
const baseUrl = process.env.NEXTAUTH_URL || 'https://www.orubronegronews.com'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '80028377498-7704rq7acorlfihf31i5bpaf9krm9v5p.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: { params: { prompt: "consent", access_type: "offline", response_type: "code" } }
    }),
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Vincular conta Supabase quando o usuário faz login com Google
      if (account && profile) {
        token = await linkSupabaseAccount(token, account, profile)
      }
      return token
    },
    async session({ session, token }) {
      // Adicionar identificador Supabase à sessão
      if (session.user) {
        session.user.supabaseUserId = token.supabaseUserId || null
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
}
