// front/jest.config.js
module.exports = {
    rootDir: '.',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '^axios$': 'axios'
    },
    testEnvironment: 'jsdom',
    transformIgnorePatterns: ['/node_modules/(?!axios)/'],
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest'
    },
    collectCoverageFrom: [
      'src/**/*.{js,jsx}',
      '!src/index.js',
      '!src/reportWebVitals.js'
    ],
    coverageReporters: ['text', 'lcov']
  };