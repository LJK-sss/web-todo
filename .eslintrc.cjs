/* ESLint 8 的 .eslintrc 配置：三条必设规则 + TS/JSX 解析 */
module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    complexity: ['warn', 10],
    'max-depth': ['warn', 3],
    '@typescript-eslint/no-explicit-any': 'error',
  },
  ignorePatterns: ['dist', 'node_modules'],
};
