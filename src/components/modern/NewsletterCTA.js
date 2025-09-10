'use client';

import { useState } from 'react';
import { Mail, Check, ArrowRight, Trophy, Users, Star } from 'lucide-react';

const NewsletterCTA = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  const benefits = [
    { icon: Trophy, text: 'Notícias em primeira mão' },
    { icon: Users, text: 'Conteúdo exclusivo sobre o elenco' },
    { icon: Star, text: 'Análises especiais de jogos' }
  ];

  if (isSubscribed) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 text-white text-center">
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-2">Bem-vindo à família!</h3>
          <p className="text-green-100">
            Você receberá as melhores notícias do Mengão no seu email
          </p>
        </div>
        
        {/* Background decoration */}
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-black rounded-3xl p-8 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Mail size={24} />
              </div>
              <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                GRATUITO
              </span>
            </div>

            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Fique por dentro de <span className="text-yellow-400">tudo</span> do Mengão
            </h3>
            
            <p className="text-red-100 text-lg mb-6">
              Receba notícias exclusivas, análises e bastidores direto no seu email. 
              Mais de <strong>50.000</strong> rubro-negros já assinam!
            </p>

            {/* Benefits */}
            <div className="space-y-3 mb-6">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <IconComponent size={20} className="text-yellow-400" />
                    <span className="text-red-100">{benefit.text}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 text-sm text-red-200">
              <span>✓ Sem spam</span>
              <span>✓ Cancele quando quiser</span>
              <span>✓ 100% gratuito</span>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Seu melhor email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-4 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-400 text-black py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black" />
                    Inscrevendo...
                  </>
                ) : (
                  <>
                    Quero receber notícias!
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-red-200 mt-3 text-center">
              Ao assinar, você concorda com nossa política de privacidade
            </p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-yellow-400/20 rounded-full" />
      <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full" />
    </div>
  );
};

export default NewsletterCTA;