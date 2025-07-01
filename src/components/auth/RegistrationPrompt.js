'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts'

export default function RegistrationPrompt() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  
  // Mostrar modal apenas se o usuário não estiver logado
  // e após 5 segundos na página
  useEffect(() => {
    // Não mostrar o modal se o usuário já estiver logado
    if (isAuthenticated) return
    
    // Verificar se o modal já foi mostrado hoje
    const lastShown = localStorage.getItem('registrationPrompt')
    const today = new Date().toDateString()
    
    if (lastShown !== today) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        // Guardar que o modal foi mostrado hoje
        localStorage.setItem('registrationPrompt', today)
      }, 5000) // 5 segundos
      
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated])
  
  const closeModal = () => {
    setIsOpen(false)
  }
  
  const handleRegister = () => {
    router.push('/auth/register')
    closeModal()
  }
  
  const handleLogin = () => {
    router.push('/auth/login')
    closeModal()
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <button
            onClick={closeModal}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </button>
          
          <h2 className="card-title text-flamengo-red">Seja um Rubro-Negro Premium!</h2>
          
          <div className="py-2">
            <p className="mb-4">
              Crie sua conta gratuita e tenha acesso a conteúdo exclusivo sobre o Mengão!
            </p>
            
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Notícias em primeira mão</li>
              <li>Análises táticas exclusivas</li>
              <li>Informações sobre transferências</li>
              <li>Newsletters personalizadas</li>
            </ul>
          </div>
          
          <div className="card-actions justify-between mt-2">
            <button 
              className="btn btn-outline btn-sm" 
              onClick={closeModal}
            >
              Depois
            </button>
            
            <div className="space-x-2">
              <button 
                className="btn btn-outline btn-sm"
                onClick={handleLogin}
              >
                Entrar
              </button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={handleRegister}
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
