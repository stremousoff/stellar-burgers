module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true,
        diagnostics: false
      }
    ]
  },
  moduleNameMapper: {
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@ui/(.*)$': '<rootDir>/src/components/ui/$1',
    '^@utils-types': '<rootDir>/src/utils/types',
    '^@api': '<rootDir>/src/utils/burger-api.ts',
    '^@slices': '<rootDir>/src/services/slices',
    '^@selectors': '<rootDir>/src/services/selectors'
  }
};
