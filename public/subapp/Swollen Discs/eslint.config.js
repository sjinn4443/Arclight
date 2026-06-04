const sharedGlobals = {
  alert: 'readonly',
  Blob: 'readonly',
  cancelAnimationFrame: 'readonly',
  clearInterval: 'readonly',
  clearTimeout: 'readonly',
  console: 'readonly',
  Date: 'readonly',
  document: 'readonly',
  HTMLElement: 'readonly',
  Image: 'readonly',
  Math: 'readonly',
  process: 'readonly',
  queueMicrotask: 'readonly',
  requestAnimationFrame: 'readonly',
  setInterval: 'readonly',
  setTimeout: 'readonly',
  URL: 'readonly',
  window: 'readonly'
};

export default [
  {
    ignores: ['node_modules/**']
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: sharedGlobals
    },
    rules: {
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-unused-vars': [
        'error',
        {
          args: 'none',
          ignoreRestSiblings: true
        }
      ]
    }
  }
];
