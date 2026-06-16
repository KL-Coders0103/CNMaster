import { StyleSheet } from "react-native";
import { SPACING } from "../../../theme/spacing";
import { RADIUS } from "../../../theme/radius";
import { ThemePalette } from "../../../theme/colors";

export const getAchievementPopupStyles = (colors: ThemePalette) => 
  StyleSheet.create({
    achievementOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.isDarkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(15, 23, 42, 0.6)", 
    },
    achievementCard: {
      width: "85%",
      backgroundColor: colors.surface,
      borderRadius: 28, 
      padding: SPACING.xl, 
      alignItems: "center",
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
    },
    achievementTitle: {
      marginTop: 20,
      fontSize: 22,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    achievementName: {
      marginTop: SPACING.sm,
      fontSize: 18,
      fontWeight: "700",
      color: colors.primary, 
    },
    achievementDescription: {
      marginTop: 12,
      textAlign: "center",
      color: colors.textSecondary,
      lineHeight: 24,
      fontSize: 15,
    },
    achievementXP: {
      marginTop: SPACING.lg,
      fontSize: 28,
      fontWeight: "800",
      color: colors.success, 
    },
    achievementButton: {
      marginTop: SPACING.xl,
      backgroundColor: colors.primary, 
      paddingHorizontal: SPACING.xl,
      paddingVertical: SPACING.md,
      borderRadius: RADIUS.md,
      width: "100%",
      alignItems: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    achievementButtonText: {
      color: colors.white,
      fontWeight: "800",
      fontSize: 16,
    },
  });