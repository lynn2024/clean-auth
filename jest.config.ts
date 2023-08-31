import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@clean-auth/(.*)$': '<rootDir>/packages/$1/src'
  }
}

export default config
