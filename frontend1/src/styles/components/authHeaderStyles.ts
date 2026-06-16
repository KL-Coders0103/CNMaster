import { StyleSheet } from "react-native";
import { ThemePalette } from "../../theme/colors";

export const getAuthHeaderStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    container: {
      paddingTop: 60,
      paddingBottom: 32,
    },
    title: {
      fontSize: 32,
      fontWeight: "700",
      color: colors.primary,
    },
    subtitle: {
      marginTop: 8,
      fontSize: 16,
      color: colors.textSecondary,
    },
  });