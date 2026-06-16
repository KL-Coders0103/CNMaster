import { StyleSheet } from "react-native";
import { SPACING } from "../../../theme/spacing";
import { RADIUS } from "../../../theme/radius";
import { ThemePalette } from "../../../theme/colors";

export const getWeakAreasCardStyles = (colors: ThemePalette) => 
  StyleSheet.create({
    weakAreasCard: {
      marginHorizontal: SPACING.lg,
      marginTop: SPACING.lg,
      marginBottom: SPACING.xl,
      padding: SPACING.lg,
      borderRadius: RADIUS.lg,
      backgroundColor: colors.surface,
      shadowColor: colors.shadow, 
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
      elevation: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.textPrimary,
      marginBottom: SPACING.md,
    },
    smartReviewContainer: {
      backgroundColor: colors.isDarkMode ? "rgba(99, 102, 241, 0.1)" : "#EEF2FF", 
      borderRadius: 16, 
      padding: 20,
      borderWidth: 1,
      borderColor: colors.isDarkMode ? "rgba(99, 102, 241, 0.2)" : "#E0E7FF",
      marginBottom: SPACING.lg,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    iconBadge: {
      backgroundColor: colors.surface, 
      padding: SPACING.sm,
      borderRadius: RADIUS.sm,
      marginRight: 10,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    smartReviewBadge: {
      fontSize: 12,
      fontWeight: "800",
      color: colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    smartReviewText: {
      fontSize: 15,
      color: colors.textPrimary,
      lineHeight: 24,
      fontWeight: "500",
      marginBottom: 20,
    },
    actionButton: {
      backgroundColor: colors.primary, 
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      borderRadius: RADIUS.md,
      gap: SPACING.sm,
    },
    actionButtonText: {
      color: colors.white,
      fontWeight: "700",
      fontSize: 15,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: SPACING.md,
      fontWeight: "600",
    },
    weakAreaSubtitle: {
      marginBottom: SPACING.md,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    chipsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10, 
    },
    chip: {
      paddingHorizontal: SPACING.md,
      paddingVertical: 10,
      borderRadius: RADIUS.lg,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chipText: {
      color: colors.textSecondary,
      fontWeight: "600",
      fontSize: 13,
    },
  });