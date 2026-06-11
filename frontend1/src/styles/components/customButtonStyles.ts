import { StyleSheet } from "react-native";

import { COLORS } from "../../theme/colors";

export const customButtonStyles =
  StyleSheet.create({
    button: {
      height: 58,

      borderRadius: 18,

      backgroundColor:
        COLORS.primary,

      justifyContent:
        "center",

      alignItems:
        "center",

      shadowColor:
        "#000",

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity: 0.12,

      shadowRadius: 10,

      elevation: 4,
    },

    pressed: {
      opacity: 0.9,

      transform: [
        {
          scale: 0.98,
        },
      ],
    },

    text: {
      color: COLORS.white,

      fontSize: 16,

      fontWeight: "700",
    },

    disabled: {
      opacity: 0.6,
    },
  });