module.exports = {
    roots: ['<rootDir>/src/test/smoke'],
    coverageDirectory: '<rootDir>/smoke-output/smoke/reports',
    testRegex: '(/src/test/.*|\\.test)\\.(ts|js)$',
    testEnvironment: 'node',
    testRunner: 'jest-circus/runner',
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
  };