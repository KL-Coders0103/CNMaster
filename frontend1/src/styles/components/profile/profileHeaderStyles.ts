import {
  StyleSheet,
} from "react-native";

import {
  SPACING,
} from "../../../theme/spacing";

import {
  RADIUS,
} from "../../../theme/radius";

import {
  ThemePalette,
} from "../../../theme/colors";

export const getProfileHeaderStyles =
  (
    colors: ThemePalette
  ) =>
    StyleSheet.create({
      container: {
        alignItems:
          "center",

        padding: SPACING.xl,
      },

      avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
      },

      avatarPlaceholder:
        {
          width: 110,
          height: 110,
          borderRadius: 55,

          justifyContent:
            "center",

          alignItems:
            "center",

          backgroundColor:
            colors.primary,
        },

      cameraBadge: {
        position:
          "absolute",

        right: 0,
        bottom: 0,

        width: 32,
        height: 32,

        borderRadius: 16,

        justifyContent:
          "center",

        alignItems:
          "center",

        backgroundColor:
          colors.primary,

        borderWidth: 2,

        borderColor:
          colors.surface,
      },

      name: {
        marginTop:
          SPACING.md,

        fontSize: 24,

        fontWeight:
          "800",

        color:
          colors.textPrimary,
      },

      email: {
        marginTop: 4,

        fontSize: 14,

        color:
          colors.textSecondary,
      },

      levelBadge: {
        marginTop:
          SPACING.md,

        paddingHorizontal:
          SPACING.md,

        paddingVertical: 8,

        borderRadius:
          RADIUS.full,

        backgroundColor:
          colors.primary,
      },

      levelText: {
        color:
          colors.white,

        fontWeight:
          "700",
      },
    });