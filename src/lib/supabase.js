import { createClient } from '@supabase/supabase-js'

// Inicializando o cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Credenciais do Supabase não definidas. Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local')
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

// Funções de autenticação
export const signUp = async (email, password, userData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData // Dados adicionais do usuário (nome, interesses, etc.)
      }
    })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro no cadastro:', error.message)
    return { data: null, error }
  }
}

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro no login:', error.message)
    return { data: null, error }
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Erro ao fazer logout:', error.message)
    return { error }
  }
}

// Funções para gerenciamento de leads
export const saveLeadInfo = async (userId, leadData) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([{ 
        user_id: userId,
        ...leadData,
        created_at: new Date()
      }])
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao salvar informações do lead:', error.message)
    return { data: null, error }
  }
}

export const getLeadInfo = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error // PGRST116 é o código de "não encontrado"
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao buscar informações do lead:', error.message)
    return { data: null, error }
  }
}

// Verificar sessão atual
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return { session: data.session, error: null }
  } catch (error) {
    console.error('Erro ao verificar sessão:', error.message)
    return { session: null, error }
  }
}

// Obter usuário atual
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { user, error: null }
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error.message)
    return { user: null, error }
  }
}

// Login com Google
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao autenticar com Google:', error.message)
    return { data: null, error }
  }
}
