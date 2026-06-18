import {
  StyleSheet,
} from "react-native";

import {
  ThemePalette,
} from "../../theme/colors";

import {
  SPACING,
} from "../../theme/spacing";

export const getEditProfileStyles =
  (
    colors: ThemePalette
  ) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor:
          colors.background,
      },

      content: {
        padding:
          SPACING.lg,

        gap:
          SPACING.md,
      },
    });