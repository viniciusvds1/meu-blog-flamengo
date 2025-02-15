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
        flamengoRed: '#D50000',
        flamengoBlack: '#000000',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        flamengo: {
          'primary': '#D50000',
          'secondary': '#000000',
          'accent': '#FF1744',
          'neutral': '#2A2A2A',
          'base-100': '#FFFFFF',
          'info': '#0288D1',
          'success': '#388E3C',
          'warning': '#FFA000',
          'error': '#D32F2F',
        },
      },
    ],
  },
}
