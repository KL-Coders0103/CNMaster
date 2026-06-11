import { StyleSheet } from "react-native";

import { COLORS } from "../../theme/colors";

export const customInputStyles =
  StyleSheet.create({
    container: {
      marginBottom: 20,
    },

    label: {
      fontSize: 14,
      fontWeight: "600",
      color: COLORS.textPrimary,
      marginBottom: 8,
    },

    inputContainer: {
      position: "relative",
      justifyContent: "center",
    },

    input: {
      height: 58,

      borderRadius: 18,

      borderWidth: 1,

      borderColor: COLORS.border,

      backgroundColor: COLORS.surface,

      paddingHorizontal: 18,

      paddingRight: 60,

      fontSize: 16,

      color: COLORS.textPrimary,

      shadowColor: "#000",

      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity: 0.05,

      shadowRadius: 8,

      elevation: 2,
    },

    errorInput: {
      borderColor: COLORS.error,
    },

    errorText: {
      marginTop: 6,

      fontSize: 12,

      color: COLORS.error,
    },

    rightButton: {
      position: "absolute",

      right: 18,
    },

    rightText: {
      color: COLORS.primary,

      fontSize: 14,

      fontWeight: "700",
    },
  });