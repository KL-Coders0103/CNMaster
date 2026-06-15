import { StyleSheet } from "react-native";

export const homeStatsStyles =
  StyleSheet.create({
    statsContainer: {
      flexDirection: "row",
      marginTop: 18,
    },

    streakText: {
      marginRight: 20,
      fontWeight: "600",
      color: "#2563EB",
    },

    levelText: {
      fontWeight: "600",
      color: "#10B981",
    },

    notificationBadge: {
      position: "absolute",
      top: -5,
      right: -5,
      backgroundColor: "#EF4444",
      borderRadius: 8,
      minWidth: 16,
      height: 16,
      justifyContent: "center",
      alignItems: "center",
    },

    badgeText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "700",
    },
  });