import {
  StyleSheet,
} from "react-native";

import {
  ThemePalette,
} from "../../theme/colors";

import {
  SPACING,
} from "../../theme/spacing";

export const getProfileScreenStyles =
  (
    colors: ThemePalette
  ) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor:
          colors.background,
      },

      contentContainer: {
        paddingBottom: 120,
      },

      menuSection: {
        marginTop:
          SPACING.lg,

        marginHorizontal:
          SPACING.lg,
      },
    });