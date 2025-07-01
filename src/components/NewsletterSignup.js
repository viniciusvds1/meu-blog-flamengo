'use client'

import { useState, memo } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useForm, useNotification } from '@/hooks';

function NewsletterSignupComponent() {
  const { notify } = useNotification();
  const [showSuccess, setShowSuccess] = useState(false);

  // Validação para o campo de email
  const validationSchema = {
    email: (value) => {
      if (!value) return 'E-mail é obrigatório';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Digite um e-mail válido';
      }
      return '';
    }
  };

  // Função para processar o formulário
  const handleNewsletterSubmit = async (values, { setSubmitting }) => {
    try {
      // Notificar início do processo
      notify({
        type: 'info',
        title: 'Processando...',
        message: 'Inscrevendo seu email na newsletter',
        duration: 2000
      });

      // Realizar inserção no Supabase
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([
          { email: values.email, subscribed_at: new Date().toISOString() }
        ]);

      if (error) throw error;
      
      // Notificar sucesso
      notify({
        type: 'success',
        title: 'Inscrição confirmada!',
        message: 'Você receberá todas as novidades do Mengão!',
        duration: 5000
      });
      
      // Mostrar tela de sucesso
      setShowSuccess(true);
    } catch (error) {
      console.error('Erro ao salvar email:', error);
      
      // Verificar tipo de erro
      let errorMessage = 'Ocorreu um erro ao salvar seu e-mail. Tente novamente mais tarde.';
      
      // Verifica se o erro é de email duplicado (assumindo constraint unique)
      if (error?.code === '23505' || error?.message?.includes('unique')) {
        errorMessage = 'Este email já está inscrito em nossa newsletter.';
      }
      
      // Notificar erro
      notify({
        type: 'error',
        title: 'Falha na inscrição',
        message: errorMessage
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Usando nosso hook personalizado useForm
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm({
    initialValues: {
      email: ''
    },
    validationSchema,
    onSubmit: handleNewsletterSubmit
  });

  if (showSuccess) {
    return (
      <div className="bg-white border-2 border-red-600 p-6 rounded-xl shadow-sm animate-fade-in">
        <div className="flex flex-col items-center text-center space-y-3">
          <CheckCircle className="w-12 h-12 text-green-500" />
          <h3 className="text-xl font-bold text-gray-800">Inscrição confirmada!</h3>
          <p className="text-gray-600">
            Obrigado por se inscrever. Você receberá todas as novidades do Mengão!
          </p>
          <button 
            onClick={() => setShowSuccess(false)}
            className="mt-2 text-sm px-4 py-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-red-600 p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        Fique por dentro das novidades
      </h3>
      <p className="text-gray-600 mb-4">
        Receba as últimas notícias do Mengão diretamente no seu e-mail
      </p>

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <div className="relative">
          <input 
            type="email"
            id="newsletter-email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Seu melhor e-mail" 
            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-offset-2
              ${touched.email && errors.email 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-200 focus:border-red-600 focus:ring-red-600'
              }
            `}
            disabled={isSubmitting}
            aria-invalid={touched.email && errors.email ? 'true' : 'false'}
            aria-describedby={touched.email && errors.email ? 'newsletter-email-error' : undefined}
          />
          {touched.email && errors.email && (
            <div 
              id="newsletter-email-error"
              className="flex items-center gap-1 mt-1 text-red-500 text-sm"
              aria-live="polite"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg
            font-semibold transition-all duration-200
            ${isSubmitting
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800'
            }
          `}
          aria-busy={isSubmitting ? 'true' : 'false'}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              <span>Processando...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Inscrever</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default memo(NewsletterSignupComponent);