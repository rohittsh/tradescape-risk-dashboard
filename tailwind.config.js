/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0B0E14',
        surface: '#12161F',
        'surface-alt': '#1B212C',
        line: '#252C39',
        muted: '#8B93A1',
        ink: '#E8EAED',
        safe: '#3DD68C',
        warn: '#F5A623',
        risk: '#FF5C5C',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
