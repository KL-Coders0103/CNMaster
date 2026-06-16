import { StyleSheet } from "react-native";
import { SPACING } from "../../../theme/spacing";
import { RADIUS } from "../../../theme/radius";
import { ThemePalette } from "../../../theme/colors";

export const getUpcomingDeadlineCardStyles = (colors: ThemePalette) => 
  StyleSheet.create({
    container: {
      marginHorizontal: SPACING.lg, 
      marginTop: SPACING.lg, 
      borderRadius: RADIUS.lg, 
      overflow: "hidden",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 6,
    },
    content: {
      padding: SPACING.lg, 
      zIndex: 2,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING.md,
    },
    badge: {
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: RADIUS.sm,
    },
    badgeText: {
      color: colors.white,
      fontSize: 12,
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    title: {
      fontSize: 22,
      fontWeight: "800",
      color: colors.white,
      marginBottom: 12,
    },
    timerText: {
      fontSize: 15,
      color: colors.background, 
      fontWeight: "600",
      opacity: 0.95,
    },
    timerRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    bgIcon: {
      position: "absolute",
      right: -24,
      bottom: -24,
      opacity: 0.1,
      zIndex: 1,
      transform: [{ rotate: "-15deg" }],
    },
  });