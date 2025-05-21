
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
  // Always use dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null;
    
    // Set theme - default to red if no saved theme
    if (savedTheme && ["default", "rose", "red", "orange", "green", "blue", "yellow", "violet"].includes(savedTheme)) {
      setTheme(savedTheme);
    } else {
      setTheme("red");
      localStorage.setItem(storageKey, "red");
    }
    
    // Always force dark mode, ignoring saved preference
    localStorage.setItem(`${storageKey}-dark-mode`, "true");
  }, [storageKey]);

  // Apply theme and always use dark mode
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    // Always add dark class
    document.documentElement.classList.add("dark");
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
    isDarkMode: true, // Always return true
    setIsDarkMode: () => {
      // Do nothing - we always want dark mode
      localStorage.setItem(`${storageKey}-dark-mode`, "true");
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
