import {
  StyleSheet,
} from "react-native";

import {
  COLORS,
} from "../../theme/colors";

export const otpInputStyles =
  StyleSheet.create({
    container: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      marginVertical:
        24,
    },

    input: {
      width: 52,

      height: 60,

      borderRadius: 18,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      backgroundColor:
        COLORS.surface,

      textAlign:
        "center",

      fontSize: 24,

      fontWeight:
        "700",

      color:
        COLORS.textPrimary,

      shadowColor:
        "#000",

      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity: 0.05,

      shadowRadius: 8,

      elevation: 2,
    },
  });