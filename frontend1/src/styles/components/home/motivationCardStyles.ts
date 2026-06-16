import { StyleSheet } from "react-native";
import { SPACING } from "../../../theme/spacing";
import { RADIUS } from "../../../theme/radius";
import { ThemePalette } from "../../../theme/colors";

export const getMotivationCardStyles = (colors: ThemePalette) => 
  StyleSheet.create({
    motivationCard: {
      marginHorizontal: SPACING.lg,
      marginTop: SPACING.lg, 
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
    },
    quoteText: {
      marginTop: SPACING.md,
      fontSize: 16,
      lineHeight: 26,
      color: colors.textPrimary,
      fontStyle: "italic",
      fontWeight: "500",
    },
    quoteAuthor: {
      marginTop: SPACING.md,
      textAlign: "right",
      color: colors.textSecondary,
      fontWeight: "700",
    },
  });