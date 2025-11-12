// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // ← App Router構成に合わせる
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Zen Maru Gothic"', 'sans-serif'],
        body: ['"Hiragino Sans"', '"ヒラギノ角ゴシック"', '"M PLUS Rounded 1c"', 'sans-serif'],
      },
      keyframes: {
        grow: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        grow: 'grow linear',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-filters'),
  ],
}