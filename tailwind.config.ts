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
        // ── Editorial-bold palette (new public-site design system) ────────────
        // Use these on public pages. Kept minimal on purpose.
        ink:       '#080808', // near-black — primary text, borders
        paper:     '#ffffff', // pure white — page background
        off:       '#f5f0eb', // off-white — subtle hover background
        line:      '#080808', // border color (alias, same as ink; use w/ /10 for softer)
        red:       '#E94560', // accent red
        'red-soft': 'rgba(233,69,96,0.10)',
        'red-ring': 'rgba(233,69,96,0.20)',
        'ink-60':  '#666666',
        'ink-40':  '#999999',
        'ink-20':  '#dcdcdc',

        // ── Legacy dark palette (KEEP — used by admin panel, dashboard, auth) ─
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
        // Editorial-bold: Bebas Neue for display, Inter for body
        display: ['var(--font-bebas)', 'Bebas Neue', 'Impact', 'sans-serif'],
        sans:    ['var(--font-inter)', 'Inter', 'sans-serif'],
        bebas:   ['var(--font-bebas)', 'Bebas Neue', 'Impact', 'sans-serif'],
      },
      boxShadow: {
        // Editorial-bold: no shadows — borders do the work. Keep aliases so
        // admin/dashboard components that reference them still compile.
        glow:       '0 0 20px rgba(233,69,96,0.3)',
        'glow-blue': '0 0 20px rgba(15,107,122,0.3)',
      },
      letterSpacing: {
        editorial: '2px',
        'editorial-wide': '3px',
      },
    },
  },
  plugins: [],
};

export default config;
