import { StyleSheet } from "react-native";
import { SPACING } from "../../theme/spacing";
import { ThemePalette } from "../../theme/colors";

export const getLoginStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingBottom: SPACING.xl,
    },
    headerContainer: {
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.xxl,
      paddingBottom: SPACING.xl,
    },
    badge: {
      alignSelf: "flex-start",
      backgroundColor: colors.isDarkMode ? "rgba(99, 102, 241, 0.15)" : "rgba(79,70,229,0.1)",
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginBottom: SPACING.md,
    },
    badgeText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "700",
    },
    title: {
      fontSize: 32,
      fontWeight: "800",
      color: colors.textPrimary,
      lineHeight: 40,
    },
    subtitle: {
      marginTop: SPACING.sm,
      color: colors.textSecondary,
      fontSize: 15,
      lineHeight: 22,
    },
    formContainer: {
      flex: 1,
      backgroundColor: colors.surface,
      marginHorizontal: SPACING.lg,
      borderRadius: 32,
      padding: SPACING.lg,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 20,
      elevation: 5,
    },
    forgotPasswordText: {
      color: colors.primary,
      fontWeight: "700",
      textAlign: "right",
      marginTop: -8,
    },
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: SPACING.lg,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      marginHorizontal: SPACING.md,
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: "600",
    },
    googleButton: {
      height: 58,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    googleButtonText: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: "700",
    },
    registerText: {
      textAlign: "center",
      color: colors.textSecondary,
      marginTop: SPACING.lg,
      fontSize: 14,
    },
    registerLink: {
      color: colors.primary,
      fontWeight: "700",
    },
  });