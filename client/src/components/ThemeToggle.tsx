import { useTheme } from "@/providers/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const { toggleTheme, isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Wait until mounted to render to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  return (
    <div className="flex items-center space-x-2">
      <span className="hidden md:inline-block text-sm text-github-dark dark:text-github-darkmode-text">Dark Mode</span>
      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        className="relative inline-flex h-6 w-11 items-center rounded-full border-2 border-transparent bg-gray-200 dark:bg-gray-700 transition-colors duration-200 ease-in-out focus:outline-none"
      >
        <span className="sr-only">Toggle dark mode</span>
        <span 
          className={`${
            isDarkMode ? "translate-x-5" : "translate-x-0"
          } inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  );
}
