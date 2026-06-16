import { StyleSheet } from "react-native";
import { ThemePalette } from "../../theme/colors";

export const getSplashStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
  });