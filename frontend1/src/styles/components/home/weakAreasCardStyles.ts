import { StyleSheet } from "react-native";

export const weakAreasCardStyles =
  StyleSheet.create({
    weakAreasCard: {
      marginHorizontal: 24,
      marginTop: 20,
      padding: 20,
      borderRadius: 20,
      backgroundColor: "#FFFFFF",
      elevation: 3,
    },

    weakAreaSubtitle: {
      marginTop: 8,
      color: "#6B7280",
      lineHeight: 22,
    },

    chipsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 16,
    },

    chip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: "#EFF6FF",
      marginRight: 12,
      marginBottom: 12,
    },

    chipText: {
      color: "#2563EB",
      fontWeight: "600",
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#111827",
    },
  });