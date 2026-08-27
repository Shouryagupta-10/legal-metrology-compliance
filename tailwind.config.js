/** @type {import('tailwindcss').Config} */
export default {
   darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        brand: {
          DEFAULT: 'var(--brand)',
          deep: 'var(--brand-deep)',
          light: 'var(--brand-light)',
        },
        accent: {
          teal: 'var(--accent-teal)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          card: 'var(--surface-card)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink-soft)',
        },
        ghost: 'var(--ghost)',
        hairline: 'var(--hairline)',
        'on-brand': 'var(--on-brand)',
      },
      fontFamily: {
        sans: ['Onest', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: 'var(--radius-card)',
        'card-lg': 'var(--radius-card-lg)',
        pill: 'var(--radius-pill)',
        xl: '0.75rem',
      },
      keyframes: {
        'word-slide-up': {
          '0%': { transform: 'translateY(115%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'curtain-exit': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-105%)' }
        },
        'progress-fill': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' }
        }
      },
      animation: {
        'word-slide': 'word-slide-up 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'curtain-slide': 'curtain-exit 0.85s cubic-bezier(0.65, 0, 0.35, 1) forwards',
        'progress': 'progress-fill 1.28s cubic-bezier(0.65, 0, 0.35, 1) forwards'
      }
    },
  },
  plugins: [],
}
