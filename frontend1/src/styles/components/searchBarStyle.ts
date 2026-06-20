import { StyleSheet } from "react-native";
import { ThemePalette } from "../../theme/colors";

export const getSearchBarStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      paddingHorizontal: 16,
      height: 56,
    },
    input: {
      flex: 1,
      marginLeft: 12,
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: "500",
    },
  });