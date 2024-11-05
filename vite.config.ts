import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { ViteUserConfig } from "vitest/dist/config";

const vitestConfig: ViteUserConfig = {
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts"
  }
};

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  ...vitestConfig
});
