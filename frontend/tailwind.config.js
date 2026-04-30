// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6366f1',   // indigo-500
          dark: '#4f46e5',      // indigo-600
          light: '#818cf8',     // indigo-400
        },
        secondary: '#6b7280',   // gray-500
        accent: '#ec4899',      // pink-500
        surface: '#ffffff',
        muted: '#f3f4f6',       // gray-100
        base: '#111827',        // gray-900
      }
    },
  },
  plugins: [],
}