// jest.config.js
module.exports = {
  roots: ["<rootDir>/front/src"],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|other-es6-module)/)', // axios 및 다른 ES6 모듈을 변환 대상으로 포함
  ],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy', // CSS 파일을 무시하기 위한 설정
  },
};
