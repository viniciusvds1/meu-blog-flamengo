"use client";
import { memo } from 'react';
import AdUnit from './AdUnit';

/**
 * Componente otimizado para exibir anu00fancios na barra lateral (desktop)
 * e entre seu00e7u00f5es em dispositivos mu00f3veis
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.slot - ID do slot do anu00fancio no AdSense
 * @param {string} props.className - Classes CSS adicionais
 * @returns {JSX.Element} - Anu00fancio de barra lateral responsivo
 */
const SidebarAd = ({ slot, className = '' }) => {
  return (
    <aside className={`sidebar-ad ${className}`}>
      <div className="sticky top-24 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium mb-4 text-red-800 hidden md:block">Fique por dentro</h3>
        
        <AdUnit 
          format="rectangle"
          slot={slot} 
          position="sidebar"
        />
      </div>
    </aside>
  );
};

// Usando memo para evitar re-renderizau00e7u00f5es desnecessu00e1rias
export default memo(SidebarAd);
