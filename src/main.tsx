import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import "./index.css";
import { initializeAuth } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";

// Initialize authentication
initializeAuth();

// Initialize theme store
const initializeTheme = () => {
  const { preset } = useThemeStore.getState();
  useThemeStore.getState().applyPreset(preset);
};

// Initialize theme on app start
initializeTheme();

createRoot(document.getElementById("root")!).render(
  <ThemeProvider 
    attribute="class" 
    defaultTheme="light" 
    enableSystem 
    themes={["light", "dark", "warm", "sunset", "abstract", "dotted-indigo", "lagoon", "dark-nature", "full-gradient", "sea-purple"]}
  >
    <App />
  </ThemeProvider>
);
