import { useCallback, useState } from "react";

type Theme = "light" | "dark" | "system";

const setThemeClass = (theme: Theme) => {
  const root = window.document.documentElement;
  if (theme === "system") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", isDark);
    root.classList.toggle("light", !isDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
  }
};

const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "system"
  );
  const switchTheme = useCallback((theme: Theme) => {
    setThemeClass(theme);
    setCurrentTheme(theme);
    if (theme === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", theme);
    }
  }, []);

  // Listen to system theme changes if "system" is selected
  // and update theme accordingly
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme === "system" || !savedTheme) {
      window.matchMedia("(prefers-color-scheme: dark)").onchange = () => {
        setThemeClass("system");
      };
    }
  }

  return { switchTheme, currentTheme };
};

export default useTheme;
