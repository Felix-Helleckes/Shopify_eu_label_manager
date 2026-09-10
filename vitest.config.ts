import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    env: { MAIL_DRY_RUN: "true", IP_HASH_SECRET: "test" },
  },
});
