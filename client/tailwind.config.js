module.exports = {
  important: true,
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '48px',
        image: '480px',
      },
      lineHeight: {
        header: '64px',
      },
      colors: {
        primary: '#1890ff',
      },
      maxWidth: {
        page: '984px',
        content: '640px',
        sidebar: '320px',
      },
      width: {
        page: '984px',
        content: '640px',
        sidebar: '320px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
