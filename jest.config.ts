const defineJestConfig =
  require('@tarojs/test-utils-react/dist/jest.js').default

module.exports = defineJestConfig({
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
})
