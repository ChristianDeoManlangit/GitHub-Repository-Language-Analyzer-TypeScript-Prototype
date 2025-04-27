import { createContext, useContext, useEffect } from "react";

type Theme = "light";

interface ThemeContextType {
  theme: Theme;
  isDarkMode: false;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme: Theme = "light";

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark");
    document.body.classList.remove("dark", "bg-github-darkmode-bg");
    document.body.style.backgroundColor = "#ffffff";
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode: false }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}