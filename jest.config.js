/** @type {import('ts-jest').JestConfigWithTsJest} */

require('dotenv').config({ path: './.env' });

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.cjs.json' }],
  },
  testMatch: ['**/tests/**/*.test.ts'],
};
