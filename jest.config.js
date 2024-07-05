module.exports = {
  watchman: false,
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  testPathIgnorePatterns: ['dist'],
  globals: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  testTimeout: 10000,
  setupFilesAfterEnv: ['<rootDir>/setup-jest.js'],
}
