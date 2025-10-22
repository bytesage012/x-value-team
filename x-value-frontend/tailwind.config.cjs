module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        secondary: '#8B5CF6',
        background: '#F9FAFB',
        text: '#111827',
        accent: '#F472B6',
      },
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        poppins: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        sm: '0.375rem',
        DEFAULT: '0.5rem',
        lg: '0.75rem',
      },
      spacing: {
        '9': '2.25rem',
        '18': '4.5rem',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(16,24,40,0.05)',
        DEFAULT: '0 4px 12px rgba(17,24,39,0.06)',
        md: '0 8px 24px rgba(17,24,39,0.08)',
      },
    },
  },
  plugins: [],
};