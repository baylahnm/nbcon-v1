import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/pages/1-HomePage/others/components"),
      "@/lib": path.resolve(__dirname, "./src/pages/1-HomePage/others/lib"),
      "@/stores": path.resolve(__dirname, "./src/pages/1-HomePage/others/stores"),
      "@/types": path.resolve(__dirname, "./src/pages/1-HomePage/others/types"),
      "@/utils": path.resolve(__dirname, "./src/pages/1-HomePage/others/utils"),
      "@/integrations": path.resolve(__dirname, "./src/pages/1-HomePage/others/integrations"),
      // Legacy support for files that haven't been updated yet
      "@/components/ui": path.resolve(__dirname, "./src/pages/1-HomePage/others/components/ui"),
    },
  },
}));
