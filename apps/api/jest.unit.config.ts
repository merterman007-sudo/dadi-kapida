import type { Config } from "jest";
import baseConfig from "./jest.config";

const config: Config = {
  ...baseConfig,
  testMatch: ["<rootDir>/src/**/*.spec.ts"]
};

export default config;

