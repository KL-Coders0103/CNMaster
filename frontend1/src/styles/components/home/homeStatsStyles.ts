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