'use client';

import { useState, useEffect, useCallback, useRef, useMemo, memo, Suspense } from 'react';
import Link from 'next/link';
import OptimizedImage from './OptimizedImage';
import ApiErrorBoundary from './ApiErrorBoundary';

// Component de fallback para usar durante o carregamento
const SliderSkeleton = () => (
  <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-gray-900">
    <div className="absolute inset-0 bg-gradient-to-r from-flamengoRed/20 to-transparent z-0" />
    <div className="absolute inset-0 flex items-center justify-center animate-pulse">
      <div className="w-full max-w-4xl px-4">
        <div className="h-12 bg-gray-800 rounded-lg mb-6 w-3/4 mx-auto"></div>
        <div className="h-6 bg-gray-800 rounded-lg w-2/3 mx-auto"></div>
      </div>
    </div>
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
      <div className="w-3 h-3 rounded-full bg-gray-800"></div>
      <div className="w-3 h-3 rounded-full bg-gray-800"></div>
      <div className="w-3 h-3 rounded-full bg-gray-800"></div>
    </div>
  </div>
);

// Component de slide individual - extraído para memoização
const Slide = memo(function Slide({ slide, isActive, isAnimating }) {
  const commonImgProps = {
    quality: isActive ? 90 : 75, // Maior qualidade para o slide ativo
    priority: isActive && slide.index === 0, // Prioridade para o primeiro slide quando ativo
    sizes: "(max-width: 768px) 100vw, 1200px",
    className: "object-cover transition-all",
    fetchPriority: isActive && slide.index === 0 ? "high" : "auto",
    loading: isActive && slide.index <= 1 ? "eager" : "lazy"
  };
  
  if (slide.type === 'banner') {
    return (
      <div className="relative w-full h-full">
        <OptimizedImage
          src={slide.image}
          alt={slide.title}
          width={slide.width}
          height={slide.height}
          {...commonImgProps}
        />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-shadow-lg mb-4 animate-fade-in-down">
              {slide.title}
            </h2>
            <p className="text-xl md:text-2xl text-white/90 text-shadow-md animate-slide-up">{slide.description}</p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <Link href={`/noticias/${slide.slug}`} className="block w-full h-full">
        <div className="relative w-full h-full group">
          <OptimizedImage
            src={slide.image}
            alt={slide.title}
            width={1200}
            height={630}
            {...commonImgProps}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-shadow-lg mb-2 group-hover:text-red-300 transition-colors">
                {slide.title}
              </h2>
              <p className="text-base md:text-lg text-white/90 text-shadow-md line-clamp-2">{slide.description}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }
});

const HeroSlider = memo(function HeroSlider({ news }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  // Refs para preload tracking e timer
  const timerRef = useRef(null);
  const sliderRef = useRef(null);
  const preloadedImages = useRef(new Set());
  const intersectionObserverRef = useRef(null);
  

  // Verificar se o modo de economia de dados está ativo
  const [dataSaverEnabled, setDataSaverEnabled] = useState(false);
  
  // Verificar preferências do usuário para economia de dados
  useEffect(() => {
    if ('connection' in navigator && 'saveData' in navigator.connection) {
      setDataSaverEnabled(navigator.connection.saveData);
    }
  }, []);

  const slides = useMemo(() => {
    return [
      {
        type: 'banner',
        image: '/assets/bannerubro.webp', // Usando WebP para melhor performance
        title: 'Blog do Flamengo',
        description: 'Todas as notícias do Mengão em um só lugar',
        width: 1200,
        height: 630,
        index: 0
      },
      ...news.slice(0, 3).map((item, idx) => ({
        type: 'news',
        image: item.image,
        title: item.title,
        description: item.excerpt,
        slug: item.uid,
        width: 1200,
        height: 630,
        index: idx + 1
      }))
    ];
  }, [news]);

  const updateSlide = useCallback((index) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 500);
  }, []);

  // Função para precarregar imagens com debounce
  const preloadImage = useCallback((src) => {
    if (!src || preloadedImages.current.has(src)) return;
    
    // Usar timeout para evitar preloads simultâneos
    const timeout = setTimeout(() => {
      const img = new Image();
      img.onload = () => preloadedImages.current.add(src);
      img.src = src;
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  // Pré-carregar próxima imagem e anterior, exceto se modo de economia de dados estiver ativo
  useEffect(() => {
    if (!slides || slides.length <= 1 || dataSaverEnabled) return;
    
    const nextIndex = (currentSlide + 1) % slides.length;
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    
    // Cancelar preloads anteriores
    let cleanupFunctions = [];
    
    if (slides[nextIndex].image) {
      const cleanup = preloadImage(slides[nextIndex].image);
      if (cleanup) cleanupFunctions.push(cleanup);
    }
    
    if (slides[prevIndex].image) {
      const cleanup = preloadImage(slides[prevIndex].image);
      if (cleanup) cleanupFunctions.push(cleanup);
    }
    
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [currentSlide, slides, preloadImage, dataSaverEnabled]);
  
  // Intersection Observer para pausar slider quando fora da view
  useEffect(() => {
    if (!sliderRef.current || typeof IntersectionObserver === 'undefined') return;
    
    const options = { 
      threshold: 0.3,
      rootMargin: '0px 0px 200px 0px' // Pré-carregando com margem de 200px antes de entrar na view
    };
    
    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0].isIntersecting;
        setIsVisible(isIntersecting);
        
        // Marcar evento para LCP
        if (isIntersecting && typeof performance !== 'undefined' && performance.mark) {
          performance.mark('hero-visible');
        }
      },
      options
    );
    
    intersectionObserverRef.current.observe(sliderRef.current);
    
    return () => {
      if (intersectionObserverRef.current && sliderRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, []);

  // Gerenciamento do timer com capacidade de pausa
  useEffect(() => {
    if (!slides || slides.length === 0 || isPaused || !isVisible) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      updateSlide((currentSlide + 1) % slides.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides, currentSlide, updateSlide, isPaused, isVisible]);  
  
  // Lidar com navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Apenas processar quando o slider está visível
      if (!isVisible) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          updateSlide((currentSlide - 1 + slides.length) % slides.length);
          break;
        case 'ArrowRight':
          updateSlide((currentSlide + 1) % slides.length);
          break;
        case ' ': // Tecla espaço
          e.preventDefault(); // Evitar scroll da página
          setIsPaused(prev => !prev);
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides, updateSlide, isVisible]);

  // Toggle pause
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  return (
    <ApiErrorBoundary>
      <div 
        ref={sliderRef}
        style={{ willChange: 'contents' }} /* Otimização para navegadores modernos */
        className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-black" 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Notícias em destaque">
        <div className="absolute inset-0 bg-gradient-to-r from-flamengoRed/20 to-transparent z-0" />
      <Suspense fallback={<SliderSkeleton />}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transform transition-all duration-1000 ease-in-out
              ${currentSlide === index 
                ? 'opacity-100 scale-100 z-10 animate-fade-in' 
                : 'opacity-0 scale-95 z-0'
              }
              ${isAnimating ? 'transition-opacity' : ''}
            `}
            aria-hidden={currentSlide !== index}
          >
            <Slide 
              slide={slide} 
              isActive={currentSlide === index} 
              isAnimating={isAnimating} 
            />
          </div>
        ))}
      </Suspense>

      {/* Play/Pause Control */}
      <button 
        onClick={togglePause}
        className="btn btn-circle btn-sm absolute top-4 right-4 z-20 bg-black/50 text-white hover:bg-red-600/80 transition-colors"
        aria-label={isPaused ? "Reproduzir apresentação" : "Pausar apresentação"}
        aria-pressed={isPaused}
      >
        {isPaused ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Progress Indicator */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-red-600 transition-all duration-300" 
        style={{ width: `${(currentSlide / (slides.length - 1)) * 100}%` }}
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={Math.round((currentSlide / (slides.length - 1)) * 100)}
      />

      {/* Navigation Dots */}
      <div 
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20" 
        role="tablist"
        aria-label="Navegação entre slides">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => updateSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-red-500
              ${currentSlide === index 
                ? 'bg-white scale-110 ring-2 ring-white/50' 
                : 'bg-white/50 hover:bg-white/70 hover:scale-105'}
            `}
            role="tab"
            aria-selected={currentSlide === index}
            aria-label={`Slide ${index + 1}`}
            tabIndex={currentSlide === index ? 0 : -1}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => updateSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="btn btn-circle btn-ghost absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label="Slide anterior"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={() => updateSlide((currentSlide + 1) % slides.length)}
        className="btn btn-circle btn-ghost absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label="Próximo slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
});

export default HeroSlider;
