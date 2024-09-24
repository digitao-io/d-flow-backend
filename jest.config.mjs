export default {
  preset: "ts-jest",
  transform: { ".test.ts": ["ts-jest", { tsconfig: "tsconfig.test.json" }] },
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
};
