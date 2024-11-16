module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', {
      runtime: 'automatic',
      importSource: '@babel/runtime'
    }]
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs'
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', {
          runtime: 'automatic',
          importSource: '@babel/runtime'
        }]
      ]
    }
  }
};