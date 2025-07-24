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
    },
    esm: {
      presets: [
        ['@babel/preset-env', { 
          targets: { node: '14' },
          modules: false  // This ensures ESM output
        }],
        '@babel/preset-flow'
      ]
    }
  }
};