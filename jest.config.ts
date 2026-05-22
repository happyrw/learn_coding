import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts"],

  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: {
          module: "CommonJS",
          moduleResolution: "node",
          verbatimModuleSyntax: false,
          rewriteRelativeImportExtensions: false,
          ignoreDeprecations: "6.0",
        },
      },
    ],
  },

  moduleFileExtensions: ["ts", "js", "json"],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  clearMocks: true,
};

export default config;
