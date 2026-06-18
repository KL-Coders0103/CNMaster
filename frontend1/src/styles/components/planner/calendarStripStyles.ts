import {
  StyleSheet,
} from "react-native";

import {
  ThemePalette,
} from "../../../theme/colors";

export const createCalendarStripStyles =
  (
    colors: ThemePalette
  ) =>
    StyleSheet.create({
      container: {
        flexDirection: "row",

        justifyContent:
          "space-between",

        marginBottom: 24,
      },

      dayContainer: {
        width: 46,

        height: 70,

        borderRadius: 16,

        alignItems: "center",

        justifyContent:
          "center",

        backgroundColor:
          colors.surface,

        borderWidth: 1,

        borderColor:
          colors.border,
      },

      selectedDay: {
        backgroundColor:
          colors.primary,

        borderColor:
          colors.primary,
      },

      dayLabel: {
        fontSize: 12,

        color:
          colors.textSecondary,

        marginBottom: 6,
      },

      dayNumber: {
        fontSize: 18,

        fontWeight: "700",

        color:
          colors.textPrimary,
      },

      dot: {
        width: 6,

        height: 6,

        borderRadius: 999,

        marginTop: 4,

        backgroundColor:
          colors.primary,
      },
    });