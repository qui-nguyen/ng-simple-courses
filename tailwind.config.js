/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  important: true,
  theme: {
    extend: {
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '32px',
        '5xl': '48px',
        '6xl': '64px',
      },
      lineHeight: {
        '3': '12px',
        '4': '14px',
        '5': '16px',
        '6': '20px',
        '7': '22px',
        '8': '24px',
        '11': '30px',
        '14': '32px',
        '15': '48px',
        '16': '67px',
      },
      letterSpacing: {
        wide: '0.5px',
        tighter: '-0.2px',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'cormorant': ['Cormorant Garamond', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      colors: {
        "blue": {
          DEFAULT: "#3B82F6",
          "100": "#4AD6D6"
        },
        "black": {
          DEFAULT: "#000000",
          "100": "#121212",
          "150": "#bbbbbb3b"
        },
        "white": "#FFFFFF",
        "green": {
          DEFAULT: "#207C2A",
          "100": "#C4BE36"
        },
        "yellow": {
          DEFAULT: "#DBAD76",
          "100": "#dbad76b3" //#DBAD76 0.7
        },
        "red": {
          DEFAULT: "#F43131CF", // 0.81
        }
      }
    },
  },
  plugins: [],
};