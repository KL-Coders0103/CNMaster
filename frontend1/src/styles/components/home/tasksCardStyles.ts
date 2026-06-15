import { StyleSheet } from "react-native";

export const tasksCardStyles =
  StyleSheet.create({
    tasksCard: {
      marginHorizontal: 24,
      marginTop: 20,
      padding: 20,
      borderRadius: 20,
      backgroundColor: "#FFFFFF",
      elevation: 3,
    },

    tasksHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },

    seeAllText: {
      color: "#2563EB",
      fontWeight: "600",
    },

    taskItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },

    taskText: {
      marginLeft: 12,
      fontSize: 15,
      color: "#111827",
    },

    emptyTaskText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#111827",
    },

    emptyTaskSubText: {
      marginTop: 8,
      color: "#6B7280",
      lineHeight: 22,
    },

    openPlannerButton: {
      marginTop: 20,
      alignSelf: "flex-start",
    },

    openPlannerText: {
      color: "#2563EB",
      fontWeight: "600",
    },

    sectionTitle: { 
        fontSize: 18, 
        fontWeight: "700", 
        color: "#111827", 
    },
  });