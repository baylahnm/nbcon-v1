import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import "./index.css";
import { initializeAuth } from "@/stores/auth";

// Initialize authentication
initializeAuth();

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem themes={["light", "dark", "warm"]}>
    <App />
  </ThemeProvider>
);
