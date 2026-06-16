import { StyleSheet } from "react-native";
import { SPACING } from "../../../theme/spacing";
import { RADIUS } from "../../../theme/radius";
import { TYPOGRAPHY } from "../../../theme/typography";
import { ThemePalette } from "../../../theme/colors";

export const getContinueLearningCardStyles = (colors: ThemePalette) => 
  StyleSheet.create({
    continueCard: { 
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
      fontSize: 20, 
      fontWeight: "900", 
      color: colors.textPrimary, 
      letterSpacing: -0.3,
    }, 
    topicTitle: { 
      fontSize: TYPOGRAPHY.body, 
      fontWeight: "700", 
      marginTop: SPACING.md, 
      color: colors.textPrimary, 
    }, 
    progressLabel: { 
      marginTop: SPACING.sm, 
      color: colors.textSecondary, 
      fontSize: 14,
      fontWeight: "500",
    }, 
    progressBar: { 
      height: 8, 
      borderRadius: 4, 
      backgroundColor: colors.border, 
      marginTop: SPACING.md, 
      overflow: "hidden", 
    }, 
    progressFill: { 
      height: "100%", 
      backgroundColor: colors.primary, 
      borderRadius: 4,
    }, 
    resumeButton: { 
      flexDirection: "row", 
      alignItems: "center", 
      marginTop: 20, 
    }, 
    resumeText: { 
      color: colors.primary, 
      fontWeight: "700", 
      marginRight: SPACING.sm, 
    },
  });