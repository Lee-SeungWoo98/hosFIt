/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        background: '#f4f5f7',
      },
      spacing: {
        'sidebar': '280px',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 기존 스타일을 유지하기 위해 Tailwind의 reset 스타일을 비활성화
  }
}