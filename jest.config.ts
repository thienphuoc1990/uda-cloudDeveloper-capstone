module.exports = {
    // rootDir: 'test',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'text', 'text-summary', 'lcov'],
    coverageThreshold: {
      global: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100
      }
    },
    coveragePathIgnorePatterns: ['node_modules', 'test'],
    collectCoverageFrom: ['src/backend/**/*.ts'],
    setupFilesAfterEnv: ['<rootDir>/src/backend/test/setup.ts'],
    testPathIgnorePatterns: [
      '/node_modules/',
      '/.build/',
      '/lib/',
      '/coverage/',
      '/bin/'
    ],
    verbose: true,
    moduleNameMapper: {
      '@mock/(.*)': '<rootDir>/test/mock/$1'
    }
  };