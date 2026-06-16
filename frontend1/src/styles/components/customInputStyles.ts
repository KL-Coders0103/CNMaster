import { StyleSheet } from "react-native";
import { ThemePalette } from "../../theme/colors";

export const getCustomInputStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 8,
    },
    inputContainer: {
      position: "relative",
      justifyContent: "center",
    },
    input: {
      height: 58,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: 18,
      paddingRight: 60,
      fontSize: 16,
      color: colors.textPrimary,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    errorInput: {
      borderColor: colors.error,
    },
    errorText: {
      marginTop: 6,
      fontSize: 12,
      color: colors.error,
    },
    rightButton: {
      position: "absolute",
      right: 18,
    },
    rightText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "700",
    },
  });