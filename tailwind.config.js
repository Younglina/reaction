/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        background: '#E0E5EC',
        foreground: '#3D4852',
        muted: '#6B7280',
        accent: '#6C63FF',
        'accent-light': '#8B84FF',
        'accent-secondary': '#38B2AC'
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['DM Sans', 'sans-serif']
      },
      boxShadow: {
        'extruded': '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)',
        'extruded-hover': '12px 12px 20px rgb(163,177,198,0.7), -12px -12px 20px rgba(255,255,255,0.6)',
        'extruded-small': '5px 5px 10px rgb(163,177,198,0.6), -5px -5px 10px rgba(255,255,255,0.5)',
        'inset': 'inset 6px 6px 10px rgb(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5)',
        'inset-deep': 'inset 10px 10px 20px rgb(163,177,198,0.7), inset -10px -10px 20px rgba(255,255,255,0.6)',
        'inset-small': 'inset 3px 3px 6px rgb(163,177,198,0.6), inset -3px -3px 6px rgba(255,255,255,0.5)'
      },
      borderRadius: {
        'container': '32px',
        'button': '16px',
        'inner': '12px'
      },
      transitionDuration: {
        '300': '300ms'
      }
    }
  },
  plugins: []
}
