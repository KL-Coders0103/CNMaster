import { StyleSheet } from "react-native";
import { ThemePalette } from "../../theme/colors";

export const createThemedStyles = (colors: ThemePalette) => StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: "center",
  },
  trackActive: {
    backgroundColor: colors.primary,
  },
  trackInactive: {
    backgroundColor: colors.border,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  thumbActive: {
    alignSelf: "flex-end",
  },
  thumbInactive: {
    alignSelf: "flex-start",
  },
});