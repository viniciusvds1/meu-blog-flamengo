"use client";
import { memo } from 'react';
import AdUnit from './AdUnit';

/**
 * Componente otimizado para inserir anúncios entre parágrafos de artigos
 * @param {Object} props - Propriedades do componente
 * @param {string} props.slot - ID do slot do anúncio no AdSense
 * @param {number} props.index - Índice do anúncio (para posicionamento variado)
 * @returns {JSX.Element} - Anúncio otimizado para artigos
 */
const ArticleAd = ({ slot, index = 0 }) => {
  // Determinar formato baseado no índice para variar os formatos
  // Isso melhora a experiência do usuário e evita "banner blindness"
  const formats = ['rectangle', 'horizontal', 'auto'];
  const format = formats[index % formats.length];
  
  return (
    <div className="my-6 w-full overflow-hidden article-ad-container">
      <div className="max-w-3xl mx-auto">
        <AdUnit 
          format={format}
          slot={slot} 
          position="content"
        />
      </div>
    </div>
  );
};

// Usando memo para evitar re-renderizações desnecessárias
export default memo(ArticleAd);
