module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: '14' } }],
    '@babel/preset-flow'
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-flow'
      ]
    }
  }
};