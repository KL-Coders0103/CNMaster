import { StyleSheet } from "react-native";
import { ThemePalette } from "../../theme/colors";

export const getCustomButtonStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    button: {
      height: 58,
      borderRadius: 18,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 4,
    },
    pressed: {
      opacity: 0.9,
      transform: [{ scale: 0.98 }],
    },
    text: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "700",
    },
    disabled: {
      opacity: 0.6,
    },
  });