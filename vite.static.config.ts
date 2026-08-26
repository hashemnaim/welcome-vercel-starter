import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  define: {
    "import.meta.env.VITE_STATIC_SPA": JSON.stringify("true"),
  },
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-router"],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
