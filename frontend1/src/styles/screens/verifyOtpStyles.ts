import { StyleSheet } from "react-native";

import { COLORS } from "../../theme/colors";
import { SPACING } from "../../theme/spacing";

export const verifyOtpStyles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },

    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal:
        SPACING.lg,
      paddingVertical:
        SPACING.xl,
    },

    formContainer: {
      marginTop:
        SPACING.xl,
      gap: SPACING.lg,
    },

    infoText: {
      color: COLORS.textPrimary,
      textAlign: "center",
      marginBottom:
        SPACING.md,
    },

    resendText: {
      textAlign: "center",
      color: COLORS.primary,
      fontWeight: "600",
      marginTop: SPACING.md,
    },

    disabledText: {
      opacity: 0.5,
    },
  });