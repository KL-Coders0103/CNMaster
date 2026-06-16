import { StyleSheet } from "react-native";
import { SPACING } from "../../../theme/spacing";
import { RADIUS } from "../../../theme/radius";
import { ThemePalette } from "../../../theme/colors";

export const getHomeSkeletonStyles = (colors: ThemePalette) => 
  StyleSheet.create({
    container: {
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.lg, 
    },
    skeletonBlock: {
      borderRadius: RADIUS.lg, 
      backgroundColor: colors.border,
      marginBottom: SPACING.lg, 
    },
  });