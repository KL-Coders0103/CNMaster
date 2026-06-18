import {
  StyleSheet,
} from "react-native";

import {
  ThemePalette,
} from "../../../theme/colors";

export const createPlannerStatsStyles =
  (
    colors: ThemePalette
  ) =>
    StyleSheet.create({
      container: {
        backgroundColor:
          colors.surface,

        borderRadius: 20,

        padding: 20,

        borderWidth: 1,

        borderColor:
          colors.border,

        marginBottom: 24,
      },

      header: {
        flexDirection: "row",

        justifyContent:
          "space-between",

        alignItems: "center",
      },

      title: {
        fontSize: 16,

        fontWeight: "600",

        color:
          colors.textPrimary,
      },

      percentage: {
        fontSize: 22,

        fontWeight: "700",

        color:
          colors.primary,
      },

      progressBar: {
        height: 10,

        borderRadius: 999,

        backgroundColor:
          colors.border,

        marginTop: 16,

        overflow: "hidden",
      },

      progressFill: {
        height: "100%",

        backgroundColor:
          colors.primary,
      },

      statsRow: {
        flexDirection: "row",

        justifyContent:
          "space-between",

        marginTop: 20,
      },

      statValue: {
        fontSize: 20,

        fontWeight: "700",

        color:
          colors.textPrimary,
      },

      statLabel: {
        marginTop: 4,

        color:
          colors.textSecondary,
      },
    });