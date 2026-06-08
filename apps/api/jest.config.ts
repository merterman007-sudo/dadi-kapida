import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/test"],
  testMatch: ["<rootDir>/**/*.spec.ts", "<rootDir>/**/*.e2e-spec.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  moduleNameMapper: {
    "^@dadi-kapida/(.*)$": "<rootDir>/../../packages/$1/src/index.ts"
  },
  clearMocks: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/main.ts",
    "!src/**/*.module.ts",
    "!src/**/*.dto.ts"
  ]
};

export default config;
