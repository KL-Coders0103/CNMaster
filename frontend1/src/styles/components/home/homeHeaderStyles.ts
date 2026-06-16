import { StyleSheet } from "react-native";
import { SPACING } from "../../../theme/spacing";
import { ThemePalette } from "../../../theme/colors";

export const getHomeHeaderStyles = (colors: ThemePalette) => 
  StyleSheet.create({
    headerContainer: {
      paddingHorizontal: SPACING.lg, 
      paddingTop: SPACING.xl, 
      paddingBottom: SPACING.md,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    textColumn: {
      flex: 1,
      paddingRight: SPACING.md,
    },
    greeting: {
      fontSize: 15,
      color: colors.textSecondary,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5, 
    },
    username: {
      fontSize: 32, 
      fontWeight: "900",
      color: colors.textPrimary,
      marginTop: 2,
      letterSpacing: -0.5, 
    },
    subtitle: {
      marginTop: SPACING.sm,
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    headerIcons: {
      flexDirection: "row",
      alignItems: "center", 
      gap: SPACING.md, 
    },
  });