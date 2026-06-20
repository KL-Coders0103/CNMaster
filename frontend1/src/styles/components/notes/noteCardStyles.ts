import { StyleSheet } from "react-native";
import { ThemePalette } from "../../../theme/colors";

export const getNoteCardStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 20,
      marginBottom: 16,
      marginHorizontal: 16, // Added margin here so list fits screen bounds perfectly
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 2,
    },
    header: {
      flexDirection: "row",
    },
    pdfBadge: {
      width: 52,
      height: 52,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(37,99,235,0.1)", // Consistent primary tint
    },
    content: {
      flex: 1,
      marginLeft: 16,
      justifyContent: "center",
    },
    title: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: "700",
    },
    description: {
      marginTop: 4,
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 20,
    },
    tagsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 16,
    },
    tag: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: colors.background,
      marginRight: 8,
      marginBottom: 8,
    },
    tagText: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: "600",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    metaRow: {
      flexDirection: "row",
    },
    meta: {
      flexDirection: "row",
      alignItems: "center",
    },
    metaText: {
      marginLeft: 6,
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: "600",
    },
  });