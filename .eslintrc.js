module.exports = {
  extends: ['@valora/eslint-config-typescript'],
  rules: {
    'no-console': ['warn', { allow: ['none'] }],
  },
  env: {
    node: true,
  },
}
