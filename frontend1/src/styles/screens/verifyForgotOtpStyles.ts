import { StyleSheet } from "react-native";

import { COLORS } from "../../theme/colors";
import { SPACING } from "../../theme/spacing";

export const verifyForgotOtpStyles =
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

    emailText: {
      textAlign: "center",
      color:
        COLORS.textPrimary,
      marginBottom:
        SPACING.md,
    },

    resendText: {
      textAlign: "center",
      color:
        COLORS.primary,
      fontWeight: "600",
      marginTop:
        SPACING.md,
    },

    disabledText: {
      opacity: 0.5,
    },
  });