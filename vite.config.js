import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "https://care24-backend.onrender.com",
    },
  },
  build: {
    rollupOptions: {
      output: {
        codeSplitting:true,
      },
    },
  },
});
