// jest.config.js
module.exports = {
  roots: ["<rootDir>/front/src"],  // 정확한 경로로 설정
  testEnvironment: 'jsdom',   // jsdom 환경 설정 (필요 시)
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios)/)', // 'axios' 모듈을 변환 대상에 포함
  ],
};
