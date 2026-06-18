import {
  StyleSheet,
} from "react-native";

import {
  ThemePalette,
} from "../../../theme/colors";

export const createEmptyPlannerStyles =
  (
    colors: ThemePalette
  ) =>
    StyleSheet.create({
      container: {
        alignItems: "center",
        justifyContent:
          "center",
        marginTop: 80,
        paddingHorizontal: 24,
      },

      title: {
        marginTop: 20,
        fontSize: 20,
        fontWeight: "700",
        color:
          colors.textPrimary,
      },

      description: {
        marginTop: 12,
        textAlign: "center",
        lineHeight: 24,
        color:
          colors.textSecondary,
      },
    });