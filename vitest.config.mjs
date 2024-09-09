import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    globals: true,
    poolOptions: {
      threads: {
        singleThread: true,
        isolate: true,
      },
    },
  },
});
