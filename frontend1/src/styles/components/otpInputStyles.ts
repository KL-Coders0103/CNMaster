import { StyleSheet } from "react-native";
import { ThemePalette } from "../../theme/colors";

export const getOtpInputStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 24,
    },
    input: {
      width: 52,
      height: 60,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      textAlign: "center",
      fontSize: 24,
      fontWeight: "700",
      color: colors.textPrimary,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
  });