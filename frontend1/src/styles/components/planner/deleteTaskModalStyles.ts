import {
  StyleSheet,
} from "react-native";

import {
  ThemePalette,
} from "../../../theme/colors";

export const createDeleteTaskModalStyles =
  (
    colors: ThemePalette
  ) =>
    StyleSheet.create({
      overlay: {
        flex: 1,

        justifyContent:
          "center",

        alignItems:
          "center",

        backgroundColor:
          "rgba(0,0,0,0.4)",
      },

      container: {
        width: "85%",

        backgroundColor:
          colors.surface,

        borderRadius: 24,

        padding: 24,
      },

      title: {
        fontSize: 20,

        fontWeight: "700",

        textAlign: "center",

        color:
          colors.textPrimary,
      },

      description: {
        marginTop: 12,

        textAlign: "center",

        lineHeight: 22,

        color:
          colors.textSecondary,
      },

      actionsContainer: {
        flexDirection: "row",

        marginTop: 24,
      },

      cancelButton: {
        flex: 1,

        height: 50,

        borderRadius: 14,

        justifyContent:
          "center",

        alignItems:
          "center",

        marginRight: 8,

        borderWidth: 1,

        borderColor:
          colors.border,
      },

      cancelText: {
        fontWeight: "600",

        color:
          colors.textPrimary,
      },

      deleteButton: {
        flex: 1,

        height: 50,

        borderRadius: 14,

        justifyContent:
          "center",

        alignItems:
          "center",

        marginLeft: 8,

        backgroundColor:
          colors.error,
      },

      deleteText: {
        fontWeight: "700",

        color:
          colors.white,
      },
    });