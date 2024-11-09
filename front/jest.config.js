// jest.config.js
module.exports = {
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(axios)/)', // 'axios' 모듈을 변환 대상에 포함
    ],
  };