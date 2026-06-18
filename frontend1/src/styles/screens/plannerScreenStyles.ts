import { StyleSheet } from "react-native";

import {
  ThemePalette,
} from "../../theme/colors";

export const createPlannerScreenStyles =
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
        paddingHorizontal: 20,
        paddingBottom: 120,
      },
    });