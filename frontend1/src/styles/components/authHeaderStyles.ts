import { StyleSheet } from "react-native";

import { COLORS } from "../../theme/colors";

export const authHeaderStyles =
  StyleSheet.create({
    container: {
      paddingTop: 60,
      paddingBottom: 32,
    },

    title: {
      fontSize: 32,
      fontWeight: "700",
      color: COLORS.primary,
    },

    subtitle: {
      marginTop: 8,
      fontSize: 16,
      color: COLORS.textSecondary,
    },
  });