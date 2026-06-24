/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // GOSHENS brand palette — deep green, black, gold, cream.
        ink: {
          900: '#0a0f0c', // near-black with a green cast
          800: '#0d1410',
          700: '#101a14',
        },
        forest: {
          900: '#0c1f17',
          800: '#103026',
          700: '#154635',
          600: '#1c5a45',
          500: '#247a5d',
          400: '#3a9a78',
        },
        gold: {
          400: '#e9c877',
          500: '#d4af57',
          600: '#b8923f',
        },
        cream: {
          100: '#f7f3e9',
          200: '#ece5d3',
          300: '#d8cdb4',
        },
        // Ecclesia Basilikos royal palette (used on the vision / home page).
        navy: {
          900: '#0a1230',
          800: '#0f1c44',
          700: '#172a5c',
          600: '#22386f',
        },
        burgundy: {
          900: '#3d1626',
          800: '#4a1d30',
          700: '#5e2740',
        },
        parchment: '#f0ede5',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'ui-sans-serif', 'sans-serif'],
        cinzel: ['Cinzel', 'Georgia', 'serif'],
        cinzelDecorative: ['"Cinzel Decorative"', 'Cinzel', 'serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        georgia: ['Georgia', '"Times New Roman"', 'serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(0, 0, 0, 0.55)',
        glow: '0 0 0 1px rgba(212, 175, 87, 0.18), 0 18px 50px -20px rgba(36, 122, 93, 0.45)',
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(1200px 600px at 50% -10%, rgba(36,122,93,0.30), transparent 60%), radial-gradient(900px 500px at 90% 10%, rgba(212,175,87,0.10), transparent 55%)',
        'gold-line':
          'linear-gradient(90deg, transparent, rgba(212,175,87,0.6), transparent)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
