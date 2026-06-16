import { StyleSheet } from "react-native";
import { SPACING } from "../../../theme/spacing";
import { RADIUS } from "../../../theme/radius";
import { ThemePalette } from "../../../theme/colors";

export const getWeeklyHeatMapStyles = (colors: ThemePalette) => 
  StyleSheet.create({
    card: {
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
      marginBottom: 20,
    },
    heatmapContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dayColumn: {
      alignItems: "center",
      gap: SPACING.sm,
    },
    heatmapSquare: {
      width: 38, 
      height: 38,
      borderRadius: 10, 
      backgroundColor: colors.isDarkMode ? colors.background : "#F1F5F9", 
      borderWidth: 1,
      borderColor: colors.isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", 
    },
    dayLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "700",
      marginTop: 4,
    },
  });