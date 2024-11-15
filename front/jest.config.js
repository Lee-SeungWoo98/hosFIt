module.exports = {
    testEnvironment: 'jsdom',
    collectCoverage: true,
    coverageReporters: ['text', 'json-summary', 'lcov'],
    reporters: [
      'default',
      [
        'jest-json-reporter',
        {
          outputPath: 'test-results.json',
        },
      ],
    ],
  };
  