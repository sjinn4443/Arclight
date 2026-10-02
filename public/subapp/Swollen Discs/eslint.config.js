const sharedGlobals = {
  alert: 'readonly',
  Blob: 'readonly',
  cancelAnimationFrame: 'readonly',
  clearInterval: 'readonly',
  clearTimeout: 'readonly',
  console: 'readonly',
  Date: 'readonly',
  document: 'readonly',
  Event: 'readonly',
  HTMLElement: 'readonly',
  Image: 'readonly',
  location: 'readonly',
  Math: 'readonly',
  MutationObserver: 'readonly',
  navigator: 'readonly',
  process: 'readonly',
  queueMicrotask: 'readonly',
  requestAnimationFrame: 'readonly',
  setInterval: 'readonly',
  setTimeout: 'readonly',
  caches: 'readonly',
  fetch: 'readonly',
  Response: 'readonly',
  self: 'readonly',
  URL: 'readonly',
  window: 'readonly'
};

export default [
  {
    ignores: ['node_modules/**', 'output/**', 'app.bundle.js']
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
