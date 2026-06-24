import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { useDashboardStore } from "../../store/dashboardStore";
import { useThemeStore } from "../../store/themeStore";
import { ThemePalette } from "../../theme/colors";

const WEEKS_COUNT = 13;
const DAYS_PER_WEEK = 7;
const TOTAL_DAYS = WEEKS_COUNT * DAYS_PER_WEEK; // 91 Days
const GAP = 4;
const Y_AXIS_WIDTH = 18;

// ⚙️ DYNAMIC SIZING MATH:
// Screen Width - Padding(40) - Card Padding(40) - Y-Axis(18) - Y-Axis Margin(8) - Borders(2)
const { width } = Dimensions.get("window");
const AVAILABLE_WIDTH = width - 108; 
const SQUARE_SIZE = (AVAILABLE_WIDTH - (GAP * (WEEKS_COUNT - 1))) / WEEKS_COUNT;

const Y_AXIS_LABELS = ["", "M", "", "W", "", "F", ""];

const WeeklyHeatmapCard = () => {
  const dashboard = useDashboardStore(state => state.dashboard);
  const activityHeatmap = dashboard?.activityHeatmap ?? [];
  const { colors, isDarkMode } = useThemeStore();
  const styles = createStyles(colors);

  const [selectedDay, setSelectedDay] = useState<{ date: string; xp: number } | null>(null);

  // Quick lookup map
  const activityMap = new Map(activityHeatmap.map(item => [item.date, item.xp]));
  
  // 📅 ALIGN CALENDAR TO WEEKDAYS
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the Saturday of the current week to anchor the grid end
  const endOfWeek = new Date(today);
  const daysUntilSaturday = 6 - today.getDay();
  endOfWeek.setDate(today.getDate() + daysUntilSaturday);

  const cells = [];
  let totalXp = 0;

  // Generate 91 cells, guaranteed to start on Sunday and end on Saturday
  for (let i = TOTAL_DAYS - 1; i >= 0; i--) {
    const date = new Date(endOfWeek);
    date.setDate(endOfWeek.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const isFuture = date > today;
    
    // Future days get 0 XP and aren't interactive
    const xp = isFuture ? 0 : (activityMap.get(dateString) ?? 0);
    if (!isFuture) totalXp += xp;

    cells.push({ date: dateString, xp, isFuture });
  }

  // Chunk into 13 columns of 7 days
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const getColor = (xp: number, isFuture: boolean) => {
    if (isFuture || xp === 0) return isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
    if (xp <= 20) return "#9BE9A8"; 
    if (xp <= 50) return "#40C463"; 
    if (xp <= 100) return "#30A14E"; 
    return "#216E39"; 
  };

  // CRITICAL FIX: Manually split the YYYY-MM-DD string to force local timezone parsing
  const formatDisplayDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day); 
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Learning Consistency</Text>

      <View style={styles.card}>
        
        <View style={styles.heatmapWrapper}>
          
          {/* Y-AXIS (Days of Week) */}
          <View style={styles.yAxisContainer}>
            {Y_AXIS_LABELS.map((label, index) => (
              <Text 
                key={index} 
                style={[styles.yAxisLabel, { height: SQUARE_SIZE, marginBottom: index === 6 ? 0 : GAP }]}
              >
                {label}
              </Text>
            ))}
          </View>

          {/* GRID */}
          <View style={styles.heatmapGrid}>
            {weeks.map((week, weekIndex) => (
              <View key={`week-${weekIndex}`} style={styles.weekColumn}>
                {week.map((day, dayIndex) => {
                  const isSelected = selectedDay?.date === day.date;
                  return (
                    <Pressable
                      key={`${weekIndex}-${dayIndex}`}
                      onPress={() => {
                        if (!day.isFuture) setSelectedDay(day);
                      }}
                      style={[
                        styles.heatmapSquare,
                        { backgroundColor: getColor(day.xp, day.isFuture) },
                        isSelected && styles.selectedSquare,
                        day.isFuture && styles.futureSquare
                      ]}
                    />
                  );
                })}
              </View>
            ))}
          </View>

        </View>

        <View style={styles.divider} />

        <View style={styles.footerContainer}>
          <View style={styles.readoutContainer}>
            {selectedDay ? (
              <Text style={styles.summaryText}>
                <Text style={styles.summaryHighlight}>{selectedDay.xp} XP</Text> on {formatDisplayDate(selectedDay.date)}
              </Text>
            ) : (
              <Text style={styles.summaryText}>
                <Text style={styles.summaryHighlight}>{Math.round(totalXp)} XP</Text> in last 90 days
              </Text>
            )}
          </View>

          <View style={styles.legendRight}>
            <Text style={styles.legendText}>Less</Text>
            <View style={styles.legendSquares}>
              {[0, 10, 30, 70, 150].map((level, index) => (
                <View
                  key={`legend-${index}`}
                  style={[styles.legendSquareStyle, { backgroundColor: getColor(level, false) }]}
                />
              ))}
            </View>
            <Text style={styles.legendText}>More</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    overflow: "hidden",
  },
  heatmapWrapper: {
    flexDirection: "row",
    padding: 20,
    alignItems: "flex-start",
  },
  yAxisContainer: {
    width: Y_AXIS_WIDTH,
    marginRight: 8,
    alignItems: "center",
  },
  yAxisLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: "600",
    textAlignVertical: "center", 
    includeFontPadding: false,
  },
  heatmapGrid: {
    flex: 1,
    flexDirection: "row",
    gap: GAP,
  },
  weekColumn: {
    gap: GAP,
  },
  heatmapSquare: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    borderRadius: SQUARE_SIZE * 0.25,
    borderWidth: 1,
    borderColor: "transparent",
  },
  futureSquare: {
    opacity: 0.3, // Makes future days look distinct/faded
  },
  selectedSquare: {
    borderColor: colors.primary,
    borderWidth: 2,
    transform: [{ scale: 1.15 }],
    zIndex: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  readoutContainer: {
    flex: 1,
  },
  summaryText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  summaryHighlight: {
    color: colors.textPrimary,
    fontWeight: "700",
  },
  legendRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  legendSquares: {
    flexDirection: "row",
    gap: 4,
  },
  legendSquareStyle: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});

export default WeeklyHeatmapCard;