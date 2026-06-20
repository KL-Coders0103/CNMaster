import { StyleSheet } from "react-native";
import { ThemePalette } from "../../theme/colors";
import { SPACING } from "../../theme/spacing";

export const getNotesScreenStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    
    // --- List & Layout Spacing ---
    listContent: {
      flexGrow: 1,
      paddingBottom: 120, // Kept your original bottom padding for tab bar clearance
    },
    headerComponentContainer: {
      paddingBottom: SPACING.md,
    },

    // --- Header Section ---
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.md,
      marginBottom: SPACING.lg,
    },
    title: {
      fontSize: 30, // Kept your exact font size
      fontWeight: "800", // Kept your exact font weight
      color: colors.textPrimary,
    },
    subtitle: {
      marginTop: 6,
      fontSize: 14,
      color: colors.textSecondary,
    },
    downloadButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      // Subtle shadow to make it pop like a premium app
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2, 
    },

    // --- Search & Filters ---
    searchContainer: {
      paddingHorizontal: SPACING.lg,
      marginBottom: 24,
    },
    filterSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16, // Kept your exact font size
      fontWeight: "700", // Kept your exact font weight
      color: colors.textPrimary,
      paddingHorizontal: SPACING.lg,
      marginBottom: 12,
    },
    chipScrollContent: {
      paddingHorizontal: SPACING.lg,
      gap: 8, // Native gap property prevents abrupt edge cutoffs when scrolling
    },
    availableNotesTitle: {
      marginTop: 8,
      marginBottom: 16,
    },

    // --- Empty State ---
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 60,
      paddingHorizontal: 32,
    },
    emptyIcon: {
      marginBottom: 16,
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    emptySubtitle: {
      marginTop: 6,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
  });