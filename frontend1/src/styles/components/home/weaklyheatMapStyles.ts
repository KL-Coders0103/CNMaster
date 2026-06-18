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
    heatmapWrapper: {
      marginTop: SPACING.md,
    },

    heatmapGrid: {
      flexDirection: "row",
      gap: 4,
    },

    weekColumn: {
      gap: 4,
    },

    heatmapSquare: {
      width: 14,
      height: 14,
      borderRadius: 3,
    },

    legendContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: SPACING.lg,
    },

    legendLeft: {
      flexDirection: "row",
      alignItems: "center",
    },

    legendText: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: "600",
    },

    legendSquares: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginLeft: 8,
    },

    monthLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },

    monthText: {
      color: colors.textSecondary,
      fontSize: 11,
      fontWeight: "600",
    },

    summaryText: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: "600",
    },
  });