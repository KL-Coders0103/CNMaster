import { StyleSheet } from "react-native";

import { COLORS } from "../../theme/colors";

export const splashStyles =
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent:
        "center",
      alignItems:
        "center",
      backgroundColor:
        COLORS.background,
    },
  });