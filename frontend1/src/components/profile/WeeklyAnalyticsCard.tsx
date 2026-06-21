import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useAnalyticsStore } from "../../store/analyticsStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const WeeklyAnalyticsCard = () => {
  const { weeklyAnalytics, fetchWeeklyAnalytics } = useAnalyticsStore();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  useEffect(() => {
    fetchWeeklyAnalytics();
  }, [fetchWeeklyAnalytics]);

  if (!weeklyAnalytics) return null;

  const metrics = [
    { label: "Study Hours", value: `${weeklyAnalytics.studyHours}h` },
    { label: "XP Earned", value: weeklyAnalytics.xpEarned },
    { label: "Notes Read", value: weeklyAnalytics.notesRead },
    { label: "Assignments", value: weeklyAnalytics.assignmentsSubmitted },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Feather name="bar-chart-2" size={18} color={colors.textPrimary} />
        </View>
        <Text style={styles.title}>Weekly Overview</Text>
      </View>

      <View style={styles.grid}>
        {metrics.map((metric) => (
          <View key={metric.label} style={styles.metricCard}>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricLabel}>{metric.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.chartTitle}>Weekly Trend</Text>

      <View style={styles.chartContainer}>
        {weeklyAnalytics.weeklyTrend.map((value, index) => (
          <View key={index} style={styles.barWrapper}>
            <View
              style={[
                styles.bar,
                { height: Math.max(24, value * 12) }, // Minimum height of 24 so empty days are visible
                value === 0 && { backgroundColor: colors.border }, // Gray out 0 days
              ]}
            />
            <Text style={styles.dayText}>{DAYS[index]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

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
      marginBottom: 20,
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
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    metricCard: {
      width: "48%",
      padding: 16,
      marginBottom: 12,
      borderRadius: 16,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
    },
    metricValue: {
      fontSize: 22,
      fontWeight: "800",
      color: colors.primary,
      marginBottom: 4,
    },
    metricLabel: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: "600",
    },
    chartTitle: {
      marginTop: 20,
      marginBottom: 16,
      fontSize: 15,
      fontWeight: "700",
      color: colors.textSecondary,
      textAlign: "center",
    },
    chartContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      height: 120,
      paddingHorizontal: 8,
    },
    barWrapper: {
      alignItems: "center",
      flex: 1,
    },
    bar: {
      width: 24, // Wider bars
      borderRadius: 12,
      backgroundColor: colors.primary,
    },
    dayText: {
      marginTop: 12,
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: "600",
    },
  });

export default WeeklyAnalyticsCard;