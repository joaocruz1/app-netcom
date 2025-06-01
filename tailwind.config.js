/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'netcom-blue': '#0A2F5B', // Azul escuro da Netcom (ajuste o hexadecimal se necessário)
        'netcom-orange': '#FF6600', // Laranja da Netcom (ajuste o hexadecimal se necessário)
        'netcom-light-gray': '#F3F4F6', // Um cinza claro para fundos de input, por exemplo
        'netcom-dark-text': '#1F2937', // Um cinza escuro para texto, se o azul for muito forte
      },
    },
  },
  plugins: [],
};
