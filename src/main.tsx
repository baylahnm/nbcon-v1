import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import "./index.css";
import { initializeAuth } from "@/pages/2-auth/others/stores/auth";
import { useThemeStore } from "@/pages/1-HomePage/others/stores/theme";
import "./pages/1-HomePage/others/lib/i18n/i18n";

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
    themes={["light", "dark", "wazeer", "sunset", "abstract", "nika", "lagoon", "dark-nature", "full-gradient", "sea-purple"]}
  >
    <App />
  </ThemeProvider>
);
