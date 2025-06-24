'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { Inbox, Mail, AlertCircle, AlertTriangle, ExternalLink, CheckCircle } from 'lucide-react'

export default function WelcomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h1 className="text-3xl font-bold mb-6">
            Bem-vindo ao RubroNews!
          </h1>
          
          <div className="max-w-md mx-auto">
            <img 
              src="/assets/logooficialrubronews.png" 
              alt="RubroNews Logo" 
              className="w-32 h-32 object-contain mx-auto mb-6" 
            />
            
            <div className="alert alert-success mb-6">
              <CheckCircle className="stroke-current shrink-0 h-6 w-6" />
              <span>Cadastro realizado com sucesso!</span>
            </div>
            
            <div className="card bg-base-200 shadow-md p-6 mb-8">
              <h2 className="flex items-center text-xl font-bold mb-4 text-flamengoRed">
                <Mail className="mr-2" /> Verifique seu Email
              </h2>
              
              <p className="mb-4">
                Enviamos um email de confirmação para <strong>{user?.email}</strong>.
                Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
              </p>
              
              <div className="alert alert-warning mb-4">
                <AlertTriangle className="h-5 w-5" />
                <span>
                  O email pode levar alguns minutos para chegar. Verifique também sua pasta de <strong>spam</strong> ou <strong>lixo eletrônico</strong>.
                </span>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                <div className="flex items-center mb-2">
                  <div className="bg-gray-200 rounded-full p-1 mr-2">
                    <Inbox className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">De: RubroNews </div>
                    <div className="text-sm text-gray-500">Para: {user?.email}</div>
                  </div>
                </div>
                <div className="text-sm mt-2 border-t pt-2">
                  <strong>Assunto: </strong> Confirme seu email no RubroNews - Blog do Flamengo
                </div>
              </div>
              
              <a 
                href="https://mail.google.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm flex items-center mb-2"
              >
                <ExternalLink className="h-4 w-4 mr-2" /> Abrir Gmail
              </a>
              
              <a 
                href="https://outlook.live.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" /> Abrir Outlook
              </a>
            </div>
            
            <p className="mb-6">
              Enquanto isso, você já pode continuar navegando pelo site e aproveitar todo o conteúdo exclusivo sobre o Mengão!
            </p>
            
            <div className="alert alert-info">
              <AlertCircle className="h-5 w-5" />
              <span>
                Não recebeu o email? Verifique se o endereço está correto ou tente fazer login novamente para reenviar a verificação.
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Link href="/" className="btn btn-primary">
                Voltar para o início
              </Link>
              
              <Link href="/noticias" className="btn btn-outline">
                Ver últimas notícias
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
