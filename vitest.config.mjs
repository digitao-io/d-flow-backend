import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    globals: true,
    watch: false,

    fileParallelism: false,
    sequence: {
      concurrent: false,
    },
  },
});
