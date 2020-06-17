module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true
  },
  extends: [
    'airbnb-base',
    'prettier',
    'eslint:recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true
    },
  },
  rules: {},
}
