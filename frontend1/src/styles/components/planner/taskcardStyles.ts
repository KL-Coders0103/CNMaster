import {
  StyleSheet,
} from "react-native";

import {
  ThemePalette,
} from "../../../theme/colors";

export const createTaskCardStyles =
  (
    colors: ThemePalette
  ) =>
    StyleSheet.create({
      container: {
        flexDirection: "row",
        alignItems: "flex-start",

        backgroundColor:
          colors.surface,

        borderWidth: 1,

        borderColor:
          colors.border,

        borderRadius: 18,

        padding: 16,

        marginBottom: 14,
      },

      content: {
        flex: 1,
        marginLeft: 14,
      },

      title: {
        fontSize: 16,
        fontWeight: "600",

        color:
          colors.textPrimary,
      },

      description: {
        marginTop: 6,

        color:
          colors.textSecondary,

        lineHeight: 20,
      },

      dueDate: {
        marginTop: 10,

        fontSize: 12,

        color:
          colors.primary,
      },

      actions: {
        marginLeft: 12,
      },
    });