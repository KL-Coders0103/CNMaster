import { StyleSheet } from "react-native";

export const achievementPopupStyles =
  StyleSheet.create({
    achievementOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.45)",
    },

    achievementCard: {
      width: "85%",
      backgroundColor: "#FFFFFF",
      borderRadius: 24,
      padding: 28,
      alignItems: "center",
    },

    achievementTitle: {
      marginTop: 16,
      fontSize: 20,
      fontWeight: "700",
      color: "#111827",
    },

    achievementName: {
      marginTop: 12,
      fontSize: 18,
      fontWeight: "600",
      color: "#2563EB",
    },

    achievementDescription: {
      marginTop: 12,
      textAlign: "center",
      color: "#6B7280",
      lineHeight: 22,
    },

    achievementXP: {
      marginTop: 20,
      fontSize: 24,
      fontWeight: "700",
      color: "#10B981",
    },

    achievementButton: {
      marginTop: 24,
      backgroundColor: "#2563EB",
      paddingHorizontal: 28,
      paddingVertical: 14,
      borderRadius: 14,
    },

    achievementButtonText: {
      color: "#FFFFFF",
      fontWeight: "700",
    },
  });