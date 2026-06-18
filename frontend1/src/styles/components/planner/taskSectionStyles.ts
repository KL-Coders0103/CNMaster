import {
  StyleSheet,
} from "react-native";

import {
  ThemePalette,
} from "../../../theme/colors";

export const createTaskSectionStyles =
  (
    colors: ThemePalette
  ) =>
    StyleSheet.create({
      container: {
        marginTop: 24,
      },

      title: {
        fontSize: 18,
        fontWeight: "700",

        marginBottom: 16,

        color:
          colors.textPrimary,
      },
    });