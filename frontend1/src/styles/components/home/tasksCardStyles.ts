import { StyleSheet } from "react-native";
import { SPACING } from "../../../theme/spacing";
import { RADIUS } from "../../../theme/radius";
import { ThemePalette } from "../../../theme/colors";

export const getTasksCardStyles = (colors: ThemePalette) => 
  StyleSheet.create({
    tasksCard: {
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
    tasksHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    sectionTitle: { 
      fontSize: 20,
      fontWeight: "900",
      color: colors.textPrimary, 
      letterSpacing: -0.3,
    },
    seeAllText: {
      color: colors.primary,
      fontWeight: "700",
    },
    taskItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: SPACING.md,
    },
    taskText: {
      marginLeft: 12,
      fontSize: 15,
      color: colors.textPrimary,
      fontWeight: "500",
    },
    emptyTaskText: {
      fontSize: 17,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    emptyTaskSubText: {
      marginTop: SPACING.sm,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    openPlannerButton: {
      marginTop: 20,
      alignSelf: "flex-start",
    },
    openPlannerText: {
      color: colors.primary,
      fontWeight: "700",
    },
  });