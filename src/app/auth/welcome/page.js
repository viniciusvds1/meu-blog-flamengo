'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts'
import { useTheme, useNotification } from '@/hooks'
import Link from 'next/link'
import Image from 'next/image'
import { Inbox, Mail, AlertCircle, AlertTriangle, ExternalLink, CheckCircle, RefreshCw } from 'lucide-react'

export default function WelcomePage() {
  const { user, isLoading, resendVerificationEmail } = useAuth()
  const router = useRouter()
  const { theme } = useTheme()
  const { notify } = useNotification()
  const [resendCountdown, setResendCountdown] = useState(0)
  const [isResending, setIsResending] = useState(false)
  
  // Memorizamos a URL de redirecionamento dos emails
  const emailRedirectUrl = useMemo(() => {
    const emailDomain = user?.email?.split('@')[1]?.toLowerCase() || '';
    
    // Detectar serviço de email popular
    if (emailDomain.includes('gmail')) return 'https://mail.google.com/';
    if (emailDomain.includes('outlook') || emailDomain.includes('hotmail') || emailDomain.includes('live')) return 'https://outlook.live.com/';
    if (emailDomain.includes('yahoo')) return 'https://mail.yahoo.com/';
    if (emailDomain.includes('proton') || emailDomain.includes('pm.me')) return 'https://mail.proton.me/';
    if (emailDomain.includes('aol')) return 'https://mail.aol.com/';
    
    // Default para Gmail como opção mais popular
    return 'https://mail.google.com/';
  }, [user?.email]);
  
  // Função para reenviar email de verificação
  const handleResendEmail = useCallback(async () => {
    if (resendCountdown > 0 || !user?.email) return;
    
    try {
      setIsResending(true);
      await resendVerificationEmail();
      notify({
        type: 'success',
        title: 'Email reenviado!',
        message: 'Verifique sua caixa de entrada e pastas de spam.'
      });
      
      // Inicia contador para evitar múltiplos reenvios
      setResendCountdown(60); // 60 segundos
      const intervalId = setInterval(() => {
        setResendCountdown(prev => {
          if (prev <= 1) {
            clearInterval(intervalId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Cleanup do intervalo
      return () => clearInterval(intervalId);
    } catch (error) {
      console.error('Erro ao reenviar email:', error);
      notify({
        type: 'error',
        title: 'Erro ao reenviar',
        message: 'Não foi possível reenviar o email. Tente novamente mais tarde.'
      });
    } finally {
      setIsResending(false);
    }
  }, [resendCountdown, user?.email, resendVerificationEmail, notify]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary" aria-label="Carregando..."></span>
      </div>
    )
  }

  // Classes condicionais baseadas no tema
  const emailPreviewClasses = useMemo(() => {
    return theme === 'dark' 
      ? 'bg-gray-800 rounded-lg p-4 border border-gray-700 mb-4 text-gray-100' 
      : 'bg-white rounded-lg p-4 border border-gray-200 mb-4';
  }, [theme]);
  
  // Redirecionar para a página inicial se não houver usuário
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);
  
  // Se não houver usuário, não renderiza nada enquanto redireciona
  if (!user && !isLoading) return null;

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h1 className="text-3xl font-bold mb-6" id="welcome-title">
            Bem-vindo ao RubroNews!
          </h1>
          
          <div className="max-w-md mx-auto">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <Image 
                src="/assets/logooficialrubronews.webp" 
                alt="RubroNews Logo" 
                fill
                priority
                sizes="128px"
                style={{ objectFit: 'contain' }}
                className="transition-opacity duration-300"
              />
            </div>
            
            <div className="alert alert-success mb-6" role="alert">
              <CheckCircle className="stroke-current shrink-0 h-6 w-6" aria-hidden="true" />
              <span>Cadastro realizado com sucesso!</span>
            </div>
            
            <div className="card bg-base-200 shadow-md p-6 mb-8">
              <h2 className="flex items-center text-xl font-bold mb-4 text-flamengoRed" id="check-email">
                <Mail className="mr-2" aria-hidden="true" /> Verifique seu Email
              </h2>
              
              <p className="mb-4">
                Enviamos um email de confirmação para <strong>{user?.email}</strong>.
                Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
              </p>
              
              <div className="alert alert-warning mb-4" role="alert">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                <span>
                  O email pode levar alguns minutos para chegar. Verifique também sua pasta de <strong>spam</strong> ou <strong>lixo eletrônico</strong>.
                </span>
              </div>
              
              <div className={emailPreviewClasses} aria-label="Exemplo de email de confirmação">
                <div className="flex items-center mb-2">
                  <div className={`rounded-full p-1 mr-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <Inbox className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-semibold">De: RubroNews </div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Para: {user?.email}</div>
                  </div>
                </div>
                <div className={`text-sm mt-2 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} pt-2`}>
                  <strong>Assunto: </strong> Confirme seu email no RubroNews - Blog do Flamengo
                </div>
              </div>
              
              <a 
                href={emailRedirectUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm flex items-center justify-center mb-4"
                aria-label={`Abrir seu serviço de email (${emailRedirectUrl.split('//')[1].split('.')[0]})`}
              >
                <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" /> 
                Abrir seu Email
              </a>
              
              <button 
                onClick={handleResendEmail}
                disabled={resendCountdown > 0 || isResending}
                className="btn btn-sm w-full relative"
                aria-label="Reenviar email de confirmação"
              >
                {isResending ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                )}
                
                {resendCountdown > 0 
                  ? `Reenviar em ${resendCountdown}s` 
                  : 'Reenviar email de confirmação'}
              </button>
            </div>
            
            <p className="mb-6">
              Enquanto isso, você já pode continuar navegando pelo site e aproveitar todo o conteúdo exclusivo sobre o Mengão!
            </p>
            
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
