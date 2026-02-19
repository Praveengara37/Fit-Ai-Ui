import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#1a1625',      // Softer dark purple-gray (was #0a0118)
        foreground: '#e5e5e5',      // Softer white (was #ffffff)
        primary: {
          purple: '#a855f7',         // Softer purple (was #8a2be2)
          cyan: '#22d3ee',           // Softer cyan (was #00bfff)
        },
        card: {
          background: 'rgba(138, 43, 226, 0.08)',  // More visible (was 0.05)
          border: 'rgba(138, 43, 226, 0.25)',      // Softer border (was 0.2)
        },
        input: {
          background: '#2a2235',     // Lighter input background
          border: 'rgba(138, 43, 226, 0.3)',
        },
        text: {
          primary: '#e5e5e5',
          secondary: '#9ca3af',      // Softer gray (was #888888)
        },
        success: '#22d3ee',          // Softer cyan (was #00bfff)
        error: '#ff4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
