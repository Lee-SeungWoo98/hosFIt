// jest.config.js
module.exports = {
  roots: ["<rootDir>/front/src"],  // 정확한 경로로 설정
  testEnvironment: 'jsdom',        // jsdom 환경 설정
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',  // babel-jest를 사용해 ES6 모듈을 변환
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios)/)', // axios 모듈을 변환 대상으로 포함
  ],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy', // CSS 파일을 무시하기 위한 설정
  },
};
