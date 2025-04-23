/// <reference types="vitest" />
import camelCase from "camelcase";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import packageJson from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: camelCase(packageJson.name, { pascalCase: true }),
      formats: ["es", "cjs"],
      fileName: (format) => `${packageJson.name}.${format}.js`,
    },
  },
  plugins: [dts({ rollupTypes: true })],
  test: {
    globals: true,
    environment: "node",
  },
});
