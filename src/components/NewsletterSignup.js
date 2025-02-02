'use client'

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setErrorMessage('Por favor, insira seu e-mail');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Por favor, insira um e-mail válido');
      return;
    }

    setStatus('loading');
    
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert([
          { email: email, subscribed_at: new Date().toISOString() }
        ])
        .select();

      if (error) throw error;
      
      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setErrorMessage('Ocorreu um erro ao salvar seu e-mail. Tente novamente mais tarde.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-white border-2 border-red-600 p-6 rounded-xl shadow-sm">
        <div className="flex flex-col items-center text-center space-y-3">
          <CheckCircle className="w-12 h-12 text-green-500" />
          <h3 className="text-xl font-bold text-gray-800">Inscrição confirmada!</h3>
          <p className="text-gray-600">
            Obrigado por se inscrever. Você receberá todas as novidades do Mengão!
          </p>
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

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input 
            type="email" 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error') {
                setStatus('idle');
                setErrorMessage('');
              }
            }}
            placeholder="Seu melhor e-mail" 
            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-offset-2
              ${status === 'error' 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-200 focus:border-red-600 focus:ring-red-600'
              }
            `}
            disabled={status === 'loading'}
          />
          {status === 'error' && (
            <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <button 
          type="submit"
          disabled={status === 'loading'}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg
            font-semibold transition-all duration-200
            ${status === 'loading'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800'
            }
          `}
        >
          {status === 'loading' ? (
            <>
              <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
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