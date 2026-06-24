import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useThemeStore } from "../../store/themeStore";
import { useLearningAnalyticsStore } from "../../store/learningAnalyticsStore";
import { ThemePalette } from "../../theme/colors";

const LearningAnalyticsCard = () => {
  const { analytics, fetchAnalytics } = useLearningAnalyticsStore();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (!analytics) return null;

  // CRITICAL FIX: Changed from Subject to Topic to match the single-subject backend reality
  const items = [
    { label: "Strongest Chapter", value: analytics.strongestChapter || "N/A", icon: "trending-up", color: colors.success },
    { label: "Weakest Weakest", value: analytics.weakestChapter || "N/A", icon: "trending-down", color: colors.error },
    { label: "Notes Completion", value: `${analytics.notesCompletion}%`, icon: "book-open", color: colors.primary },
    { label: "Quiz Average", value: `${analytics.averageQuizScore}%`, icon: "check-circle", color: colors.warning },
    { label: "Learning Streak", value: `${analytics.learningStreak} Days`, icon: "zap", color: "#F59E0B" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Feather name="book" size={18} color={colors.textPrimary} />
        </View>
        <Text style={styles.title}>Learning Analytics</Text>
      </View>

      <View style={styles.listContainer}>
        {items.map((item, index) => (
          <View
            key={item.label}
            style={[styles.row, index === items.length - 1 && styles.lastRow]}
          >
            <View style={styles.labelGroup}>
              <Feather name={item.icon as any} size={16} color={colors.textSecondary} style={styles.rowIcon} />
              <Text style={styles.label}>{item.label}</Text>
            </View>
            <Text style={[styles.value, { color: item.color }]} numberOfLines={1} ellipsizeMode="tail">
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ... keep your createStyles exactly as it is!

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    container: {
      padding: 20,
      borderRadius: 24,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 12,
      elevation: 2,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    headerIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.textPrimary,
      letterSpacing: -0.3,
    },
    listContainer: {
      backgroundColor: colors.background,
      borderRadius: 16,
      paddingHorizontal: 16,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    lastRow: {
      borderBottomWidth: 0,
    },
    labelGroup: {
      flexDirection: "row",
      alignItems: "center",
    },
    rowIcon: {
      marginRight: 10,
    },
    label: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: "500",
    },
    value: {
      fontSize: 15,
      fontWeight: "700",
    },
  });

export default LearningAnalyticsCard;