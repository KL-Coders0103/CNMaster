import {
  StyleSheet,
} from "react-native";

import {
  ThemePalette,
} from "../../../theme/colors";

export const createPlannerHeaderStyles =
  (
    colors: ThemePalette
  ) =>
    StyleSheet.create({
      container: {
        flexDirection: "row",
        justifyContent:
          "space-between",
        alignItems: "center",
        marginTop: 12,
        marginBottom: 24,
      },

      title: {
        fontSize: 28,
        fontWeight: "700",
        color:
          colors.textPrimary,
      },

      date: {
        marginTop: 6,
        fontSize: 14,
        color:
          colors.textSecondary,
      },

      addButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor:
          colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 14,
      },

      addButtonText: {
        color:
          colors.white,
        fontWeight: "600",
        marginLeft: 6,
      },
    });