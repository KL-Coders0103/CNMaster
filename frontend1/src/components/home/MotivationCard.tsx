import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useDashboardStore } from "../../store/dashboardStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const MotivationCard = () => {
  const dashboard = useDashboardStore(state => state.dashboard);
  const motivation = dashboard?.motivation;
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  if (!motivation) return null;

  return (
    <View style={styles.container}>
      <View style={styles.accentLine} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Feather name="message-circle" size={16} color={colors.primary} />
          <Text style={styles.sectionTitle}>Daily Motivation</Text>
        </View>
        <Text style={styles.quoteText}>"{motivation.text}"</Text>
        <Text style={styles.quoteAuthor}>— {motivation.author}</Text>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  accentLine: {
    width: 4,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 12,
  },
  quoteAuthor: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
});

export default MotivationCard;