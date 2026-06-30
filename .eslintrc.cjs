module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:playwright/playwright-test', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  overrides: [
    {
      files: ['tests/**/*.js', 'helpers/**/*.js', 'pages/**/*.js', 'send-team-report.js'],
      rules: {
        'playwright/expect-expect': 'off',
        'no-console': 'off',
      },
    },
  ],
};
