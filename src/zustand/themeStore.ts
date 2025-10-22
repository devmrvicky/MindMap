import { create } from "zustand";

const useThemeStore = create<ThemeStoreState>((set) => ({
  isDarkMode: false,
  setDarkMode: (isDark: boolean) =>
    set(() => ({
      isDarkMode: isDark,
    })),
}));

export default useThemeStore;
