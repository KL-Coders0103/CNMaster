import { create } from "zustand";
import { Appearance } from "react-native";
import { lightPalette, darkPalette, ThemePalette } from "../theme/colors";

interface ThemeState {
  isDarkMode: boolean;
  colors: ThemePalette;
  toggleTheme: () => void;
  syncWithSystem: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDarkMode: Appearance.getColorScheme() === "dark",
  colors: Appearance.getColorScheme() === "dark" ? darkPalette : lightPalette,
  toggleTheme: () => {
    const nextMode = !get().isDarkMode;
    set({
      isDarkMode: nextMode,
      colors: nextMode ? darkPalette : lightPalette,
    });
  },
  syncWithSystem: () => {
    const systemMode = Appearance.getColorScheme() === "dark";
    set({
      isDarkMode: systemMode,
      colors: systemMode ? darkPalette : lightPalette,
    });
  },
}));