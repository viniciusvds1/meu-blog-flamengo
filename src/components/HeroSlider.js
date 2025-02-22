'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import OptimizedImage from './OptimizedImage';

export default function HeroSlider({ news }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);

  const slides = useMemo(() => {
    return [
      {
        type: 'banner',
        image: '/assets/bannerubro.png',
        title: 'Blog do Flamengo',
        description: 'Todas as notícias do Mengão em um só lugar',
        width: 1200,
        height: 630,
      },
      ...news.slice(0, 3).map(item => ({
        type: 'news',
        image: item.image,
        title: item.title,
        description: item.excerpt,
        slug: item.slug,
        width: 1200,
        height: 630,
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

  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const timer = setInterval(() => {
      updateSlide((currentSlide + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides, currentSlide, updateSlide]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`
            absolute w-full h-full transform transition-all duration-1000 ease-in-out
            ${currentSlide === index 
              ? 'opacity-100 scale-100 z-10' 
              : 'opacity-0 scale-95 z-0'
            }
            ${isAnimating ? 'transition-opacity' : ''}
          `}
        >
          {slide.type === 'banner' ? (
            <div className="relative w-full h-full">
              <OptimizedImage
                src={slide.image}
                alt={slide.title}
                width={slide.width}
                height={slide.height}
                priority={index === 0}
                className="w-full h-full"
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
                <div className="absolute bottom-0 left-0 p-8 max-w-3xl">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white text-shadow-lg">{slide.title}</h2>
                  <p className="text-xl md:text-2xl text-white/90 text-shadow-md">{slide.description}</p>
                </div>
              </div>
            </div>
          ) : (
            <Link href={`/noticias/${slide.slug}`} className="block w-full h-full">
              <div className="relative w-full h-full group">
                <OptimizedImage
                  src={slide.image}
                  alt={slide.title}
                  width={slide.width}
                  height={slide.height}
                  priority={index === 0}
                  className="w-full h-full"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-black/95 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 p-8 max-w-3xl">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-white text-shadow-lg line-clamp-2">{slide.title}</h2>
                    <p className="text-base md:text-lg text-white/90 text-shadow-md line-clamp-2">{slide.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => updateSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-red-600 scale-110'
                : 'bg-white/50 hover:bg-red-600/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => updateSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="btn btn-circle btn-ghost absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-red-600/20"
        aria-label="Previous slide"
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
        className="btn btn-circle btn-ghost absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-red-600/20"
        aria-label="Next slide"
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
}
