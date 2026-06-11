import { StyleSheet } from "react-native";

import { COLORS } from "../../theme/colors";
import { SPACING } from "../../theme/spacing";

export const registerStyles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },

    scrollContainer: {
      flexGrow: 1,
      paddingBottom:
        SPACING.xl,
    },

    headerContainer: {
      paddingHorizontal:
        SPACING.lg,

      paddingTop:
        SPACING.xxl,

      paddingBottom:
        SPACING.xl,
    },

    badge: {
      alignSelf: "flex-start",

      backgroundColor:
        "rgba(79,70,229,0.1)",

      borderRadius: 999,

      paddingHorizontal: 12,

      paddingVertical: 6,

      marginBottom:
        SPACING.md,
    },

    badgeText: {
      color:
        COLORS.primary,

      fontSize: 12,

      fontWeight: "700",
    },

    title: {
      fontSize: 32,

      fontWeight: "800",

      color:
        COLORS.textPrimary,

      lineHeight: 40,
    },

    subtitle: {
      marginTop:
        SPACING.sm,

      color:
        COLORS.textSecondary,

      fontSize: 15,

      lineHeight: 22,
    },

    formContainer: {
      flex: 1,

      backgroundColor:
        COLORS.surface,

      marginHorizontal:
        SPACING.lg,

      borderRadius: 32,

      padding:
        SPACING.lg,

      shadowColor:
        "#000",

      shadowOffset: {
        width: 0,
        height: 6,
      },

      shadowOpacity: 0.08,

      shadowRadius: 20,

      elevation: 5,
    },

    googleButton: {
      height: 58,

      borderRadius: 18,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      justifyContent:
        "center",

      alignItems:
        "center",

      marginTop:
        SPACING.md,
    },

    googleButtonText: {
      color:
        COLORS.textPrimary,

      fontWeight: "700",

      fontSize: 15,
    },

    dividerContainer: {
      flexDirection:
        "row",

      alignItems:
        "center",

      marginVertical:
        SPACING.lg,
    },

    divider: {
      flex: 1,

      height: 1,

      backgroundColor:
        COLORS.border,
    },

    dividerText: {
      marginHorizontal:
        SPACING.md,

      color:
        COLORS.textSecondary,

      fontSize: 13,

      fontWeight: "600",
    },

    loginText: {
      textAlign:
        "center",

      color:
        COLORS.textSecondary,

      fontSize: 14,

      marginTop:
        SPACING.lg,
    },

    loginLink: {
      color:
        COLORS.primary,

      fontWeight: "700",
    },
  });