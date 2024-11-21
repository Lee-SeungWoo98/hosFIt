module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
        chosunlo: ['ChosunLo', 'serif'],
      },
      colors: {
        border: '#e5e7eb', // 기본 테두리 색상
        foreground: '#111827', // 텍스트 전경색
        primary: '#2563eb', // 주요 색상
        background: '#f4f5f7', // 배경색
      },
      spacing: {
        sidebar: '280px', // 사이드바 너비
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Tailwind의 기본 CSS 리셋 비활성화
  },
};
