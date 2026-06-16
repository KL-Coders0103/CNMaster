import { StyleSheet } from "react-native";
import { ThemePalette } from "../../theme/colors";

export const getStudentHomeStyles = (colors: ThemePalette) => 
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      paddingBottom: 120,
    },
  });