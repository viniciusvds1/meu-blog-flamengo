"use client";
import { useState, useEffect } from 'react';
import { COLORS } from '@/constants/theme';
import ArticleAd from './ArticleAd';
import SidebarAd from './SidebarAd';
import AdBanner from './AdBanner';

/**
 * Layout otimizado para pu00e1ginas de artigos com posicionamento estratu00e9gico de anu00fancios
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteu00fado do artigo
 * @param {string} props.className - Classes CSS adicionais
 * @returns {JSX.Element} - Layout otimizado para artigos
 */
const ArticleLayout = ({ children, className = '' }) => {
  const [paragraphs, setParagraphs] = useState([]);
  const [isDesktop, setIsDesktop] = useState(false);
  
  // Verifica o tamanho da tela para responsividade
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    // Verifica no carregamento
    checkScreenSize();
    
    // Adiciona listener para redimensionamento
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Dividir o conteu00fado em paru00e1grafos para inserir anu00fancios entre eles
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Esta funu00e7u00e3o seria usada para dividir o conteu00fado dinamicamente
      // em um caso real, mas para este exemplo, apenas simulamos a divisu00e3o
      const contentChildren = Array.isArray(children) ? children : [children];
      setParagraphs(contentChildren);
    }
  }, [children]);

  // ID de slots do AdSense (substitute pelos seus IDs reais)
  const adSlots = {
    top: 'top-banner-slot-id',    // ID do slot para banner superior
    content: 'in-content-slot-id', // ID do slot para anu00fancios entre paru00e1grafos
    sidebar: 'sidebar-slot-id'      // ID do slot para anu00fancios laterais
  };

  return (
    <div className={`article-layout ${className}`}>
      {/* Banner de anu00fancio no topo (acima da dobra) */}
      <div className="bg-flamengo-gradient h-1 w-full mb-4"></div>
      
      <AdBanner slot={adSlots.top} className="mb-6" />
      
      <div className="container-flamengo flex flex-col lg:flex-row gap-8">
        {/* Coluna principal com conteu00fado e anu00fancios intercalados */}
        <div className="w-full lg:w-2/3">
          <article className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-flamengo-red prose-a:text-flamengo-red prose-a:no-underline prose-a:font-medium hover:prose-a:underline" style={{ fontFamily: 'var(--font-sans)' }}>
            {paragraphs.map((paragraph, index) => {
              // Inserir anu00fancios apu00f3s determinados paru00e1grafos
              // (3, 8, 13, etc.) para melhor engagement
              const showAd = index > 0 && (index + 1) % 5 === 0 && index < paragraphs.length - 2;
              
              return (
                <div key={index} className={index === 0 ? 'animate-fade-slide-in' : ''}>
                  {paragraph}
                  {showAd && (
                    <ArticleAd 
                      slot={adSlots.content} 
                      index={Math.floor(index / 5)} 
                    />
                  )}
                </div>
              );
            })}
          </article>
          
          {/* Anu00fancio adicional ao final do artigo */}
          <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <ArticleAd slot={adSlots.content} index={99} />
          </div>
        </div>
        
        {/* Barra lateral com anu00fancios (apenas desktop) */}
        {isDesktop && (
          <div className="w-full lg:w-1/3 pt-4">
            <div className="bg-white p-4 rounded-lg shadow-md border-t-2 border-flamengo-red mb-6">
              <h3 className="text-lg font-bold mb-4 text-flamengo-red flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                Destaque Rubro-Negro
              </h3>
              <SidebarAd slot={adSlots.sidebar} />
            </div>
            
            {/* Seção adicional para engajamento */}
            <div className="bg-white p-4 rounded-lg shadow-md border-t-2 border-flamengo-red">
              <h3 className="text-lg font-bold mb-4 text-flamengo-red">Newsletter</h3>
              <p className="text-sm mb-4">Receba as últimas notícias do Mengão diretamente no seu email:</p>
              <div className="flex">
                <input type="email" placeholder="Seu melhor email" className="form-input-flamengo flex-grow" />
                <button className="btn-flamengo btn-flamengo-primary ml-2 whitespace-nowrap">Inscrever</button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Anu00fancio adicional para mobile (entre as seu00e7u00f5es) */}
      {!isDesktop && (
        <div className="mt-8 container-flamengo py-4 bg-gray-50">
          <h3 className="text-lg font-bold mb-4 text-flamengo-red text-center">CONTEÚDO PATROCINADO</h3>
          <ArticleAd slot={adSlots.content} index={101} />
        </div>
      )}
      
      {/* Rodapé de artigo com mais chamadas para ação */}
      <div className="bg-flamengo-dark-gradient text-white py-6 mt-10">
        <div className="container-flamengo">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Mais do Rubro-Negro</h3>
              <p className="text-gray-300">Acompanhe todas as notícias do Mengão</p>
            </div>
            <div className="flex space-x-4">
              <button className="btn-flamengo bg-white text-flamengo-red font-bold py-2 px-4 rounded-md hover:bg-gray-100 transition">
                Ver Mais Notícias
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleLayout;
