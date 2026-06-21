import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useAssignmentStore } from "../../store/assignmentStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const AssignmentAnalyticsCard = () => {
  const { assignmentAnalytics, fetchAssignmentAnalytics } = useAssignmentStore();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  useEffect(() => {
    fetchAssignmentAnalytics();
  }, [fetchAssignmentAnalytics]);

  if (!assignmentAnalytics) return null;

  // Added semantic colors and icons for a premium dashboard look
  const analytics = [
    {
      label: "Completed",
      value: assignmentAnalytics.completed,
      icon: "check-circle",
      color: colors.success,
      bgColor: `${colors.success}15`, // 15% opacity
    },
    {
      label: "Pending",
      value: assignmentAnalytics.pending,
      icon: "clock",
      color: colors.warning,
      bgColor: `${colors.warning}15`,
    },
    {
      label: "Avg Marks",
      value: `${assignmentAnalytics.averageMarks}%`,
      icon: "award",
      color: colors.primary,
      bgColor: colors.primaryLight || `${colors.primary}15`,
    },
    {
      label: "Submission",
      value: `${assignmentAnalytics.submissionRate}%`,
      icon: "trending-up",
      color: "#8B5CF6", // Purple for rates/trending
      bgColor: "rgba(139, 92, 246, 0.15)",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Feather name="pie-chart" size={18} color={colors.textPrimary} />
        </View>
        <Text style={styles.title}>Assignment Analytics</Text>
      </View>

      <View style={styles.grid}>
        {analytics.map((item) => (
          <View key={item.label} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={[styles.iconWrapper, { backgroundColor: item.bgColor }]}>
                <Feather name={item.icon as any} size={16} color={item.color} />
              </View>
            </View>

            <Text style={[styles.value, { color: item.color }]} numberOfLines={1}>
              {item.value}
            </Text>
            
            <Text style={styles.label} numberOfLines={1}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    container: {
      // Removed outer margins since AnalyticsScreen handles the spacing
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
    card: {
      width: "48%",
      padding: 16,
      borderRadius: 20,
      marginBottom: 16,
      backgroundColor: colors.background, // Creates a nice inset look
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTop: {
      flexDirection: "row",
      justifyContent: "flex-start",
      marginBottom: 12,
    },
    iconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    label: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: "500",
      marginTop: 4,
    },
    value: {
      fontSize: 24,
      fontWeight: "800",
      letterSpacing: -0.5,
    },
  });

export default AssignmentAnalyticsCard;