'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
    // Reset timer when manually changing slides
    if (timerRef.current) {
      clearInterval(timerRef.current);
      startTimer();
    }
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(nextSlide, 6000);
  }, [nextSlide]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
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

  return (
    <div 
      className="relative mb-12"
      ref={slidesContainerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      role="region"
      aria-label="Notícias em destaque"
    >
      <div className="relative">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`transition-all duration-700 ease-in-out transform ${
              currentSlide === index 
                ? 'relative opacity-100 z-10 translate-x-0' 
                : 'absolute inset-0 opacity-0 z-0 translate-x-full'
            }`}
            aria-hidden={currentSlide !== index}
          >
            <div className="object-fill relative aspect-[21/9] md:aspect-[3/1] w-full overflow-hidden rounded-xl">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-fill transform hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 1200px"
                priority={index === 0 || index === 1}
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                <div className="max-w-3xl">
                  {slide.type === 'banner' ? (
                    <>
                      <h1 className="text-xl md:text-5xl font-bold text-white mb-4 leading-tight animate-fadeIn">
                        {slide.title}
                      </h1>
                      <p className="text-base md:text-xl text-gray-100 animate-fadeIn delay-200">
                        {slide.description}
                      </p>
                    </>
                  ) : (
                    <Link href={`/noticias/${slide.slug}`}>
                      <div className="cursor-pointer group">
                        <h2 className="text-lg md:text-4xl font-bold text-white mb-2 md:mb-3 leading-tight group-hover:text-red-500 transition-colors">
                          {slide.title}
                        </h2>
                        <p className="text-sm md:text-lg text-gray-100 group-hover:text-gray-200 transition-colors">
                          {slide.description}
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
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
    </div>
  );
}
