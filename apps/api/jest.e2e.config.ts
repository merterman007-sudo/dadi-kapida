import type { Config } from "jest";
import baseConfig from "./jest.config";

const config: Config = {
  ...baseConfig,
  testMatch: ["<rootDir>/test/**/*.e2e-spec.ts"]
};

export default config;

