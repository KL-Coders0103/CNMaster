import { StyleSheet } from "react-native";

export const motivationCardStyles =
  StyleSheet.create({
    motivationCard: {
      marginHorizontal: 24,
      marginTop: 20,
      padding: 20,
      borderRadius: 20,
      backgroundColor: "#FFFFFF",
      elevation: 3,
    },

    quoteText: {
      marginTop: 16,
      fontSize: 16,
      lineHeight: 26,
      color: "#111827",
      fontStyle: "italic",
    },

    quoteAuthor: {
      marginTop: 16,
      textAlign: "right",
      color: "#6B7280",
      fontWeight: "600",
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#111827",
    },
  });