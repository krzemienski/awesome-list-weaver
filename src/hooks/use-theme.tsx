
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
  theme: "red",
  setTheme: () => null,
  isDarkMode: true,
  setIsDarkMode: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "red",
  storageKey = "awesome-list-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null;
    const savedDarkMode = localStorage.getItem(`${storageKey}-dark-mode`);
    
    // Set theme - default to red if no saved theme
    if (savedTheme && ["default", "rose", "red", "orange", "green", "blue", "yellow", "violet"].includes(savedTheme)) {
      setTheme(savedTheme);
    } else {
      setTheme("red");
      localStorage.setItem(storageKey, "red");
    }
    
    // Set dark mode - default to true if no saved preference
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === "true");
    } else {
      setIsDarkMode(true);
      localStorage.setItem(`${storageKey}-dark-mode`, "true");
    }
  }, [storageKey]);

  // Apply theme and dark mode changes to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, isDarkMode]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
    isDarkMode,
    setIsDarkMode: (isDark: boolean) => {
      localStorage.setItem(`${storageKey}-dark-mode`, String(isDark));
      setIsDarkMode(isDark);
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
