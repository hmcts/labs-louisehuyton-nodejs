module.exports = {
    roots: ['<rootDir>/src/test/smoke'],
    output: process.cwd() + '/smoke-output',
    testRegex: '(/src/test/.*|\\.test)\\.(ts|js)$',
    testEnvironment: 'node',
    testRunner: 'jest-circus/runner',
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
  };