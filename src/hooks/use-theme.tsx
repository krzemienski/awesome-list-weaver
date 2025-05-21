
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Theme } from "@/types";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
};

const initialState: ThemeProviderState = {
  theme: "orange",
  setTheme: () => null,
  isDarkMode: true,
  setIsDarkMode: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "orange",
  storageKey = "awesome-list-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null;
    const savedDarkMode = localStorage.getItem(`${storageKey}-dark-mode`);
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // Set theme
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      setTheme("orange");
      document.documentElement.setAttribute("data-theme", "orange");
    }

    // Set dark mode
    const prefersDark = savedDarkMode !== null 
      ? savedDarkMode === "true" 
      : systemPrefersDark;
    
    setIsDarkMode(prefersDark);
    
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [storageKey]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
      document.documentElement.setAttribute("data-theme", theme);
    },
    isDarkMode,
    setIsDarkMode: (isDark: boolean) => {
      localStorage.setItem(`${storageKey}-dark-mode`, String(isDark));
      setIsDarkMode(isDark);
      
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
