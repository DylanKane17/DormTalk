"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();
const THEME_STORAGE_KEY = "theme-preference";
const LEGACY_THEME_STORAGE_KEY = "theme";

const getSystemTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const resolveTheme = (preference) => {
  if (preference === "light" || preference === "dark") {
    return preference;
  }
  return getSystemTheme();
};

const applyResolvedTheme = (resolvedTheme) => {
  const root = document.documentElement;
  root.classList.toggle("dark", resolvedTheme === "dark");
  root.setAttribute("data-theme", resolvedTheme);
  root.style.colorScheme = resolvedTheme;
};

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(() => {
    if (typeof window !== "undefined") {
      const storedTheme =
        localStorage.getItem(THEME_STORAGE_KEY) ||
        localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
      if (
        storedTheme === "light" ||
        storedTheme === "dark" ||
        storedTheme === "system"
      ) {
        return storedTheme;
      }
    }
    return "system";
  });
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const resolvedTheme = resolveTheme(preference);
    setTheme(resolvedTheme);
    applyResolvedTheme(resolvedTheme);
    localStorage.setItem(THEME_STORAGE_KEY, preference);
    localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
  }, [preference]);

  useEffect(() => {
    if (preference !== "system") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      const resolvedTheme = getSystemTheme();
      setTheme(resolvedTheme);
      applyResolvedTheme(resolvedTheme);
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [preference]);

  const toggleTheme = () => {
    setPreference((currentPreference) => {
      const currentResolvedTheme = resolveTheme(currentPreference);
      return currentResolvedTheme === "dark" ? "light" : "dark";
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
