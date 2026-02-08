/** @type {import('tailwindcss').Config} */
module.exports = {
  // Memberitahu Tailwind file mana saja yang menggunakan class CSS
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Kustomisasi warna jika ingin menambahkan brand color khusus
      colors: {
        brand: {
          50: '#f5f7ff',
          600: '#4f46e5', // Indigo-600 yang kita gunakan di seluruh UI
          700: '#4338ca',
        },
      },
      // Menambahkan variasi border-radius untuk tampilan kartu yang modern
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      // Menambahkan animasi kustom untuk feedback AI
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};