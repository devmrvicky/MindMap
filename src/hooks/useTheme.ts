// import { useCallback, useState, useEffect } from "react";
// import { useThemeStore } from "@/zustand/store.ts";

// type Theme = "light" | "dark" | "system";

// const setThemeClass = (theme: Theme) => {
//   const root = window.document.documentElement;
//   if (theme === "system") {
//     const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//     root.classList.toggle("dark", isDark);
//     root.classList.toggle("light", !isDark);
//   } else {
//     root.classList.toggle("dark", theme === "dark");
//     root.classList.toggle("light", theme === "light");
//   }
// };

// const useTheme = () => {
//   const [currentTheme, setCurrentTheme] = useState<Theme>(
//     (localStorage.getItem("theme") as Theme) || "system"
//   );
//   const switchTheme = useCallback((theme: Theme) => {
//     setThemeClass(theme);
//     setCurrentTheme(theme);
//     if (theme === "system") {
//       localStorage.removeItem("theme");
//     } else {
//       localStorage.setItem("theme", theme);
//     }
//   }, []);

//   // Listen to system theme changes if "system" is selected
//   // and update theme accordingly
//   if (typeof window !== "undefined") {
//     const savedTheme = localStorage.getItem("theme") as Theme | null;
//     if (savedTheme === "system" || !savedTheme) {
//       window.matchMedia("(prefers-color-scheme: dark)").onchange = () => {
//         setThemeClass("system");
//       };
//     }
//   }

//   return { switchTheme, currentTheme };
// };

// export function useThemeInit() {
//   const setDarkMode = useThemeStore(s => s.setDarkMode);

//   const applySystemTheme = useCallback(() => {
//     const isDarkMode = window.matchMedia(
//       "(prefers-color-scheme: dark)"
//     ).matches;
//     setDarkMode(isDarkMode);
//     document.documentElement.classList.toggle("dark", isDarkMode);
//   }, [setDarkMode]);

//   useEffect(() => {
//     applySystemTheme();
//   }, [applySystemTheme]);
// }

// export default useTheme;

import { useCallback, useState, useEffect } from "react";
import { useThemeStore } from "@/zustand/store.ts";

type Theme = "light" | "dark" | "system";

const setThemeClass = (theme: Theme) => {
  const root = document.documentElement;
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

  // Apply theme on first render
  useEffect(() => {
    setThemeClass(currentTheme);
  }, [currentTheme]);

  // Listen to system changes when in "system" mode
  useEffect(() => {
    if (currentTheme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setThemeClass("system");
    media.addEventListener("change", handler);

    return () => media.removeEventListener("change", handler);
  }, [currentTheme]);

  return { switchTheme, currentTheme };
};

// Hook to sync with Zustand (if you want a global darkMode flag)
export function useThemeInit() {
  const setDarkMode = useThemeStore((s) => s.setDarkMode);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateDarkMode = () => {
      const isDark = media.matches;
      setDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.classList.toggle("light", !isDark);
    };

    updateDarkMode(); // initial call
    media.addEventListener("change", updateDarkMode);

    return () => media.removeEventListener("change", updateDarkMode);
  }, [setDarkMode]);
}

export default useTheme;
