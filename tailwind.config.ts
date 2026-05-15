import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:   '#1A1A2E',
          darker: '#0D0D1A',
          mid:    '#2C2C54',
          accent: '#E94560',
          muted:  '#4A4E69',
          light:  '#F0F4FF',
        },
        skillit: {
          accent: '#0F6B7A',
          light:  '#E8F4F8',
        },
      },
      fontFamily: {
        display: ['var(--font-inter)', 'Inter', 'sans-serif'],
        sans:    ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow:       '0 0 20px rgba(233,69,96,0.3)',
        'glow-blue': '0 0 20px rgba(15,107,122,0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
