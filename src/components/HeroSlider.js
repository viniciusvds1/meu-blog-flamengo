'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import OptimizedImage from './OptimizedImage';

export default function HeroSlider({ news }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const timerRef = useRef(null);
  const slidesContainerRef = useRef(null);
  
  const slides = [
    {
      type: 'banner',
      image: '/assets/bannerubro.png',
      title: 'Blog do Flamengo',
      description: 'Todas as notícias do Mengão em um só lugar',
    },
    ...news.slice(0, 3).map(item => ({
      type: 'news',
      image: item.image,
      title: item.title,
      description: item.excerpt,
      slug: item.slug,
    }))
  ];

  // Preload next image
  useEffect(() => {
    const nextIndex = (currentSlide + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextIndex].image;
  }, [currentSlide, slides]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(nextSlide, 6000);
  }, [nextSlide]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTimer]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  return (
    <div 
      ref={slidesContainerRef}
      className="relative w-full h-[400px] overflow-hidden rounded-lg"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            transform: `translateX(${100 * (index - currentSlide)}%)`
          }}
        >
          {slide.type === 'banner' ? (
            <div className="relative w-full h-full">
              <OptimizedImage
                src={slide.image}
                alt={slide.title}
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                className="transition-all duration-500"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-lg">
                <div className="absolute bottom-0 left-0 w-full p-4 md:p-8">
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">{slide.title}</h2>
                  <p className="text-white/90 text-sm md:text-base">{slide.description}</p>
                </div>
              </div>
            </div>
          ) : (
            <Link href={`/noticias/${slide.slug}`} className="relative w-full h-full block">
              <OptimizedImage
                src={slide.image}
                alt={slide.title}
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                className="transition-all duration-500"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-lg">
                <div className="absolute bottom-0 left-0 w-full p-4 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{slide.title}</h2>
                  <p className="text-white/80 text-sm line-clamp-2">{slide.description}</p>
                </div>
              </div>
            </Link>
          )}
        </div>
      ))}
      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-20"
        aria-label="Slide anterior"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-20"
        aria-label="Próximo slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 right-4 flex gap-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-red-500 w-6' : 'bg-white/50 hover:bg-white/80'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir para slide ${index + 1}`}
            aria-current={currentSlide === index}
          />
        ))}
      </div>
    </div>
  );
}
