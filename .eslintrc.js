module.exports = {
  extends: ['@valora/eslint-config-typescript'],
  env: {
    node: true,
  },
  rules: {
    'no-console': ['error', { allow: ['none'] }],
  },
}
