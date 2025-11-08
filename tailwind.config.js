/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta principal de Kiogloss
        primary: {
          DEFAULT: '#610361',
          light: '#8a0e8a',
          dark: '#450245',
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#610361',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        secondary: {
          DEFAULT: '#e6affc',
          light: '#f0c9fd',
          dark: '#d896fb',
        },
        white: '#ffffff',
        // Colores para estados de stock
        stock: {
          high: '#10b981', // Verde - En Stock
          medium: '#f59e0b', // Amarillo - Stock Medio
          low: '#ef4444', // Rojo - Stock Bajo
          out: '#6b7280', // Gris - Sin Stock
        },
        // Colores adicionales para UI
        background: {
          light: '#fafafa',
          dark: '#0f0f0f',
        },
        text: {
          light: '#1f2937',
          dark: '#f9fafb',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'kiogloss': '0 4px 20px rgba(97, 3, 97, 0.15)',
        'kiogloss-lg': '0 10px 40px rgba(97, 3, 97, 0.2)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #610361 0%, #8a0e8a 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #e6affc 0%, #f0c9fd 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}