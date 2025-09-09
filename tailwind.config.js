/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores oficiais do Flamengo melhoradas para contraste
        'flamengo-red': '#E20E0E',
        'flamengo-red-dark': '#B71C1C',
        'flamengo-red-light': '#FF1744',
        'flamengo-black': '#000000',
        'flamengo-gold': '#FFD700',
        'flamengo-white': '#FFFFFF',
        
        // Mantemos a compatibilidade com o código existente
        'flamengoRed': '#E20E0E',
        'flamengoBlack': '#000000',
        
        // Cores neutras otimizadas
        'neutral-50': '#fafafa',
        'neutral-100': '#f5f5f5',
        'neutral-200': '#e5e5e5',
        'neutral-800': '#262626',
        'neutral-900': '#171717',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['var(--font-roboto-serif)', 'Georgia', 'Times New Roman', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'flamengo-gradient': 'linear-gradient(135deg, #E20E0E 0%, #B71C1C 100%)',
        'flamengo-gradient-reverse': 'linear-gradient(135deg, #B71C1C 0%, #E20E0E 100%)',
        'flamengo-radial': 'radial-gradient(circle, #E20E0E 0%, #B71C1C 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
      },
      boxShadow: {
        'flamengo': '0 4px 20px rgba(226, 14, 14, 0.3)',
        'flamengo-lg': '0 10px 40px rgba(226, 14, 14, 0.4)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.15)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
  daisyui: {
    themes: [
      {
        flamengo: {
          'primary': '#E20E0E',
          'primary-content': '#FFFFFF',
          'secondary': '#000000',
          'secondary-content': '#FFFFFF',
          'accent': '#FFD700',
          'accent-content': '#000000',
          'neutral': '#2A2A2A',
          'neutral-content': '#FFFFFF',
          'base-100': '#FFFFFF',
          'base-200': '#F5F5F5',
          'base-300': '#E5E5E5',
          'base-content': '#1A1A1A',
          'info': '#0288D1',
          'info-content': '#FFFFFF',
          'success': '#388E3C',
          'success-content': '#FFFFFF',
          'warning': '#FFA000',
          'warning-content': '#000000',
          'error': '#D32F2F',
          'error-content': '#FFFFFF',
        },
      },
    ],
  },
}
