import { StyleSheet } from "react-native";
import { ThemePalette } from "../../../theme/colors";

export const getHomeStatsStyles = (colors: ThemePalette) => 
  StyleSheet.create({
    statsContainer: {
      flexDirection: "row",
      marginTop: 20,
      alignItems: "center",
    },
    streakText: {
      fontWeight: "700",
      color: colors.textPrimary, 
    },
    levelText: {
      fontWeight: "700",
      color: colors.textPrimary,
    },
    xpContainer: {
      marginTop: 18,
    },

    xpHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },

    xpLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
    },

    xpValue: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.primary,
    },

    progressBackground: {
      height: 8,
      borderRadius: 999,
      backgroundColor: colors.border,
      overflow: "hidden",
    },

    progressFill: {
      height: "100%",
      borderRadius: 999,
      backgroundColor: colors.primary,
    },
    notificationBadge: {
      position: "absolute",
      top: -6,
      right: -6,
      backgroundColor: colors.error,
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.background, 
    },
    badgeText: {
      color: colors.white,
      fontSize: 10,
      fontWeight: "800",
    },
  });