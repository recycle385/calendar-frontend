/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FDFBF7", // 아이보리/크림 배경
        primary: "#FFD8B1",    // 살구 파스텔
        secondary: "#B1E5D9",  // 민트 파스텔
        accent: "#FFF4B1",     // 노랑 파스텔
        softPink: "#FFE4E1",
        card: "#FFFFFF",
      },
      borderRadius: {
        'kawaii': '2rem',
      },
      fontFamily: {
        sans: ['"Pretendard"', 'sans-serif'],
      },
      fontWeight: {
        bold: '700',
        extraBold: '800',
      },
    },
  },
  plugins: [],
}
