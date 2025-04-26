import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Check for system preference or stored preference
  const getInitialTheme = (): Theme => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") as Theme | null;
      
      if (storedTheme) {
        return storedTheme;
      }
      
      // Check system preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    
    return "light";
  };
  
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const isDarkMode = theme === "dark";
  
  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
      document.body.classList.add("dark", "bg-github-darkmode-bg");
      document.body.style.backgroundColor = "#1a2230"; // Ensure background color is applied
    } else {
      root.classList.remove("dark");
      document.body.classList.remove("dark", "bg-github-darkmode-bg");
      document.body.style.backgroundColor = "#ffffff"; // Reset to white for light mode
    }
    
    // Store theme preference
    localStorage.setItem("theme", theme);
  }, [theme]);
  
  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use the theme context
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
}
