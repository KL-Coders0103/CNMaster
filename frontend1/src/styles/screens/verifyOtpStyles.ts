import { StyleSheet } from "react-native";
import { SPACING } from "../../theme/spacing";
import { ThemePalette } from "../../theme/colors";

export const getVerifyOtpStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.xl,
    },
    formContainer: {
      marginTop: SPACING.xl,
      gap: SPACING.lg,
    },
    infoText: {
      color: colors.textPrimary,
      textAlign: "center",
      marginBottom: SPACING.md,
    },
    resendText: {
      textAlign: "center",
      color: colors.primary,
      fontWeight: "600",
      marginTop: SPACING.md,
    },
    disabledText: {
      opacity: 0.5,
    },
  });