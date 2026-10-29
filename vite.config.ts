import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      // Must come before react()
      tanstackRouter({ target: "react", autoCodeSplitting: true }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      // Reads the "@/*" alias from tsconfig.app.json
      tsconfigPaths: true,
    },
    server: {
      proxy: {
        "/api": {
          target: env.API_TARGET || "http://localhost:8080",
          changeOrigin: true,
        },
      },
    },
  };
});
