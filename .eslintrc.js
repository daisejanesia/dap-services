module.exports = {
  globals: {
    APP_NAME: false,
    APP_SELECTOR: false
  },
  env: {
    browser: true,
    jest: true,
    mocha: true
  },
  plugins: ['prettier'],
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true
      }
    ],
    'import/prefer-default-export': ['off'], // we should try to turn this back on
    'import/no-extraneous-dependencies': [
      2,
      {
        devDependencies: [
          '**/__tests__/**',
          '**/__mocks__/**',
          '**/?(*.)spec.js',
          'support/**',
          'tests/**'
        ]
      }
    ],
    'no-plusplus': ['off'],
    'no-underscore-dangle': ['off'],
    'global-require': ['off']
  },
  overrides: [
    {
      files: ['**/spec.js', '**/*.spec.js'],
      rules: {
        'func-names': 'off',
        'no-unused-expressions': 'off'
      }
    }
  ]
};
