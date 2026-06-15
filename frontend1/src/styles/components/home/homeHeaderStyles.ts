import { StyleSheet } from "react-native";

export const homeHeaderStyles =
  StyleSheet.create({
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      paddingTop: 20,
    },

    greeting: {
      fontSize: 14,
      color: "#6B7280",
    },

    username: {
      fontSize: 28,
      fontWeight: "700",
      color: "#111827",
      marginTop: 8,
    },

    subtitle: {
      marginTop: 10,
      fontSize: 14,
      color: "#6B7280",
      lineHeight: 22,
    },

    headerIcons: {
      flexDirection: "row",
      paddingTop: 8,
    },
  });