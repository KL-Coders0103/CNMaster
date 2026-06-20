import { StyleSheet } from "react-native";
import { ThemePalette } from "../../theme/colors";

export const getChipStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    selectedChip: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    text: {
      color: colors.textPrimary,
      fontWeight: "600",
      fontSize: 14,
    },
    selectedText: {
      color: "#FFFFFF", // Hardcoded white to ensure high contrast on primary color
    },
  });