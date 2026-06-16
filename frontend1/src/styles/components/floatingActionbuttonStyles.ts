import { StyleSheet } from "react-native";
import { SPACING } from "../../theme/spacing";
import { RADIUS } from "../../theme/radius";
import { TYPOGRAPHY } from "../../theme/typography";
import { ThemePalette } from "../../theme/colors";

export const getFloatingButtonStyles = (colors: ThemePalette) => 
  StyleSheet.create({
    fab: {
      position: "absolute",
      bottom: SPACING.lg,
      right: SPACING.lg,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
      zIndex: 100,
    },
    overlay: {
      flex: 1,
      backgroundColor: colors.isDarkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.8)", 
      justifyContent: "flex-end",
    },
    menuContainer: {
      position: "absolute",
      bottom: 100, 
      right: SPACING.lg,
      alignItems: "flex-end",
      gap: SPACING.md,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    menuText: {
      fontSize: TYPOGRAPHY.button,
      fontWeight: "600",
      color: colors.textPrimary,
      backgroundColor: colors.surface,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: RADIUS.sm,
      overflow: "hidden",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1, 
      shadowRadius: 4,
      elevation: 2,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24, 
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1, 
      shadowRadius: 8,
      elevation: 4,
      backgroundColor: colors.surface,
    },
  });