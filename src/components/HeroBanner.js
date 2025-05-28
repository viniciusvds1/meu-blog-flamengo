'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const OptimizedImage = dynamic(() => import('./OptimizedImage'), {
  ssr: true
});
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroBanner = ({ slides = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Dados de exemplo para o banner usando imagens que existem na pasta assets
  const defaultSlides = [
    {
      id: 1,
      title: 'Palmeiras conquista vitória, de virada, sobre o Flamengo no Brasileirão sub-20',
      description: 'Mengão foi derrotado em partida acirrada do campeonato',
      image: '/assets/bannerubro.png',
      webp: '/assets/bannerubro.webp', // Versão WebP otimizada
      category: 'Brasileirão',
      url: '/noticias/flamengo-palmeiras-sub20'
    },
    {
      id: 2,
      title: 'Flamengo e Palmeiras entram em campo pela Libertadores com transmissão da Globo',
      description: 'Rubro-Negro busca classificação para as oitavas de final',
      image: '/assets/flamengo.jpg',
      webp: '/assets/flamengo.webp', // Versão WebP otimizada
      category: 'Libertadores',
      url: '/noticias/flamengo-libertadores-oitavas'
    },
    {
      id: 3,
      title: 'Gerson tem leve inflamação no joelho e vira dúvida para próxima partida',
      description: 'Departamento médico avalia condições do jogador',
      image: '/assets/flamengo2.jpg',
      webp: '/assets/flamengo2.webp', // Versão WebP otimizada
      category: 'Notícias',
      url: '/noticias/gerson-inflamacao-joelho'
    }
  ];

  const slidesToShow = slides.length > 0 ? slides : defaultSlides;

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slidesToShow.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const isLastSlide = currentIndex === slidesToShow.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Overlay gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-40 z-10" />
      
      {/* Imagem do slide */}
      <div className="relative w-full h-full transition-transform duration-500 ease-in-out">
        {slidesToShow.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="relative w-full h-full">
              <OptimizedImage 
                src={slide.image || '/assets/bannerubro.png'} 
                alt={slide.title}
                fill
                priority={true}
                sizes="100vw"
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-10000 ease-out transform scale-105 animate-slow-zoom"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Conteúdo do slide */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-8 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-flamengo-red inline-block px-2 py-1 text-xs md:text-sm text-white font-bold mb-2 rounded">
            {slidesToShow[currentIndex].category}
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-md">
            {slidesToShow[currentIndex].title}
          </h2>
          
          <p className="text-sm md:text-base text-gray-100 mb-4 max-w-2xl drop-shadow-md">
            {slidesToShow[currentIndex].description}
          </p>
          
          <Link 
            href={slidesToShow[currentIndex].url}
            className="inline-flex items-center bg-white text-flamengo-red px-4 py-2 rounded-full font-bold text-sm md:text-base hover:bg-gray-100 transition-colors duration-300 group"
          >
            Saiba mais
            <ChevronRight className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Navegação do slider */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicadores de slides */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slidesToShow.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true);
                setCurrentIndex(index);
                setTimeout(() => setIsAnimating(false), 500);
              }
            }}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-4 md:w-6' : 'bg-white/50'}`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
