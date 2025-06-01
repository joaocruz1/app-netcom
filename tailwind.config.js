/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'netcom-blue': '#0A2F5B',        // Azul principal
        'netcom-orange': '#FF6600',      // Laranja principal
        'netcom-orange-darker': '#E05A00',// Laranja um pouco mais escuro para press state
        'netcom-background': '#F9FAFB', // Um cinza bem clarinho para o fundo da tela (quase branco)
        'netcom-card-bg': '#FFFFFF',    // Branco para o card do formulário
        'netcom-input-bg': '#FFFFFF',   // Fundo do input (branco)
        'netcom-input-border': '#D1D5DB',// Cinza para borda do input (Tailwind gray-300)
        'netcom-input-focus-border': '#FF8C00', // Laranja mais vibrante para foco (ou use netcom-orange)
        'netcom-text-primary': '#111827', // Cinza bem escuro para texto principal (Tailwind gray-900)
        'netcom-text-secondary': '#6B7280',// Cinza médio para texto secundário (Tailwind gray-500)
        'netcom-link': '#0A2F5B',        // Azul para links
        'netcom-placeholder': '#9CA3AF'  // Cinza para o placeholder (Tailwind gray-400)
      },
    },
  },
  plugins: [],
};
