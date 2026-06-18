import {
  StyleSheet,
} from "react-native";

import {
  ThemePalette,
} from "../../../theme/colors";

export const createAddTaskModalStyles =
  (
    colors: ThemePalette
  ) =>
    StyleSheet.create({
      overlay: {
        flex: 1,
        justifyContent:
          "flex-end",

        backgroundColor:
          "rgba(0,0,0,0.4)",
      },

      container: {
        backgroundColor:
          colors.surface,

        borderTopLeftRadius: 28,

        borderTopRightRadius: 28,

        padding: 24,

        paddingBottom: 40,
      },

      title: {
        fontSize: 22,

        fontWeight: "700",

        color:
          colors.textPrimary,

        marginBottom: 24,
      },

      dateButton: {
        borderWidth: 1,

        borderColor:
          colors.border,

        borderRadius: 14,

        padding: 16,

        marginBottom: 16,
      },

      dateText: {
        color:
          colors.textPrimary,
      },

      submitButton: {
        backgroundColor:
          colors.primary,

        height: 56,

        borderRadius: 16,

        justifyContent:
          "center",

        alignItems: "center",

        marginTop: 12,
      },

      submitText: {
        color:
          colors.white,

        fontWeight: "700",

        fontSize: 16,
      },
    });