import React, { useEffect, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useHeatmapStore } from "../../store/heatmapStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"];

const ConsistencyHeatmapCard = () => {
  const { heatmap, fetchHeatmap } = useHeatmapStore();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  useEffect(() => {
    fetchHeatmap();
  }, [fetchHeatmap]);

  // Safely grab the color based on intensity and dark mode context
  const getBoxColor = (intensity: number) => {
    if (!intensity || intensity === 0) {
      return colors.isDarkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9";
    }
    // Professional blue ramp
    const activeColors = ["#BFDBFE", "#60A5FA", "#3B82F6", "#1D4ED8"];
    return activeColors[Math.min(intensity - 1, 3)];
  };

  // Restructure the flat array into a 2D array of weeks (columns of 7 days)
  const weeks = useMemo(() => {
    if (!heatmap) return [];
    const chunks = [];
    for (let i = 0; i < heatmap.length; i += 7) {
      chunks.push(heatmap.slice(i, i + 7));
    }
    return chunks;
  }, [heatmap]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Feather name="calendar" size={18} color={colors.textPrimary} />
        </View>
        <View>
          <Text style={styles.title}>Consistency Heatmap</Text>
          <Text style={styles.subtitle}>Daily learning streaks</Text>
        </View>
      </View>

      {/* Grid Layout */}
      <View style={styles.heatmapWrapper}>
        
        {/* Y-Axis: Day Labels */}
        <View style={styles.dayLabels}>
          {DAYS_OF_WEEK.map((day, index) => (
            <Text 
              key={index} 
              style={[
                styles.dayText, 
                // Only show M, W, F to keep it clean (indices 1, 3, 5)
                (index === 1 || index === 3 || index === 5) ? {} : { opacity: 0 }
              ]}
            >
              {day}
            </Text>
          ))}
        </View>

        {/* X-Axis: Scrollable Columns */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollGrid}
        >
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekColumn}>
              {week.map((day, dayIndex) => (
                <View
                  key={dayIndex}
                  style={[
                    styles.heatBox,
                    { backgroundColor: getBoxColor(day.intensity) },
                  ]}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Legend */}
      <View style={styles.legendWrapper}>
        <Text style={styles.legendText}>Less</Text>
        <View style={styles.legendBoxes}>
          {[0, 1, 2, 3, 4].map((level) => (
            <View
              key={level}
              style={[styles.heatBox, { backgroundColor: getBoxColor(level) }]}
            />
          ))}
        </View>
        <Text style={styles.legendText}>More</Text>
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
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.textPrimary,
      letterSpacing: -0.3,
    },
    subtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
      fontWeight: "500",
    },
    heatmapWrapper: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    dayLabels: {
      marginRight: 8,
      gap: 4, // Ensures exact alignment with the boxes
    },
    dayText: {
      height: 14, // Exact height of the heatBox
      lineHeight: 14,
      fontSize: 11,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    scrollGrid: {
      flexDirection: "row",
      gap: 4, // Spacing between columns (weeks)
      paddingRight: 16, // Extra padding at the end of the scroll
    },
    weekColumn: {
      gap: 4, // Spacing between rows (days)
    },
    heatBox: {
      width: 14,
      height: 14,
      borderRadius: 4,
    },
    legendWrapper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      marginTop: 20,
      paddingTop: 16,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    legendBoxes: {
      flexDirection: "row",
      gap: 4,
      marginHorizontal: 8,
    },
    legendText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
    },
  });

export default ConsistencyHeatmapCard;